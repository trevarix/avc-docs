---
title: avc trash
description: Inspect and recover files quarantined by a restore.
---

`avc restore` never permanently deletes an untracked file. Anything a restore sweeps out of the way is quarantined under `.avc/trash/<op-id>/` instead, so nothing a restore removes is unrecoverable until you explicitly empty the trash.

## Subcommands

```bash
avc trash list                       # show quarantined files, grouped by operation
avc trash restore <op-id> [path]     # recover a quarantined file (or a whole op)
avc trash empty                      # permanently delete all quarantined files
avc trash empty --older-than 7d      # only delete entries older than a duration
```

## `avc trash list`

```bash
avc trash list
avc trash list --json
```

Groups quarantined files by the restore operation that swept them. Each entry has an **operation ID** (a timestamp string like `2026-07-12T20-54-11-restore-abc123`) you pass to `restore`.

```json
[
  {
    "op_id": "2026-07-12T20-54-11-restore-abc123",
    "kind": "restore",
    "created_at": "2026-07-12T20:54:11-04:00",
    "files": ["loose.txt"]
  }
]
```

Returns `null` when the trash is empty.

## `avc trash restore`

```bash
avc trash restore 2026-07-12T20-54-11-restore-abc123 loose.txt   # one file
avc trash restore 2026-07-12T20-54-11-restore-abc123             # every file in the op
```

Recovers quarantined files back to their original locations. It **never overwrites a live file** — if something already exists at the target path, the restore refuses rather than clobbering it. The (now empty) operation directory is removed once its files are recovered.

## `avc trash empty`

```bash
avc trash empty
avc trash empty --older-than 30d
```

| Flag | Description |
|------|-------------|
| `--older-than <duration>` | Only remove entries older than this (e.g. `7d`, `24h`) |
| `--json` | JSON output |

Permanently deletes quarantined files. This is the only way trash contents are ever removed — AVC never auto-empties it.

## See also

- [`avc restore`](/cli/restore/) — the operation that quarantines files
- [`avc undo`](/cli/undo/) — reverse the restore itself
