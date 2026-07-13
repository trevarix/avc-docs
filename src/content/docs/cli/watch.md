---
title: avc watch
description: Continuously checkpoint the project as files change.
---

Runs a foreground daemon that watches the project root — and every active branch workspace — and automatically snapshots after each burst of changes. This makes safety **structural** instead of behavioral: every state the project passes through is recoverable, whether or not an agent remembered to snapshot.

Press <kbd>Ctrl+C</kbd> to stop. An idle project generates zero snapshots.

## Usage

```bash
avc watch                 # start watching (foreground)
avc watch --status        # is a watcher running for this project?
avc watch --poll 15       # poll every 15s instead of using file events
```

## Flags

| Flag | Description |
|------|-------------|
| `--status` | Report whether a watcher is running for this project (with its PID and last heartbeat) |
| `--poll <seconds>` | Poll on an interval instead of file-event watching — for network filesystems where events are unreliable |
| `--json` | JSON output (with `--status`) |

## Behavior

- **Debounced** — a checkpoint is taken only after a quiet period (`debounce_seconds`, default 30) and no more often than `min_interval_seconds` (default 120) per branch.
- **Deduplicated** — a tree identical to the branch HEAD produces no snapshot. The stat cache makes this check nearly free, so idle projects cost nothing.
- **Scoped** — edits in a branch workspace checkpoint to that branch; ignored-file churn (build output, logs) triggers nothing.
- **Labeled** — checkpoints use the label prefix `auto:watch <what changed>` with agent name `avc-watch`, and are the first candidates for retention pruning.
- **Single-instance** — a pid file (`.avc/watch.pid`) with a heartbeat refuses a second watcher; a stale file from a crashed daemon is replaced after 90s.

## Configuration

```toml
[watch]
debounce_seconds     = 30
min_interval_seconds = 120
include_workspaces   = true

[retention]
# Watch checkpoints are pruned before any other rule considers them.
# 0 = the built-in default (200); -1 = unlimited.
max_watch_snapshots_per_branch = 200
```

## `--status` JSON

```json
{ "running": true, "pid": 28600, "updated_at": 1712289600 }
```

## VSCode

The extension can run the watcher for you: enable `avc.watch.enabled` and the daemon starts and stops with the editor, superseding save-triggered auto-snapshots.

## See also

- [`avc timeline`](/cli/timeline/) — review what the watcher (and your agents) captured
- [Concepts → Snapshots](/concepts/snapshots/)
