---
title: avc list
description: List all snapshots on the active branch, newest first.
---

Lists all snapshots on the current branch, newest first.

## Usage

```bash
avc list
avc list --json
avc list --search "auth refactor"
avc list --agent claude
avc list --since 2024-06-01 --until 2024-06-30
avc list --changed src/auth.go
avc list --tag stable
avc list --all              # snapshots from all branches, not just active
avc list --limit 20
```

`avc search <query>` is a shorthand alias for `avc list --search <query>`.

## Flags

| Flag | Description |
|------|-------------|
| `--search <text>` | Full-text search on label and notes |
| `--agent <name>` | Filter by agent name (substring match) |
| `--since <YYYY-MM-DD>` | Show snapshots after this date |
| `--until <YYYY-MM-DD>` | Show snapshots before this date |
| `--changed <path>` | Show snapshots that tracked this file path |
| `--tag <tag>` | Show snapshots with this tag |
| `--limit <n>` | Max results, `0` for unlimited (default 50) |
| `--all` | Show snapshots from all branches, not just the active one |
| `--json` | JSON output |

Filters narrow the result set but do not widen branch scope — combine with `--all` to search across every branch.

## JSON output

```json
[
  {
    "id": "snap-def456",
    "label": "Fixed bug in auth",
    "timestamp": 1712282400,
    "agent_name": "claude",
    "files_changed": 3,
    "total_size": 512000,
    "notes": "Security patch",
    "branch_id": "br-main"
  }
]
```

Returns an empty array `[]` if no snapshots exist.

## Notes

- Only snapshots on the **active branch** are returned. Use `avc branch switch <name>` to see another branch's snapshots
- Order is newest first by `timestamp`
- For tree-style history output, use [`avc log`](/agentic-vc/cli/log/) instead
