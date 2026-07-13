---
title: avc bisect
description: Find the snapshot that broke a command via binary search.
---

Binary-searches snapshot history between a known-good snapshot and a bad one (default: branch HEAD) to find the first snapshot where a test command fails — `O(log n)` runs instead of restoring snapshots one by one.

Each candidate is materialized into a throwaway scratch workspace and the command runs through the same sandbox as [`avc run`](/cli/run/): environment scrubbing, timeout, output caps.

## Requires `[run] enabled`

`avc bisect` executes arbitrary commands, so — unlike most CLI commands — it is gated on `[run] enabled = true` in `.avc/config.toml`. A human must set this manually; it is the same mechanical gate that backs the agent-facing runner.

## Usage

```bash
avc bisect --good snap-abc --cmd "go test ./..."
avc bisect --good-tag stable --bad snap-xyz --cmd "npm test"
avc bisect --branch feat/auth --good snap-abc --cmd "pytest -x" --json
```

## Flags

| Flag | Description |
|------|-------------|
| `--good <id>` | Known-good snapshot ID (required unless `--good-tag`) |
| `--good-tag <tag>` | Use the newest snapshot carrying this tag as the good point |
| `--bad <id>` | Known-bad snapshot (default: branch HEAD) |
| `--branch <name>` | Branch to search (default: main) |
| `--cmd <command>` | Test command (required) |
| `--timeout <seconds>` | Per-step timeout (default: sandbox default) |
| `--json` | Stream NDJSON step progress + a final result |

## Exit-code protocol

The test command follows the same convention as `git bisect run`:

| Exit code | Meaning |
|-----------|---------|
| `0` | this snapshot is **good** |
| `125` | **skip** — cannot judge this snapshot (e.g. it doesn't build) |
| anything else | this snapshot is **bad** |

## Output

Names the first bad snapshot, its predecessor, and a summary of what changed between them:

```
✗ First bad snapshot: snap-b5e0955d2836
  Label:   step-6
  After:   snap-674fe4b7d9ec
  Steps:   3
  Changed: 2 files: added broken.txt, modified counter.txt (+1 -1)

Inspect with: avc diff snap-674fe4b7d9ec snap-b5e0955d2836
```

With `--json`, progress streams as one `{"type":"step",...}` object per test run, followed by a final `{"type":"result",...}`. If skipped snapshots prevented exact narrowing, the result is flagged `"ambiguous": true`.

## Cleanup

The scratch workspace (`.avc/workspaces/.bisect-*`) is removed on completion or interrupt. A command that times out or is blocked by the sandbox aborts the run rather than guessing a verdict.
