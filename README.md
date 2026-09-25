# CPC Toolbelt — Grok

**Publisher:** AIwander  
**Tagline:** Tools Cursor/Grok reach for when you ask

Toolbelt-scoped install layer for **Grok Build CLI**. Parallel to [GrokCLI](https://github.com/AIWander/GrokCLI) but **does not replace it**.

## Install alongside GrokCLI

If you want both:

| Layer | Repo | Namespace |
|---|---|---|
| Protocol skills/hooks | [GrokCLI](https://github.com/AIWander/GrokCLI) | `cpc-*` |
| Toolbelt install layer | **this repo** | `toolbelt-*` skills + hooks under `~/.grok/hooks/cpc-toolbelt/` |

They are complementary: GrokCLI = protocol/behavior; Toolbelt-Grok = Hands/Cache path/optionals walkthrough.

## What you get

| Piece | How it ships (v1) |
|---|---|
| Hands | Required MCP snippet `mcp-snippets/hands.json` |
| Cache | Path `CPC_CACHE` (suggest `C:\CPC\cache`) + skills/hooks — **no MCP** |
| Voice / Workflow / Manager | Optional snippets |
| Programmer | Directed only (`add-programmer` / `programmer.json`) |

Do **not** brand as autonomous. No autonomous Volumes dependency in these hooks.

## Quick start

1. Read `START-GROK.md` and `AGENTS.md`.
2. Copy `skills/toolbelt-*` → `~/.grok/skills/` (or your Grok skills path).
3. Copy `hooks/*.js` → `~/.grok/hooks/cpc-toolbelt/` and register via `grok-hooks.example.json`.
4. Wire Hands MCP from `mcp-snippets/hands.json`; set `CPC_CACHE`.
5. Run `toolbelt-doctor`.

## Related

- Cursor plugin: [CPC-Toolbelt](https://github.com/AIWander/CPC-Toolbelt)
- Protocol: [GrokCLI](https://github.com/AIWander/GrokCLI)
- Human tour: [StartHERE](https://github.com/AIWander/StartHERE)
- Installers: [CPC-Suite](https://github.com/AIWander/CPC-Suite)

## Validate

```bash
node scripts/validate.mjs
```
