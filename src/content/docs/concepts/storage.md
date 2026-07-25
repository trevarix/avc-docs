---
title: Storage Layout
description: How AVC organizes data on disk — SQLite metadata, content-addressed object store, workspace directories.
---

Everything AVC needs lives inside a single `.avc/` directory at the root of your project. No global config, no remote storage, no daemon.

## The `.avc/` layout

```
.avc/
├── avc.db                  # SQLite — all metadata (no file bytes)
├── config.toml             # Project config (active branch, protect, watch, run…)
├── .gitignore              # Tells Git to ignore the .avc/ directory
├── stat-cache.json         # mtime+size cache for fast incremental snapshots
├── watch.pid               # Present while `avc watch` is running (heartbeat lock)
├── objects/                # Content-addressed file blobs (zstd-compressed)
│   ├── ab/
│   │   └── cdef0123...     # SHA256 hash, sharded by first 2 hex chars
│   └── ff/
│       └── 0011223344...
├── trash/                  # Untracked files quarantined by `avc restore`
│   └── <op-id>/            # recover with `avc trash restore`
├── corrupt/                # Corrupt objects quarantined by `avc verify --repair`
└── workspaces/             # Branch workspaces (only for non-main branches)
    ├── feat-auth/
    │   ├── src/            # byte-for-byte copy of project root at branch time
    │   └── README.md
    └── feat-payments/
        └── ...
```

## SQLite metadata

The database holds **no file bytes** — only hashes, sizes, and relational metadata.

| Table | Purpose |
|-------|---------|
| `projects` | One row per AVC-initialized project (the project root path) |
| `branches` | All branches with base snapshot, status, and parent (for stacked branches) |
| `snapshots` | Snapshot metadata: label, agent, timestamp, branch, counts, plus `session_id` / `task` attribution |
| `files` | Per-snapshot file list: relative path, file hash, size, and Unix mode bits |
| `diffs` | Cached diff results + per-file change summaries (regenerated if missing) |
| `merges` | One row per merge attempt: branch, target, pre-merge safety snapshot |
| `merge_files` | Per-file decisions inside a merge: `clean` / `merged` / `conflict` / `delete` / `skip` |
| `operations` | The op log — every restore/merge/undo with the snapshot that reverses it (powers [`avc undo`](/cli/undo/)) |
| `snapshot_tags` | Machine-readable milestone tags applied to snapshots |
| `project_state` | The active branch name (authoritative; config.toml mirrors it) |

The schema is migration-aware and versioned (`PRAGMA user_version`) so a fully-migrated database skips the migration on subsequent opens. Upgrading AVC may add columns or tables; data is preserved.

## Content-addressed object store

File blobs are stored in `.avc/objects/<hash[:2]>/<hash[2:]>` — the same sharding scheme used by Git. Properties:

- **Deduplication** — identical files across snapshots share **one** object on disk
- **Immutability** — objects are write-once. Restoring an old snapshot reads the original bytes verbatim
- **Cheap snapshots** — only changed files produce new objects. A 1000-file project with one changed file adds exactly one object to the store
- **Sharded** — first two hex chars create a directory level, avoiding the "too many files in one directory" filesystem problem at scale

Example: if your `README.md` has SHA256 hash `abcd1234...ef`, it's stored at:

```
.avc/objects/ab/cd1234...ef
```

A snapshot row references this hash. Multiple snapshots referencing the same hash share the single stored object.

### On-disk object format

Each object is one of two forms, detected by prefix on read:

- **Compressed** — a 13-byte header (magic `AVCO`, a format byte, and the 8-byte raw size) followed by one zstd frame. Written only when compression actually saves space.
- **Raw** — the exact original bytes, headerless. Content that doesn't compress, and every object written before compression existed, is this form.

The two coexist with no migration. [`avc verify`](/cli/verify/) re-hashes every object to audit integrity; the hot read path deliberately does not (that would double read cost). [`avc storage`](/cli/storage/) reports compressed vs. raw bytes.

## Workspaces

`main` operates on the real project root directly — no workspace. Every other branch gets a materialized workspace at `.avc/workspaces/<branch-name>/`.

Workspaces are populated from the branch's base snapshot with a **byte-for-byte file copy**. Hardlinks are deliberately *not* used: a hardlinked file shares its inode with the project-root original, so an ordinary in-place edit (an editor, `sed -i`, an append) would silently mutate the real project too. The copy keeps the workspace fully isolated — the whole point of a branch.

## Stat cache

`.avc/stat-cache.json` makes incremental snapshots fast. After a snapshot:

```json
{
  "snapshot_id": "snap-abc123",
  "files": {
    "src/auth/login.go":   { "mtime_ns": 1745101234567890, "size": 4096, "hash": "abc..." },
    "src/auth/session.go": { "mtime_ns": 1745101234500000, "size": 2048, "hash": "def..." }
  }
}
```

On the next snapshot, AVC checks each file's `mtime + size` against the cache. If they match, the cached hash is reused — no read, no hash computation. Unchanged files are effectively free.

The cache is corruption-safe: if it's missing or invalid, AVC just re-hashes everything (slower, but never wrong).

## Telling Git to ignore `.avc/`

AVC writes `.avc/.gitignore` automatically. Inside `.avc/`:

```
*
```

This is the simplest possible ignore — ignore everything inside this directory. If you keep your project in Git, the entire `.avc/` directory stays out of your Git history.

If your project's root `.gitignore` doesn't already have `.avc/`, `avc init` appends it for you.

## Per-project config

`.avc/config.toml` is small and rarely edited by hand:

```toml
[branch]
active = "main"

[defaults]
agent = ""
```

The active branch is updated by `avc branch switch`. Everything else is optional.

## What lives outside `.avc/`

- `.avcignore` at the project root — patterns excluded from snapshots (`.gitignore` syntax)
- Agent integration files (only if you run `avc init --skills <framework>`):
  - `.mcp.json`, `CLAUDE.md`, `.claude/skills/avc-*/SKILL.md` (Claude Code)
  - `.cursor/mcp.json`, `.cursor/rules/avc.mdc` (Cursor)
  - `~/.codeium/windsurf/mcp_config.json`, `.windsurfrules` (Windsurf — MCP config in your home directory)

These are deliberately outside `.avc/` because they're configuration the agent framework reads, not AVC's own state. Where the framework supports it, the MCP config is written in the project (rather than a global home-directory registry) so the AVC server is scoped to that project. AVC adds every file it creates to `.gitignore`.

## Backup strategy

`.avc/` is your snapshot store. To back it up, just copy the directory:

```bash
tar -czf project-backup.tgz project/
```

This includes the project files, the AVC database, and the object store. Restoring is a straight `tar -xzf` — no AVC-specific restore process needed.

For long-term archival, treat `.avc/` like any other project asset.
