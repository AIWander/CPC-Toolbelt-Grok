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
| Hands | Required stdio MCP snippet `mcp-snippets/hands.json` → `${HANDS_HOME}/servers/hands.exe` |
| Cache | Path `CPC_CACHE`, or `<Hands home>/cache` when that variable is unset. Skills and hooks only — **no MCP** |
| Voice / Workflow / Manager | Optional stdio snippets |
| Programmer | Directed only (`add-programmer` / `programmer.json`) |

Do **not** brand as autonomous. No autonomous Volumes dependency in these hooks.

## Paths

Resolved when a hook runs. Nothing in this repo points at one person's machine.

1. **Hands home:** `HANDS_HOME` if set, else `CPC_ROOT` (older installs), else `%LOCALAPPDATA%\AIWander\Hands`. When `LOCALAPPDATA` is unset, that is the current user's application-data directory plus `AIWander/Hands`.
2. **Cache:** `CPC_CACHE` if set, else `<Hands home>/cache`.
3. **Binaries:** `<Hands home>/servers/<name>.exe`.

`CPC_ROOT` and `CPC_CACHE` are back-compat environment overrides. Leave them empty on a new install.

## Quick start

1. Read `START-GROK.md` and `AGENTS.md`.
2. Copy `skills/` → `~/.grok/skills/` (or your Grok skills path).
3. Copy `hooks/*.js` and `scripts/resolve-paths.cjs` → `~/.grok/hooks/cpc-toolbelt/` and register via `grok-hooks.example.json`.
4. Wire Hands as stdio from `mcp-snippets/hands.json`. Fill `HANDS_HOME` at install time. Set `CPC_CACHE` only when Cache should not live under that home.
5. Run `getting-started` (`hands_setup_status` first), then `toolbelt-doctor`.

## MCP transport

Every snippet in `mcp-snippets/` is **stdio**. Commands use `${HANDS_HOME}` (filled at install time). Do not paste an absolute path back into this repository. If the host cannot expand variables, write the resolved stdio command only into the user's private MCP config.

This pack does not publish a shared-host port map. Remote use, when you need it, is a private tunnel you sign into yourself. The `getting-started` skill walks through that. There is no public link by default.

## Related

- Lane map: [`RELATIONSHIP.md`](./RELATIONSHIP.md)
- Cursor plugin: [CPC-Toolbelt](https://github.com/AIWander/CPC-Toolbelt)
- Claude install layer: [CPC-Toolbelt-Claude](https://github.com/AIWander/CPC-Toolbelt-Claude)
- Codex install layer: [CPC-Toolbelt-Codex](https://github.com/AIWander/CPC-Toolbelt-Codex)
- Protocol: [GrokCLI](https://github.com/AIWander/GrokCLI) — install alongside if you want both
- Human tour: [StartHERE](https://github.com/AIWander/StartHERE)
- Signed installers: [CPC-Suite](https://github.com/AIWander/CPC-Suite)

## Validate

```bash
node scripts/validate.mjs
```
