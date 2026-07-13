---
title: avc merge
description: Line-level three-way merge with protected paths and merge trains.
---

Three-way merge using the branch point, main HEAD, and branch HEAD. Files changed only on the branch auto-apply; files changed on both sides are merged **line by line** — only genuinely overlapping edits produce a conflict. See [Concepts → Merges](/concepts/merges/) for the conceptual model.

## Usage

```bash
avc merge feat-auth                  # perform the merge
avc merge feat-auth --preview        # dry-run, show counts only
avc merge --abort                    # restore main from pre-merge snapshot
avc merge feat-auth --allow-protected   # human override for protected paths
avc merge --train feat-a feat-b feat-c --validate "go test ./..."
```

## Flags

| Flag | Description |
|------|-------------|
| `--preview` | Show counts (clean / merged / conflict / skipped) without modifying files |
| `--abort` | Restore `main` from the auto-snapshot taken before the last merge |
| `--allow-protected` | Proceed even if the merge changes `[protect]` paths (human override; agents cannot pass this) |
| `--train` | Merge multiple branches in order, stopping at the first conflict |
| `--validate <command>` | Run a command after each `--train` merge; failure rolls that merge back and stops (requires `[run] enabled`) |
| `--json` | JSON output |

## Per-file decisions

| Changed on `main`? | Changed on branch? | Decision |
|:---:|:---:|---|
| ❌ | ✅ | `clean` — branch version applied |
| ✅ | ❌ | `skip` — main's version stays |
| ✅ | ✅ (different regions) | `merged` — combined line by line |
| ✅ | ✅ (overlapping lines) | `conflict` — hunk-level markers written |
| — | deleted on branch | `delete` — removed from main |

Conflicting edits are resolved **line-by-line, not file-by-file**: if two sides touch different regions of the same file, AVC combines both automatically. Only genuinely overlapping lines produce a conflict marker (adjacent edits with no unchanged line between them conflict, matching git/diff3 semantics).

## JSON output

```json
{
  "merge_id": "merge-abc123",
  "branch": "feat-auth",
  "clean": 3,
  "merged": 1,
  "deleted": 0,
  "conflicts": 0,
  "skipped": 12,
  "files": [
    { "path": "src/auth.go", "decision": "merged" }
  ],
  "post_merge_snapshot_id": "snap-def456",
  "auto_snapshot_id": "snap-ghi789"
}
```

- `post_merge_snapshot_id` — the snapshot capturing the merged state of `main` (clean merges only).
- `auto_snapshot_id` — present when the branch workspace had un-snapshotted changes; those are captured automatically before the merge so nothing is silently dropped. `--preview` reports these as `workspace_dirty_files` instead of capturing them.

## Safety

Before every merge, AVC takes an automatic snapshot of `main`. Undo a merge with either:

```bash
avc merge --abort     # roll back the in-progress / last merge
avc undo              # reverse the last completed merge (reactivates the branch too)
```

## Protected paths

If `[protect]` is configured in `.avc/config.toml`, a merge that would change a protected path (CI config, secrets, build files) is refused in `block` mode:

```toml
[protect]
paths = [".github/workflows/**", "secrets/**", "*.pem"]
mode  = "block"    # "block" (default) | "warn"
```

The refusal happens **before anything is written** — no snapshot, no merge record. A human can override with `avc merge <branch> --allow-protected`; the MCP merge tool has **no** equivalent, so agents cannot lift the gate. In `warn` mode the merge proceeds but the protected paths are surfaced in the output and `--json` (`protected_changes`).

## Merge trains

Merge several branches into `main` in one pass, each against the **current** main (so every merge sees the ones before it):

```bash
avc merge --train feat-a feat-b feat-c
avc merge --train feat-a feat-b --validate "go test ./..."
```

Per branch, in order:

1. Preview against current main. A conflict or a `[protect]` block **stops the train before writing anything**; that branch is reported and the rest are `skipped`. Completed merges are kept — each individually reversible via `avc undo`.
2. Clean → the full merge pipeline runs.
3. `--validate "<command>"` runs against post-merge main through the sandbox (**requires `[run] enabled = true`**). A non-zero exit rolls exactly that merge back — pre-merge snapshot restored, branch reactivated — and stops the train.

Train result JSON reports each branch's `status` (`merged` / `conflicts` / `blocked_protected` / `validation_failed` / `error` / `skipped`), plus `completed` and `stopped_at`. The command exits non-zero when the train stopped early.

## Resolving conflicts

When `conflicts > 0`, AVC writes hunk-level markers into the affected files:

```
<<<<<<< main (ours)
the version from main
||||||| base (common ancestor)
the original version
=======
the version from the branch
>>>>>>> branch (theirs)
```

Edit them, then take a new snapshot to record the resolution and run the merge again.
