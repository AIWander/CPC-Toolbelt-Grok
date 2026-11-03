#!/usr/bin/env node
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

function mustExist(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) errors.push('missing: ' + rel);
  return p;
}

function readJson(rel) {
  const p = mustExist(rel);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    errors.push('invalid JSON ' + rel + ': ' + e.message);
    return null;
  }
}

mustExist('README.md');
mustExist('LICENSE');
mustExist('START-GROK.md');
mustExist('AGENTS.md');
mustExist('PACK_MATRIX.md');
mustExist('RELATIONSHIP.md');
mustExist('grok-hooks.example.json');
mustExist('hooks/HOOKS_README.md');
mustExist('mcp-snippets/README.md');
mustExist('scripts/resolve-paths.cjs');

if (fs.existsSync(path.join(root, 'mcp.shared-http.example.json'))) {
  errors.push('mcp.shared-http.example.json must not ship');
}

function assertStdioSnippet(rel, doc) {
  if (!doc || typeof doc !== 'object') return;
  for (const [name, spec] of Object.entries(doc)) {
    if (name.startsWith('_')) continue;
    if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
      errors.push(rel + ' ' + name + ' is not an object');
      continue;
    }
    if (spec.url) errors.push(rel + ' ' + name + ' must be stdio, not a url');
    if (spec.type !== 'stdio') errors.push(rel + ' ' + name + ' must set type "stdio"');
    const cmd = String(spec.command || '');
    if (!cmd) {
      errors.push(rel + ' ' + name + ' missing command');
      continue;
    }
    if (/^[A-Za-z]:[\\/]/.test(cmd) || cmd.startsWith('/') || cmd.startsWith('\\\\')) {
      errors.push(rel + ' ' + name + ' command is an absolute path');
    }
    if (!/\$\{(?:HANDS_HOME|CPC_ROOT|CPC_CACHE|CURSOR_PLUGIN_ROOT|CLAUDE_PLUGIN_ROOT)\}/.test(cmd)) {
      errors.push(rel + ' ' + name + ' command must use an install-time or plugin-root variable');
    }
  }
}

for (const s of ['hands', 'voice', 'workflow', 'manager', 'programmer']) {
  const j = readJson('mcp-snippets/' + s + '.json');
  if (j && s === 'hands' && !j['cpc-hands']) errors.push('hands snippet missing cpc-hands');
  assertStdioSnippet('mcp-snippets/' + s + '.json', j);
}

if (fs.existsSync(path.join(root, 'mcp-snippets/cache.json'))) {
  errors.push('v1 must not ship mcp-snippets/cache.json (Cache is path-only)');
}

for (const script of ['hooks/session_start.js', 'hooks/cache_first_prompt.js', 'hooks/stop_nudge.js']) {
  mustExist(script);
}

for (const skill of [
  'getting-started',
  'toolbelt-setup',
  'toolbelt-doctor',
  'cache-first',
  'enable-optional',
  'add-programmer',
  'hands-check',
]) {
  const sk = mustExist('skills/' + skill + '/SKILL.md');
  if (fs.existsSync(sk)) {
    const t = fs.readFileSync(sk, 'utf8');
    if (!t.startsWith('---')) errors.push(skill + ' SKILL.md missing frontmatter');
  }
}

const gettingStarted = path.join(root, 'skills', 'getting-started', 'SKILL.md');
if (fs.existsSync(gettingStarted)) {
  const t = fs.readFileSync(gettingStarted, 'utf8');
  if (!t.includes('hands_setup_status')) {
    errors.push('getting-started skill must tell the agent to call hands_setup_status first');
  }
  if (!/Tailscale/i.test(t)) errors.push('getting-started skill must walk through a private tunnel');
  if (!/never store/i.test(t)) errors.push('getting-started skill must say never store keys');
  if (!/public/i.test(t)) errors.push('getting-started skill must refuse a public link by default');
}

const start = fs.readFileSync(path.join(root, 'START-GROK.md'), 'utf8');
for (const needle of ['Cache path', 'Programmer', 'Optional', 'GrokCLI']) {
  if (!start.includes(needle)) warnings.push('START-GROK missing mention: ' + needle);
}
if (!/not.*autonomous|Do not brand|not brand as autonomous/i.test(start)) {
  errors.push('START-GROK must explicitly reject autonomous branding');
}
if (!/HANDS_HOME/.test(start)) errors.push('START-GROK must document HANDS_HOME');
if (!/stdio/i.test(start)) errors.push('START-GROK must describe stdio MCP');

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
if (!/alongside GrokCLI|install alongside/i.test(readme)) {
  errors.push('README must say install alongside GrokCLI');
}
if (!/toolbelt-/i.test(readme)) {
  errors.push('README must mention toolbelt-* namespace');
}
if (!/HANDS_HOME/.test(readme)) errors.push('README must mention HANDS_HOME');
if (!/CPC_CACHE/.test(readme)) errors.push('README must mention CPC_CACHE');
if (!/stdio/i.test(readme)) errors.push('README must describe stdio MCP');

const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
if (!/HANDS_HOME/.test(agents)) errors.push('AGENTS.md must document HANDS_HOME');
if (!/stdio/i.test(agents)) errors.push('AGENTS.md must describe stdio MCP');

const snipReadme = fs.readFileSync(path.join(root, 'mcp-snippets', 'README.md'), 'utf8');
if (!/HANDS_HOME/.test(snipReadme)) errors.push('mcp-snippets/README.md must document HANDS_HOME');
if (!/stdio/i.test(snipReadme)) errors.push('mcp-snippets/README.md must describe stdio');

const gh = readJson('grok-hooks.example.json');
if (gh) {
  const keys = Object.keys(gh.hooks || {});
  for (const k of ['SessionStart', 'UserPromptSubmit', 'Stop']) {
    if (!keys.includes(k)) errors.push('grok-hooks.example.json missing ' + k);
  }
}

const skipScan = new Set([path.normalize('scripts/validate.mjs')]);
const scanExt = new Set(['.md', '.mdc', '.js', '.mjs', '.cjs', '.json', '.svg', '.txt', '.yml', '.yaml']);
const machineRes = [
  new RegExp('C:[\\\\/]+' + 'CPC\\b', 'i'),
  new RegExp('suite_' + 'attempts', 'i'),
  new RegExp('\\b' + String.fromCharCode(66, 69, 69) + '\\b'),
  new RegExp('Jose' + 'p'),
  new RegExp('\\b' + ['p', 'a', 'l'].join('') + '\\b', 'i'),
  new RegExp('tail' + '7263d4', 'i'),
  new RegExp('\\b100\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b'),
  new RegExp('[A-Za-z]:\\\\Users\\\\', 'i'),
  new RegExp('\\b777' + '[1-9]\\b'),
];

const bannedFixtures = [
  'C:' + '\\CPC',
  'C:' + '/CPC/cache',
  'suite_' + 'attempts',
  String.fromCharCode(66, 69, 69),
  'Jose' + 'p',
  ['p', 'a', 'l'].join(''),
  'tail' + '7263d4',
  ['100', '64', '0', '1'].join('.'),
  'C:' + '\\Users\\' + 'someone',
  '777' + '1',
  '777' + '9',
];
for (const sample of bannedFixtures) {
  if (!machineRes.some((re) => re.test(sample))) {
    errors.push('validator fixture was not rejected');
  }
}
const allowedTokens = [
  'HANDS_HOME',
  '%LOCALAPPDATA%\\AIWander\\Hands',
  '${HANDS_HOME}/servers/hands.exe',
  'CPC_ROOT',
  'CPC_CACHE',
];
for (const sample of allowedTokens) {
  if (machineRes.some((re) => re.test(sample))) {
    errors.push('validator rejected a portable path token');
  }
}

function walk(dir, relBase) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const abs = path.join(dir, name);
    const rel = relBase ? relBase + '/' + name : name;
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      walk(abs, rel);
      continue;
    }
    if (!scanExt.has(path.extname(name))) continue;
    if (skipScan.has(path.normalize(rel))) continue;
    const text = fs.readFileSync(abs, 'utf8');
    for (const re of machineRes) {
      if (re.test(text)) errors.push('hard-coded machine path or host detail in ' + rel + ' (' + re + ')');
    }
  }
}
walk(root, '');

function hookEnv() {
  const env = { ...process.env, CPC_TOOLBELT_DOCTOR_ON_STOP: '0' };
  for (const key of ['HANDS_HOME', 'CPC_ROOT', 'CPC_CACHE', 'HANDS_SHARED_PORT', 'LOCALAPPDATA', 'XDG_DATA_HOME']) {
    delete env[key];
  }
  return env;
}

for (const [script, stdin] of [
  ['hooks/session_start.js', '{}'],
  ['hooks/cache_first_prompt.js', JSON.stringify({ prompt: 'find the skill file' })],
  ['hooks/stop_nudge.js', JSON.stringify({ status: 'completed' })],
]) {
  const r = spawnSync(process.execPath, [path.join(root, script)], {
    input: stdin,
    encoding: 'utf8',
    env: hookEnv(),
  });
  if (r.status !== 0) errors.push(script + ' exited ' + r.status);
  try {
    JSON.parse((r.stdout || '{}').trim() || '{}');
  } catch {
    errors.push(script + ' did not emit JSON');
  }
  if (r.stdout && machineRes.some((re) => re.test(r.stdout))) {
    errors.push(script + ' emitted a machine-specific path');
  }
}

function resolverEnv(extra) {
  const env = { ...process.env };
  for (const key of ['HANDS_HOME', 'CPC_ROOT', 'CPC_CACHE', 'HANDS_SHARED_PORT', 'LOCALAPPDATA', 'XDG_DATA_HOME']) {
    delete env[key];
  }
  return { ...env, ...extra };
}

function runResolver(extra) {
  const script = path.join(root, 'scripts', 'resolve-paths.cjs');
  const code =
    'const r = require(' +
    JSON.stringify(script) +
    ').resolveToolbeltPaths(); process.stdout.write(JSON.stringify(r));';
  return spawnSync(process.execPath, ['-e', code], {
    encoding: 'utf8',
    env: resolverEnv(extra),
    timeout: 5000,
  });
}

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'toolbelt-'));
const viaRoot = path.join(fixture, 'root');
const viaHands = path.join(fixture, 'hands-home');
const viaCache = path.join(fixture, 'cache');
const viaLocal = path.join(fixture, 'local');

const fromRoot = runResolver({ CPC_ROOT: viaRoot });
try {
  const json = JSON.parse((fromRoot.stdout || '').trim());
  if (json.home?.source !== 'CPC_ROOT' || json.home?.path !== path.resolve(viaRoot)) {
    errors.push('CPC_ROOT should override the default Hands home when HANDS_HOME is unset');
  }
  if (json.cache?.path !== path.join(path.resolve(viaRoot), 'cache')) {
    errors.push('default Cache must be <Hands home>/cache');
  }
} catch {
  errors.push('resolve-paths.cjs did not emit JSON for the CPC_ROOT override');
}

const preferHands = runResolver({ HANDS_HOME: viaHands, CPC_ROOT: viaRoot, CPC_CACHE: viaCache });
try {
  const json = JSON.parse((preferHands.stdout || '').trim());
  if (json.home?.source !== 'HANDS_HOME' || json.home?.path !== path.resolve(viaHands)) {
    errors.push('HANDS_HOME must win over CPC_ROOT');
  }
  if (json.cache?.source !== 'CPC_CACHE' || json.cache?.path !== path.resolve(viaCache)) {
    errors.push('CPC_CACHE must override <Hands home>/cache');
  }
  if (json.handsExe !== path.join(path.resolve(viaHands), 'servers', 'hands.exe')) {
    errors.push('hands.exe must stay under the resolved home');
  }
} catch {
  errors.push('resolve-paths.cjs did not emit JSON for the HANDS_HOME override');
}

const defaults = runResolver({ LOCALAPPDATA: viaLocal });
try {
  const json = JSON.parse((defaults.stdout || '').trim());
  const expectedHome = path.join(viaLocal, 'AIWander', 'Hands');
  if (json.home?.source !== 'default' || json.home?.path !== expectedHome) {
    errors.push('default Hands home must be %LOCALAPPDATA%/AIWander/Hands');
  }
  if (json.cache?.path !== path.join(expectedHome, 'cache')) {
    errors.push('default Cache must be <Hands home>/cache when CPC_CACHE is unset');
  }
} catch {
  errors.push('resolve-paths.cjs did not emit JSON for the default home');
}

const result = { root, errors, warnings, ok: errors.length === 0 };
console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
