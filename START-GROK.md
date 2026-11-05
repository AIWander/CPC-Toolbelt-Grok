# Start here — Grok Build + CPC Toolbelt

**Give Grok Build local abilities on the computer you already use.**

This walkthrough is for **Grok Build CLI**. It does not replace [StartHERE](https://github.com/AIWander/StartHERE) (human tour) or the Cursor plugin. It points Grok at the same CPC Toolbelt binaries.

> Protocol skills + hooks live in [GrokCLI](https://github.com/AIWander/GrokCLI). This page is the **Toolbelt install path**. Install alongside GrokCLI if you want both — different namespaces (`toolbelt-*` vs `cpc-*`).

## What you get

| Piece | MCP key | Default |
|---|---|---|
| Hands | `cpc-hands` | **Required** stdio |
| Cache | _(path only)_ `CPC_CACHE` | **Cache path** — `CPC_CACHE`, or `<Hands home>/cache` |
| Voice | `cpc-voice` | Optional — ask |
| Workflow | `cpc-workflow` | Optional — ask |
| Manager (Beta) | `cpc-manager` | Optional — ask |
| Programmer | `cpc-programmer` | **Not** default for Grok; add only if directed |

Tagline: *Tools Grok reaches for when you ask.*  
Do **not** brand as autonomous.

## Paths

Resolved when a hook runs, and when you follow `getting-started`. Nothing in this repo points at one person's machine.

1. **Hands home:** `HANDS_HOME` if set, else `CPC_ROOT` (older installs), else `%LOCALAPPDATA%\AIWander\Hands`. When `LOCALAPPDATA` is unset, that is the current user's application-data directory plus `AIWander/Hands`.
2. **Cache:** `CPC_CACHE` if set, else `<Hands home>/cache`.
3. **Binaries:** `<Hands home>/servers/<name>.exe`.

`CPC_ROOT` and `CPC_CACHE` are back-compat environment overrides. Leave them empty on a new install.

## Before you start

1. CPC Toolbelt binaries installed for this user (see Paths).
2. Grok Build CLI installed.
3. Optionally [GrokCLI](https://github.com/AIWander/GrokCLI) for protocol skills/hooks.

## Step 1 — Install Toolbelt skills + hooks

1. Copy `skills/` → `~/.grok/skills/`
2. Copy `hooks/*.js` and `scripts/resolve-paths.cjs` → `~/.grok/hooks/cpc-toolbelt/` (the resolver must sit next to the hook scripts)
3. Register hooks using `grok-hooks.example.json` (SessionStart / UserPromptSubmit / Stop)

## Step 2 — Point at Toolbelt (agent: ask these)

1. **Hands home** — `HANDS_HOME`, else `CPC_ROOT` if they still use it, else the per-user AIWander Hands directory. Do not invent a drive path.
2. **Cache path** — `CPC_CACHE`, or `<Hands home>/cache`.
3. **Optionals** — Voice? Workflow? Manager (Beta)?
4. **Programmer** — only if the human asks (Claude Desktop includes Programmer by default; Grok does not).

## Step 3 — Wire local MCP

Use snippets in `mcp-snippets/`. They are stdio. `${HANDS_HOME}` is filled at install time. Hands is required. Cache is **path only** for v1 — do not wire a `cpc-cache` MCP. There is no Cache MCP binary in v1.

If the host cannot expand `${HANDS_HOME}`, write the resolved stdio command only into the user's private MCP config. Never commit an absolute path.

## Step 4 — First run

1. Run the `getting-started` skill. Call `hands_setup_status` before any other Hands tool.
2. Confirm `cpc-hands` tools appear.
3. Prefer Cache before network when an asset may be cached.
4. Run `hands-check` / `toolbelt-doctor`.

## Related

- Cursor plugin: [CPC-Toolbelt](https://github.com/AIWander/CPC-Toolbelt)
- Protocol: [GrokCLI](https://github.com/AIWander/GrokCLI)
- Human tour: [StartHERE](https://github.com/AIWander/StartHERE)
- Installers: [CPC-Suite](https://github.com/AIWander/CPC-Suite)
