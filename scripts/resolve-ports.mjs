#!/usr/bin/env node
// Resolve the shared-host MCP port map for THIS machine.
//
// Ports are per-install, not fixed. Resolution order (first hit wins, per service):
//   1. Env var CPC_PORT_<SERVICE>   e.g. CPC_PORT_HANDS=8772
//   2. Ports file: $CPC_PORTS_FILE, else %CPC_ROOT%\shared-mcp\ports.json
//      ({ "hands": 8772, "workflow": 8775 } — only list what you changed)
//   3. Built-in defaults (_default_ports in mcp.shared-http.example.json)
//
// Usage:
//   node scripts/resolve-ports.mjs            -> prints the resolved map as JSON
//   node scripts/resolve-ports.mjs --servers  -> also prints an mcpServers block
//                                                (url paths still come from your local mcp.json)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const example = JSON.parse(fs.readFileSync(path.join(root, 'mcp.shared-http.example.json'), 'utf8'));

// Free-pack services only; autonomous is a paid wedge and never resolved here.
const SERVICES = ['hands', 'local', 'manager', 'workflow', 'voice', 'programmer', 'ops', 'stocks'];
const WIRED = { hands: 'cpc-hands', manager: 'cpc-manager', workflow: 'cpc-workflow', voice: 'cpc-voice', programmer: 'cpc-programmer' };

function validPort(v) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 && n < 65536 ? n : null;
}

function readPortsFile() {
  const cpcRoot = process.env.CPC_ROOT || 'C:\\CPC';
  const file = process.env.CPC_PORTS_FILE || path.join(cpcRoot, 'shared-mcp', 'ports.json');
  if (!fs.existsSync(file)) return { file, ports: {} };
  try {
    return { file, ports: JSON.parse(fs.readFileSync(file, 'utf8')) };
  } catch (e) {
    console.error(`warning: ignoring unreadable ports file ${file}: ${e.message}`);
    return { file, ports: {} };
  }
}

const defaults = example._default_ports || {};
const { file, ports: fromFile } = readPortsFile();
const resolved = {};
const source = {};
for (const svc of SERVICES) {
  const env = validPort(process.env['CPC_PORT_' + svc.toUpperCase()]);
  const fileVal = validPort(fromFile[svc]);
  const def = validPort(defaults[svc]);
  if (env) [resolved[svc], source[svc]] = [env, 'env'];
  else if (fileVal) [resolved[svc], source[svc]] = [fileVal, 'ports-file'];
  else if (def) [resolved[svc], source[svc]] = [def, 'default'];
}

const out = { ports_file: file, ports: resolved, source };
if (process.argv.includes('--servers')) {
  out.mcpServers = {};
  for (const [svc, key] of Object.entries(WIRED)) {
    if (resolved[svc]) out.mcpServers[key] = { url: `http://127.0.0.1:${resolved[svc]}/<path-from-local-mcp.json>` };
  }
}
console.log(JSON.stringify(out, null, 2));
