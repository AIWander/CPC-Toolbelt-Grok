# CPC Toolbelt hooks (Grok)

Copy `*.js` from this folder and `scripts/resolve-paths.cjs` to `~/.grok/hooks/cpc-toolbelt/` (the resolver sits next to the scripts), then register with `grok-hooks.example.json`.

| Grok / Claude-style event | Script | Cursor cousin |
|---|---|---|
| SessionStart | `session_start.js` | `sessionStart` |
| UserPromptSubmit | `cache_first_prompt.js` | `beforeSubmitPrompt` |
| Stop | `stop_nudge.js` | `stop` |

Scripts emit both `additional_context` (Cursor) and `additionalContext` (Claude/Grok) where useful. Fail-open.

`sessionStart` sets `HANDS_HOME` and `CPC_CACHE` only when they are unset. Runtime paths live in `scripts/resolve-paths.cjs`. Home is `HANDS_HOME`, else `CPC_ROOT`, else `%LOCALAPPDATA%\AIWander\Hands`. Cache is `CPC_CACHE`, else `<home>/cache`. There is no machine-specific fallback.

## Diff vs GrokCLI
- Toolbelt install focus (Hands, Cache path, doctor) — **no** autonomous Volumes dependency
- Skill/hook namespace `toolbelt-*` / `cpc-toolbelt/` vs GrokCLI `cpc-*`
