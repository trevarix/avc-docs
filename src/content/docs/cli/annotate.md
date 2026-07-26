---
title: avc annotate
description: Show which snapshot introduced each line of a file.
---

Like `git blame`, but for AVC snapshots. Traces every line in a file back to the snapshot that introduced it.

## Usage

```bash
avc annotate src/auth.go
avc annotate src/auth.go --json
```

## Output

Human output is grouped **blame-style**: one row per contiguous block of lines that share an originating snapshot — a line range, the snapshot's label, who authored it, and how long ago — rather than repeating the annotation on every line.

```
src/auth.go  (7 lines)

        1 │ initial                       you       3d ago
      2-3 │ add bcrypt hashing            claude    2h ago
      4-5 │ initial                       you       3d ago
        6 │ add bcrypt hashing            claude    2h ago
        7 │ initial                       you       3d ago
```

The author column distinguishes agent from human: a named AI agent (e.g. `claude`) is shown by name and tinted; your own edits — including the extension's automatic save-snapshots — are labelled `you`. Lines not in any snapshot show `(untracked)`.

## JSON output

`--json` is unchanged and remains **per line**, so tools get the full mapping:

```json
{
  "file_path": "src/auth.go",
  "total_lines": 7,
  "lines": [
    { "line": 1, "snapshot_id": "snap-abc123", "label": "initial", "agent_name": "", "timestamp": 1712289600 },
    { "line": 2, "snapshot_id": "snap-def456", "label": "add bcrypt hashing", "agent_name": "claude", "timestamp": 1712376000 }
  ]
}
```

## When to use it

- Investigating *who* introduced a specific block — you or which agent
- Tracing a bug back to the snapshot that introduced it
- The VSCode extension uses this for its [inline annotations](/extension/annotations/) (same block-grouping and agent/human colouring)
