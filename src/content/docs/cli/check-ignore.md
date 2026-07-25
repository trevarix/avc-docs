---
title: avc check-ignore
description: Report whether paths are excluded from snapshots, and by which rule.
---

Reports, for each given path, whether it is excluded from snapshots by an `.avcignore` rule — and if so, which pattern is responsible. It's AVC's analog of `git check-ignore`.

Use it to diagnose why an expected file is missing from a snapshot, branch workspace, or diff. An over-broad ignore pattern (say an unanchored `vendor/`) can silently exclude source; this command names the exact rule so you can fix it.

## Usage

```bash
avc check-ignore web/features/vendor/screen.tsx
avc check-ignore --json src/main.go vendor/pkg/x.go
```

Paths are interpreted relative to the active branch's source directory — the workspace on a branch, the project root on main. The ignore rules are the root `.avcignore` layered with the workspace's, exactly as a snapshot sees them.

## Flags

| Flag | Description |
|------|-------------|
| `--json` | JSON output |

## Output

```
ignored  debug.log (matched by '*.log')
tracked  src/main.go
```

A file is reported `ignored` when it matches a rule directly **or** when any ancestor directory is ignored (the snapshot walk skips ignored directories wholesale).

## JSON output

```json
{
  "results": [
    { "path": "src/main.go", "ignored": false },
    { "path": "debug.log", "ignored": true, "pattern": "*.log" }
  ],
  "success": true
}
```

## Exit code

Mirrors `git check-ignore`: `0` when at least one given path is ignored, `1` when none are — so it's usable in scripts.

## See also

- [Snapshots → What's excluded](/concepts/snapshots/#whats-excluded) — how `.avcignore` layering and the "ignoring never untracks" rule work
