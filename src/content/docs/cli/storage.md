---
title: avc storage
description: Show AVC disk usage for the current project.
---

Breaks down how much disk space AVC is using for the project:

- **Database** — `.avc/avc.db`
- **Objects** — `.avc/objects/` (content-addressed blobs, zstd-compressed where it saves space)
- **Workspaces** — `.avc/workspaces/` (one directory per agent branch)

## Usage

```bash
avc storage
avc storage --by-branch
avc storage --by-snapshot --limit 5
avc storage --json
```

## Flags

| Flag | Description |
|------|-------------|
| `--by-branch` | Show a per-branch snapshot size summary from the database |
| `--by-snapshot` | List the largest individual snapshots |
| `--limit <n>` | Max rows to show with `--by-snapshot` (default 10) |
| `--json` | JSON output |

## JSON output

```json
{
  "project_name": "my-project",
  "database_bytes": 204800,
  "objects_bytes": 10485760,
  "workspaces_bytes": 2097152,
  "total_bytes": 12787712,
  "branches": [
    { "name": "main", "snapshot_count": 12, "total_bytes": 8388608 }
  ],
  "snapshots": [
    { "id": "snap-abc123", "label": "Baseline", "branch_name": "main", "total_bytes": 1048576 }
  ]
}
```

`branches` and `snapshots` are only populated when `--by-branch` / `--by-snapshot` (or `--json`) is used.

If usage is high, run [`avc gc`](/cli/gc/) to reclaim space from objects no longer referenced by any snapshot.
