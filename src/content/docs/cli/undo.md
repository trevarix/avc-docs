---
title: avc undo
description: Reverse the most recent restore or merge with zero arguments.
---

Reverses the most recent state-changing operation — a `restore` or a `merge` — with no arguments. AVC records every such operation together with the safety snapshot that reverses it, so `undo` never needs you to know which snapshot to go back to.

Running `avc undo` twice acts as **redo**: each undo records itself, so undoing an undo restores the state the first undo replaced.

## Usage

```bash
avc undo            # reverse the last restore or merge
avc undo --list     # show recent operations without undoing anything
avc undo --json
```

## Flags

| Flag | Description |
|------|-------------|
| `--list` | List recent operations (most recent first) instead of undoing |
| `--json` | JSON output |

## What it reverses

| Last operation | `avc undo` result |
|----------------|-------------------|
| `restore` | Working tree returns to its pre-restore state (the safety snapshot AVC took before the restore) |
| `merge` | `main` is restored from the pre-merge snapshot, and the merged branch is reactivated with its workspace rebuilt |

If the working tree was dirty when the original operation ran, that dirty state was captured as a safety snapshot and is what `undo` returns you to. On a clean tree, `undo` falls back to the branch HEAD.

## Example

```bash
avc restore snap-abc123     # roll back to an earlier snapshot
# ...realize that was a mistake
avc undo                    # back to where you were
avc undo                    # redo — forward to snap-abc123 again
```

## Notes

- `avc undo` with no operations recorded yet exits non-zero with a clear "nothing to undo" message.
- Undoing a merge marks the agent branch `active` again and rebuilds its workspace, so you can resume the branch where it left off.
- The operations log is also surfaced in [`avc timeline`](/cli/timeline/), interleaved with snapshots.
