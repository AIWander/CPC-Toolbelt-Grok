# MCP snippets

stdio only. `${HANDS_HOME}` is filled at install time. Never commit an absolute path.

The Hands home is `HANDS_HOME`, else `CPC_ROOT` when that older variable is set, else `%LOCALAPPDATA%\AIWander\Hands` (or the current user's application-data directory plus `AIWander/Hands`).

| Key | Binary | Default |
|---|---|---|
| `cpc-hands` | `hands.exe` | Required |
| `cpc-voice` | `voice.exe` | Optional |
| `cpc-workflow` | `workflow.exe` | Optional |
| `cpc-manager` | `manager.exe` | Optional (Beta) |
| `cpc-programmer` | `programmer.exe` | Directed only |

**Cache:** `CPC_CACHE`, or `<Hands home>/cache`. No Cache MCP snippet for v1.

Commands are `<Hands home>/servers/<name>.exe`. If the host cannot expand `${HANDS_HOME}`, write the resolved stdio command only into the user's private MCP config.
