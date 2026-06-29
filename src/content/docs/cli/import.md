---
title: avc import
description: Import AVC history from an archive.
---

Merges snapshots, branches, and objects from an [`avc export`](/agentic-vc/cli/export/) bundle into the current project.

Objects are written using content-addressed paths — blobs already present are silently skipped. Database rows are inserted with `INSERT OR IGNORE`, so existing snapshots with the same ID are left unchanged. Importing is therefore safe to re-run.

## Usage

```bash
avc import --from my-project.avc.tar.gz
avc import --from archive.avc.tar.gz --json
```

## Flags

| Flag | Description |
|------|-------------|
| `--from <path>` | Path to the `.avc.tar.gz` bundle to import (required) |
| `--json` | JSON output |

## JSON output

```json
{
  "bundle": "my-project.avc.tar.gz",
  "project_name": "my-project",
  "snapshot_count": 18,
  "object_count": 240,
  "skipped_rows": 3
}
```

`skipped_rows` counts rows that already existed in the target project and were left untouched.

After importing, run [`avc list`](/agentic-vc/cli/list/) to see the imported snapshots, then [`avc restore`](/agentic-vc/cli/restore/) to bring files onto disk.
