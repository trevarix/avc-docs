---
title: avc status
description: Show files changed since the last snapshot.
---

Compares the current working tree against the last snapshot on the active branch. Output mirrors `git status`: one line per changed file with an A/M/D prefix and line counts.

On an agent branch, this compares the **branch workspace** (`.avc/workspaces/<branch>/`), not the real project root — consistent with how [`avc snapshot`](/agentic-vc/cli/snapshot/) is branch-aware.

## Usage

```bash
avc status
avc status --json
```

## JSON output

```json
{
  "branch": "feat-auth",
  "snapshot_id": "snap-abc123",
  "snapshot_label": "Baseline",
  "files": [
    { "path": "src/auth/login.go", "type": "modified", "lines_added": 12, "lines_removed": 8 }
  ],
  "changed_count": 1
}
```

If there are no snapshots yet on the active branch, `avc status` prints a hint to run `avc snapshot` and exits without error.
