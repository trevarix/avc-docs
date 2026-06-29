---
title: avc snapshot
description: Create a snapshot of the current project state.
---

Walks the project, hashes every tracked file, and creates a content-addressed snapshot in the database. Identical files across snapshots share a single object — storage is automatically deduplicated.

## Usage

```bash
avc snapshot "Before refactor"
avc snapshot "v1.2.0 release" --agent claude --notes "Passed tests"
avc snapshot "WIP" --json
```

## Arguments

| Argument | Required | Description |
|----------|---------|-------------|
| `<label>` | yes | Short human-readable description |

## Flags

| Flag | Description |
|------|-------------|
| `--agent <name>` | Agent or user name creating the snapshot |
| `--notes <text>` | Free-form notes attached to the snapshot |
| `--json` | JSON output |

## JSON output

```json
{
  "id": "snap-xyz789",
  "label": "v1.2.0 release",
  "timestamp": 1712289600,
  "agent_name": "claude",
  "files_changed": 42,
  "total_size": 1048576,
  "notes": "Passed tests",
  "branch_id": "br-main",
  "success": true
}
```

## What gets included

- Every file in the project root, recursively
- Excluding patterns in `.avcignore`
- Excluding `.avc/`, `.git/`, `.hg/`, `.svn/`, `.bzr/` always

The active branch determines which branch the snapshot lands on. Use `avc branch list` to check.

## Branch-aware behaviour

If you're on a non-main branch, AVC walks the **workspace directory** (`.avc/workspaces/<branch>/`), not the real project root. This is how branch isolation works — snapshots on a branch capture workspace state, the real project is untouched.

On `main`, the project root is walked directly.

## `avc snapshot tag` / `avc snapshot untag`

```bash
avc snapshot tag snap-abc123 stable
avc snapshot untag snap-abc123 stable
```

Tags a snapshot with a machine-readable label (e.g. `stable`, `v1.2.0`). Tags are searchable via `avc list --tag <tag>`. Applying the same tag twice is a no-op.

JSON output:

```json
{
  "snapshot_id": "snap-abc123",
  "tag": "stable",
  "success": true
}
```
