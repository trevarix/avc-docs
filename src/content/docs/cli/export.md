---
title: avc export
description: Export AVC history to a portable archive.
---

Bundles snapshots, branches, and file objects into a single `.tar.gz` file that can be moved to another machine and re-imported with [`avc import`](/cli/import/).

## Usage

```bash
avc export                                   # full export, auto-named
avc export --output my-project.avc.tar.gz    # full export, explicit name
avc export --branch feature/auth             # export one branch only
avc export --json
```

## Flags

| Flag | Description |
|------|-------------|
| `--output <path>` | Output file path (default: `<project>-<timestamp>.avc.tar.gz`) |
| `--branch <name>` | Export only this branch's snapshots (default: all branches) |
| `--json` | JSON output |

## JSON output

```json
{
  "output": "my-project-1712289600.avc.tar.gz",
  "project_name": "my-project",
  "branches": ["main", "feature/auth"],
  "snapshot_count": 18,
  "object_count": 240
}
```

## See also

- [`avc import`](/cli/import/) — bring an exported archive into another project
