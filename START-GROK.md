# Start here — Grok Build + CPC Toolbelt

**Give Grok Build local abilities on the PC you already own.**

This walkthrough is for **Grok Build CLI**. It does not replace [StartHERE](https://github.com/AIWander/StartHERE) (human tour) or the Cursor plugin. It points Grok at the same CPC Toolbelt binaries.

> Protocol skills + hooks live in [GrokCLI](https://github.com/AIWander/GrokCLI). This page is the **Toolbelt install path**. Install alongside GrokCLI if you want both — different namespaces (`toolbelt-*` vs `cpc-*`).

## What you get

| Piece | MCP key | Default |
|---|---|---|
| Hands | `cpc-hands` | **Required** |
| Cache | _(path only)_ `CPC_CACHE` | **Required path** — suggest `C:\CPC\cache` |
| Voice | `cpc-voice` | Optional — ask |
| Workflow | `cpc-workflow` | Optional — ask |
| Manager (Beta) | `cpc-manager` | Optional — ask |
| Programmer | `cpc-programmer` | **Not** default for Grok; add only if directed |

Tagline: *Tools Grok reaches for when you ask.*  
Do **not** brand as autonomous.

## Before you start

1. Windows PC with CPC binaries (often under `C:\CPC`).
2. Grok Build CLI installed.
3. Optionally [GrokCLI](https://github.com/AIWander/GrokCLI) for protocol skills/hooks.

## Step 1 — Install Toolbelt skills + hooks

1. Copy `skills/toolbelt-*` → `~/.grok/skills/`
2. Copy `hooks/*.js` → `~/.grok/hooks/cpc-toolbelt/`
3. Register hooks using `grok-hooks.example.json` (SessionStart / UserPromptSubmit / Stop)

## Step 2 — Point at Toolbelt (agent: ask these)

1. **CPC root** — default `C:\CPC` if present.
2. **Cache path** — suggest `C:\CPC\cache`. Save as `CPC_CACHE`.
3. **Optionals** — Voice? Workflow? Manager (Beta)?
4. **Programmer** — only if the human asks (Claude Desktop includes Programmer by default; Grok does not).

## Step 3 — Wire local MCP

Use snippets in `mcp-snippets/`. Hands is required. Cache is **path only** for v1 — do not wire a `cpc-cache` MCP (no `autocache.exe` on reference BEE).

## Step 4 — Doctor

1. Confirm `cpc-hands` tools appear.
2. Prefer Cache before network when an asset may be cached.
3. Run `hands-check` / `toolbelt-doctor`.

## Related

- Cursor plugin: sibling repo `CPC-Toolbelt`
- Protocol: [GrokCLI](https://github.com/AIWander/GrokCLI)
- Human tour: [StartHERE](https://github.com/AIWander/StartHERE)
- Installers: [CPC-Suite](https://github.com/AIWander/CPC-Suite)
