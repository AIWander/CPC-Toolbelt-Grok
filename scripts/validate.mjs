#!/usr/bin/env node
import fs from 'fs';
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
mustExist('grok-hooks.example.json');
mustExist('hooks/HOOKS_README.md');
mustExist('mcp-snippets/README.md');

for (const s of ['hands', 'voice', 'workflow', 'manager', 'programmer']) {
  const j = readJson('mcp-snippets/' + s + '.json');
  if (j && s === 'hands' && !j['cpc-hands']) errors.push('hands snippet missing cpc-hands');
}

if (fs.existsSync(path.join(root, 'mcp-snippets/cache.json'))) {
  errors.push('v1 must not ship mcp-snippets/cache.json (Cache is path-only)');
}

for (const script of ['hooks/session_start.js', 'hooks/cache_first_prompt.js', 'hooks/stop_nudge.js']) {
  mustExist(script);
}

for (const skill of [
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

const start = fs.readFileSync(path.join(root, 'START-GROK.md'), 'utf8');
for (const needle of ['Cache path', 'Programmer', 'Optional', 'GrokCLI']) {
  if (!start.includes(needle)) warnings.push('START-GROK missing mention: ' + needle);
}
if (!/not.*autonomous|Do not brand|not brand as autonomous/i.test(start)) {
  errors.push('START-GROK must explicitly reject autonomous branding');
}
if (!/CPC\\cache|CPC\/cache|CPC_CACHE/i.test(start)) {
  errors.push('START-GROK must suggest C:\\CPC\\cache');
}

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
if (!/alongside GrokCLI|install alongside/i.test(readme)) {
  errors.push('README must say install alongside GrokCLI');
}
if (!/toolbelt-/i.test(readme)) {
  errors.push('README must mention toolbelt-* namespace');
}

const gh = readJson('grok-hooks.example.json');
if (gh) {
  const keys = Object.keys(gh.hooks || {});
  for (const k of ['SessionStart', 'UserPromptSubmit', 'Stop']) {
    if (!keys.includes(k)) errors.push('grok-hooks.example.json missing ' + k);
  }
}

for (const [script, stdin] of [
  ['hooks/session_start.js', '{}'],
  ['hooks/cache_first_prompt.js', JSON.stringify({ prompt: 'find the skill file' })],
  ['hooks/stop_nudge.js', JSON.stringify({ status: 'completed' })],
]) {
  const r = spawnSync(process.execPath, [path.join(root, script)], {
    input: stdin,
    encoding: 'utf8',
    env: { ...process.env, CPC_TOOLBELT_DOCTOR_ON_STOP: '0' },
  });
  if (r.status !== 0) errors.push(script + ' exited ' + r.status);
  try {
    JSON.parse((r.stdout || '{}').trim() || '{}');
  } catch {
    errors.push(script + ' did not emit JSON');
  }
}

const result = { root, errors, warnings, ok: errors.length === 0 };
console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
