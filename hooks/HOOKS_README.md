# CPC Toolbelt hooks (Grok)

Copy `*.js` from this folder to `~/.grok/hooks/cpc-toolbelt/`, then register with `grok-hooks.example.json`.

| Grok / Claude-style event | Script | Cursor cousin |
|---|---|---|
| SessionStart | `session_start.js` | `sessionStart` |
| UserPromptSubmit | `cache_first_prompt.js` | `beforeSubmitPrompt` |
| Stop | `stop_nudge.js` | `stop` |

Scripts emit both `additional_context` (Cursor) and `additionalContext` (Claude/Grok) where useful. Fail-open.

## Diff vs GrokCLI
- Toolbelt install focus (Hands, Cache path, doctor) — **no** autonomous Volumes dependency
- Skill/hook namespace `toolbelt-*` / `cpc-toolbelt/` vs GrokCLI `cpc-*`
