#!/usr/bin/env node
'use strict';
/**
 * beforeSubmitPrompt / UserPromptSubmit — soft cache-first recall.
 * Fail-open. Never blocks submission.
 */
const fs = require('fs');
const path = require('path');

const LOOKUP_RE = /\b(download|fetch|install|get|find|locate|lookup|search|skill|asset|file|template|logo|binary|exe|mcp|cache|copy|pull|clone)\b/i;

function readInput() {
  try {
    const chunks = [];
    const buf = Buffer.alloc(65536);
    let n;
    while ((n = fs.readSync(0, buf, 0, buf.length, null)) > 0) {
      chunks.push(Buffer.from(buf.subarray(0, n)));
    }
    const raw = Buffer.concat(chunks).toString('utf8').trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadResolver() {
  const candidates = [
    path.join(__dirname, '..', 'scripts', 'resolve-paths.cjs'),
    path.join(__dirname, 'resolve-paths.cjs'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return require(candidate);
  }
  return null;
}

function main() {
  try {
    const input = readInput();
    const prompt = String(input.prompt || input.content || input.message || '');
    const resolver = loadResolver();
    const cache = resolver
      ? resolver.resolveToolbeltPaths().cache.path
      : 'CPC_CACHE or <Hands home>/cache';

    if (prompt && LOOKUP_RE.test(prompt)) {
      const ctx =
        'Cache-first: before downloading or fetching, check whether the skill/file/asset already exists under CPC_CACHE (' +
        cache +
        '). Prefer local Cache over network when a match is present.';
      process.stdout.write(
        JSON.stringify({
          continue: true,
          additional_context: ctx,
          additionalContext: ctx,
        }) + '\n'
      );
      return;
    }
    process.stdout.write(JSON.stringify({ continue: true }) + '\n');
  } catch {
    process.stdout.write(JSON.stringify({ continue: true }) + '\n');
  }
}

main();
