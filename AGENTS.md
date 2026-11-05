# AGENTS.md — Grok Build setup for CPC Toolbelt

You are helping install **CPC Toolbelt** for Grok Build CLI.

## Always
- Read `START-GROK.md` before changing MCP config.
- Ask the human; do not invent install paths.
- Use MCP keys prefixed `cpc-`.
- Call the cache product **Cache** in user-facing text.
- Never describe Toolbelt as autonomous / unattended / hands-off.
- Cache v1 is **path + skills only** — no `cpc-cache` MCP.
- MCP entries are stdio. Fill `${HANDS_HOME}` at install time. Never commit an absolute path.
- On first use, run `getting-started` and call `hands_setup_status` before any other Hands tool.

## Required questions (in order)
1. Confirm the Hands home: `HANDS_HOME` if set, else `CPC_ROOT` (older installs), else `%LOCALAPPDATA%\AIWander\Hands` (the current user's application-data directory plus `AIWander/Hands` when `LOCALAPPDATA` is unset).
2. Ask for the **Cache path** (`CPC_CACHE`). When they have not set one, use `<Hands home>/cache`.
3. Ask yes/no for each optional: Voice, Workflow, Manager (Beta).
4. **Do not** enable Programmer unless the human asks.

## After answers
1. Discover binaries under `<Hands home>/servers/` (`hands.exe`, `voice.exe`, `workflow.exe`, `manager.exe`, `programmer.exe`).
2. Write / merge the Grok MCP config for `cpc-hands` (+ opted optionals) from `mcp-snippets/`. Set `HANDS_HOME` so the stdio command expands. Set `CPC_CACHE` only when Cache is not `<Hands home>/cache`.
3. Verify tools are visible; run `hands-check`.
4. Stop. No public link by default. If they want another device to reach Hands, follow `getting-started`: a private tunnel, they sign in themselves, never store keys.

## Programmer exception
Claude Desktop packs include Programmer by default. Grok does **not**. If directed, use `mcp-snippets/programmer.json`.

## Binaries
A Toolbelt install home contains `servers/hands.exe`. Voice, Workflow, Manager, and Programmer are optional binaries in that same `servers` directory. There is no Cache MCP binary in v1. Cache is a directory.
