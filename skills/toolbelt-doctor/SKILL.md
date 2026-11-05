---
name: toolbelt-doctor
description: Use when CPC Toolbelt fails to load, Hands is missing from Available Tools, the Cache path looks wrong, or install paths need verification.
---

# CPC Toolbelt doctor

Resolve paths at runtime. Do not assume a fixed drive.

1. Hands home: `HANDS_HOME`, else `CPC_ROOT`, else `%LOCALAPPDATA%\AIWander\Hands` (or the current user's application-data directory plus `AIWander/Hands`). `HANDS_HOME` wins over `CPC_ROOT`.
2. Confirm `<Hands home>/servers/hands.exe` exists. Report that exact path. That is the stdio command the host would start (`${HANDS_HOME}/servers/hands.exe`, or the same path written into the user's private MCP config).
3. Cache is `CPC_CACHE`, else `<Hands home>/cache`. Confirm the directory exists. Do not create it unless the user says yes.
4. Confirm `cpc-hands` appears under Available Tools. It is stdio. Cache is **not** an MCP entry in v1.
5. If a tool fails, show the exact command and the OS error — do not guess.
6. Optionals: only diagnose servers the user enabled (`voice.exe`, `workflow.exe`, `manager.exe`).
7. Never claim a Cache MCP server exists unless a binary is actually on disk.

A shared-host TCP probe is out of scope unless the user set `HANDS_SHARED_PORT` and `<Hands home>/shared-mcp` exists. There is no built-in port. A closed port does not mean the install failed. Do not open files under `shared-mcp`.

## Do not

- Do not read Volumes.
- Do not brand Toolbelt or Hands as autonomous.
