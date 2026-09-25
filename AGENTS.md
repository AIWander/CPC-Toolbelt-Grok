# AGENTS.md — Grok Build setup for CPC Toolbelt

You are helping install **CPC Toolbelt** for Grok Build CLI on Windows.

## Always
- Read `START-GROK.md` before changing MCP config.
- Ask the human; do not invent install paths.
- Use MCP keys prefixed `cpc-`.
- Call the cache product **Cache** in user-facing text.
- Never describe Toolbelt as autonomous / unattended / hands-off.
- Cache v1 is **path + skills only** — no `cpc-cache` MCP.

## Required questions (in order)
1. Confirm or ask for `CPC_ROOT` (default `C:\CPC` if that folder exists).
2. Ask for **Cache path** (`CPC_CACHE`). Suggest `C:\CPC\cache`.
3. Ask yes/no for each optional: Voice, Workflow, Manager (Beta).
4. **Do not** enable Programmer unless the human asks.

## After answers
1. Discover binaries under `%CPC_ROOT%\servers\` (`hands.exe`, `voice.exe`, `workflow.exe`, `manager.exe`, `programmer.exe`).
2. Write / merge Grok MCP config for `cpc-hands` (+ opted optionals). Set `CPC_CACHE`.
3. Verify tools are visible; run `hands-check`.
4. Stop. Offer URL publish only if asked.

## Programmer exception
Claude Desktop packs include Programmer by default (installer future). Grok does **not**. If directed, use `mcp-snippets/programmer.json`.

## Binary truth (BEE, 2026-09-25)
`hands.exe`, `voice.exe`, `workflow.exe`, `manager.exe`, `programmer.exe`. **No** `autocache.exe`. Cache dir `C:\CPC\cache` exists.
