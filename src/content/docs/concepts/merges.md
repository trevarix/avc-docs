---
title: Merges
description: Three-way merge with conflict detection, written markers, and always-reversible operations.
---

A **merge** applies the work an agent did on a branch back to `main`. AVC's merge is a **three-way merge**: it compares the base snapshot (where the branch was created), the current state of `main`, and the branch's HEAD snapshot to decide what to apply.

If diffing answers "what did the agent do?" and branching answers "where did it work?", merging answers "what reaches the main project?".

## How the three-way merge works

```
                   base snapshot
                       /    \
              (main edits)   (branch edits)
                    /          \
              main HEAD     branch HEAD
                    \          /
                     \        /
                    merged main
```

For every file:

| Modified on `main`? | Modified on branch? | Outcome |
|:---:|:---:|---|
| ❌ | ✅ | **Clean apply** — branch version applied to `main` |
| ✅ | ❌ | **Skipped** — main's version stays |
| ❌ | ❌ | **Untouched** — no change |
| ✅ | ✅ (different regions) | **Merged** — combined line by line |
| ✅ | ✅ (overlapping lines) | **Conflict** — the diverging hunks are marked |

Clean, skipped, and cleanly-merged files apply automatically. Only genuinely overlapping edits surface as conflicts.

## Line-level merge

When both sides change the same file, AVC runs a **line-level three-way merge** (diff3), not a whole-file hash comparison. If the two sides touched different regions, both edits are combined automatically and the file merges cleanly. Only the regions that actually overlap become conflicts — and the markers wrap just those hunks, not the whole file.

Edits on truly *adjacent* lines (with no unchanged line between them as a synchronization point) conflict rather than being guessed at — the same behavior as git/diff3.

## Conflict markers

When AVC detects an overlapping conflict, it writes the file with diff3-style markers showing all three versions — main, the common base, and the branch — so you can see what each side changed from:

```
<<<<<<< main (ours)
the version from main
||||||| base (common ancestor)
the original version
=======
the version from the branch
>>>>>>> branch (theirs)
```

You resolve the conflict by editing the file (just like Git), then take a new snapshot to mark the resolution.

## Protected paths

Teams can declare paths agents may not integrate — CI config, secrets, build files — under `[protect]` in `.avc/config.toml`. A merge that would change a protected path is refused mechanically in `block` mode (or flagged in `warn` mode), **before anything is written**. Only a human running `avc merge <branch> --allow-protected` can override it; the MCP merge tool has no such escape hatch. See [`avc merge` → Protected paths](/cli/merge/#protected-paths).

## Merge trains

Several branches can be integrated in one pass with `avc merge --train a b c`. Each branch is merged against the *current* `main`, so every merge sees the ones before it. The train stops at the first conflict or protected-path block, keeping the completed merges (each reversible via `avc undo`). An optional `--validate "<command>"` runs after each merge and rolls that merge back if it fails. See [`avc merge` → Merge trains](/cli/merge/#merge-trains).

## Always reversible

Before every merge, AVC takes an automatic snapshot of `main` (labelled `pre-merge: before merging branch '<name>'`). If the merge goes wrong — wrong files applied, conflicts you don't want to deal with, anything — undo it two ways:

```bash
avc merge --abort     # roll back an in-progress or just-completed merge
avc undo              # reverse the last completed merge (also reactivates the branch)
```

Both restore `main` from the pre-merge snapshot. `avc undo` additionally marks the merged branch `active` again and rebuilds its workspace, so you can resume it.

## Commands

```bash
avc merge <branch>                  # apply clean changes, surface conflicts
avc merge <branch> --preview        # dry-run: show counts only, modify nothing
avc merge --abort                   # restore main from the pre-merge snapshot
```

Preview output:

```
Preview: merge "feat-auth" → main
  Clean:     12 file(s)
  Conflicts:  1 file(s)
  Skipped:    0 file(s)
```

This lets you decide whether to proceed before any files are touched.

## What the merge records

Every merge attempt is logged in the `merges` and `merge_files` tables:

| Table | Stores |
|-------|--------|
| `merges` | merge ID, branch, timestamp, base snapshot, target branch HEAD, pre-merge safety snapshot ID |
| `merge_files` | per-file decision: `clean` / `conflict` / `skip` |

You can query these via the database if you want a merge audit trail.

## Implementation notes

The merge engine opens the database in **three separate phases** to avoid lock contention:

1. **Plan** — read all three snapshots' file lists, compute per-file decisions
2. **Apply** — write clean files to the working tree, write conflict markers where needed
3. **Record** — write the `merges` row and per-file results

Each phase opens and closes the DB connection. This is one of the architectural rules in [CLAUDE.md](https://github.com/trevarix/blob/main/CLAUDE.md) — one DB connection per operation.

## When merge is appropriate

Merge a branch when:

- The agent's work has been reviewed (by you or by tests)
- You want to incorporate the changes into `main` for downstream work
- The branch is "done" and you no longer need its isolation

If the agent's work was bad, **don't merge — delete**:

```bash
avc branch delete feat-bad-idea
```

Nothing reaches `main`. The workspace is cleaned up. You're back to square one.

## What merge is not

- **Not** a Git merge — no merge commits, no `--no-ff`, no octopus merges
- **Not** a rebase — branch snapshots are preserved as-is, they're just applied to `main`'s working tree
- **Not** automatic — you always run it explicitly; agents don't merge their own work
