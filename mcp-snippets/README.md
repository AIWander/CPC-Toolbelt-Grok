# MCP snippets

Verified against reference BEE `C:\CPC\servers\\` (2026-09-25):

| Key | Binary | Default |
|---|---|---|
| `cpc-hands` | `hands.exe` | Required |
| `cpc-voice` | `voice.exe` | Optional |
| `cpc-workflow` | `workflow.exe` | Optional |
| `cpc-manager` | `manager.exe` | Optional (Beta) |
| `cpc-programmer` | `programmer.exe` | Directed only |

**Cache:** path via `CPC_CACHE` (suggest `C:\CPC\cache`). **No** `autocache.exe` / no `cache.json` MCP snippet for v1.

Replace `${CPC_ROOT}` for the target machine.
