---
title: avc branch
description: Create and manage branches (agent workspaces).
---

Branches isolate agent work in `.avc/workspaces/<branch>/` so experiments never touch your real project until you merge. See [Concepts → Branches](/concepts/branches/) for the conceptual model.

## Subcommands

```bash
avc branch create <name>       # create a branch from the current snapshot
avc branch create <name> --from-branch <parent>   # stack on another branch
avc branch list                # list active branches; * marks active
avc branch switch <name>       # switch active branch
avc branch delete <name>       # delete branch + remove workspace
avc branch diff <name>         # cumulative diff from branch point to branch HEAD
avc branch diff <a>..<b>       # compare two branches' latest snapshots
avc branch rename <old> <new>  # rename a branch
avc branch abandon <name>      # mark a branch abandoned (keeps history)
avc branch prune --merged      # remove workspaces for merged branches
```

## `avc branch create`

```bash
avc branch create feat-auth
avc branch create feat-auth --from snap-abc123
avc branch create feat-auth-tests --from-branch feat-auth   # stacked branch
```

| Flag | Description |
|------|-------------|
| `--from <snapshot_id>` | Branch from a specific snapshot instead of the latest on main |
| `--from-branch <parent>` | Stack on another branch: use its HEAD snapshot as the base |
| `--json` | JSON output |

JSON output:

```json
{
  "id": "br-feat-auth",
  "name": "feat-auth",
  "base_snapshot_id": "snap-abc123",
  "parent_branch": "",
  "workspace": "/path/to/project/.avc/workspaces/feat-auth",
  "active": true,
  "success": true
}
```

`avc branch create` **auto-switches** to the new branch. After running it, you're on the new branch and subsequent snapshots land there.

### Stacked branches (`--from-branch`)

`--from-branch <parent>` roots the new branch at the parent's **current HEAD**, so the child starts from the parent's latest work. Merging a child still targets `main` — its base snapshot already encodes the fork point, so the three-way math is unchanged (merge the parent first, then the child; a [merge train](/cli/merge/#merge-trains) handles the ordering). The lineage is recorded and shown by `avc branch list` (`(from feat-auth)`, and `parent_branch` in `--json`).

## `avc branch list`

```bash
avc branch list                  # active branches only (default)
avc branch list --all            # include merged and abandoned branches
avc branch list --status merged  # filter by a specific status
avc branch list --json
```

| Flag | Description |
|------|-------------|
| `--all` | Show all branches including merged and abandoned |
| `--status <status>` | Filter by status: `active`, `merged`, or `abandoned` |
| `--json` | JSON output |

JSON output:

```json
[
  { "id": "br-main", "name": "main", "active": true,  "base_snapshot_id": "", "workspace_path": "" },
  { "id": "br-feat-auth", "name": "feat-auth", "active": false, "base_snapshot_id": "snap-abc123", "workspace_path": "/path/.../feat-auth" }
]
```

## `avc branch switch`

```bash
avc branch switch main
avc branch switch feat-auth
```

Updates `.avc/config.toml`'s `[branch] active` field. No files are moved — switching is instantaneous because each branch already has its own workspace.

## `avc branch delete`

```bash
avc branch delete feat-bad-idea
avc branch delete feat-bad-idea --keep-history
```

| Flag | Description |
|------|-------------|
| `--keep-history` | Retain the branch's snapshot rows (detached, still visible via `avc list --all`); do not cascade-delete them |
| `--json` | JSON output |

By default this removes the branch record, its snapshots, and the workspace directory. With `--keep-history`, the snapshots survive as detached history. The object store is unaffected until you run [`avc gc`](/cli/gc/) — other branches may still reference those blobs.

You cannot delete `main`, nor the **currently active branch** — switch away first.

## `avc branch diff`

```bash
avc branch diff feat-auth                # base → HEAD of feat-auth
avc branch diff main..feat-auth          # HEAD of main → HEAD of feat-auth
avc branch diff feat-auth..feat-api      # compare two branches' HEADs
avc branch diff feat-auth --stat         # compact summary
avc branch diff feat-auth --json
```

| Flag | Description |
|------|-------------|
| `--stat` | Compact summary (file names + line counts) instead of the full diff |
| `--json` | JSON output |

The single-argument form returns the cumulative diff from the branch's base snapshot to its HEAD — "what has the agent done so far?". The `a..b` form compares two branches' HEAD snapshots instead — useful for seeing how two parallel agent branches differ before merging. Either side accepts any branch name, including `main`. The JSON shape mirrors [`avc diff`](/cli/diff/).

## `avc branch rename`

```bash
avc branch rename feat-auth feat-authentication
```

Renames a branch in place. Its workspace directory, snapshots, and history are unaffected.

## `avc branch abandon`

```bash
avc branch abandon feat-bad-idea
```

Marks a branch as `abandoned` without deleting anything — history, snapshots, and the workspace directory are all kept. Use this instead of `avc branch delete` when you want the branch to disappear from the default `avc branch list` view but remain recoverable.

## `avc branch prune`

```bash
avc branch prune --merged
```

Deletes the **workspace directories** for every branch with status `merged`, reclaiming disk space. Database records and snapshots are kept — only the materialized files under `.avc/workspaces/<branch>/` are removed.

## Workflow example

```bash
# Start a new agent task on a branch
avc branch create feat-refactor

# Agent works in .avc/workspaces/feat-refactor/
# Snapshots as usual; they land on the branch
avc snapshot "WIP refactor" --agent claude

# Review and merge back when done
avc merge feat-refactor --preview
avc merge feat-refactor
```
