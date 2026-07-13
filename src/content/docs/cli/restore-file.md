---
title: avc restore-file
description: Restore a single file from a snapshot.
---

Restores one file rather than the whole snapshot.

## Usage

```bash
avc restore-file snap-abc123 src/auth.go
avc restore-file snap-abc123 src/auth.go --json
```

## Arguments

| Argument | Required | Description |
|----------|---------|-------------|
| `<snapshot_id>` | yes | Snapshot to read from |
| `<file_path>` | yes | Project-relative file path |

## JSON output

```json
{
  "id": "snap-abc123",
  "file_path": "src/auth.go",
  "size": 4096,
  "success": true
}
```

## Notes

- The file is **overwritten** if it exists; **created** if it doesn't
- Other files in the project are not touched
- If the file isn't in the snapshot, you get a 404-style error and no file is written
- Useful for restoring a single config or one buggy file without rolling back everything else

## Where it writes

The CLI `avc restore-file` writes to the **project root**, even when a branch is active. The workspace-aware behavior — writing into the active branch's workspace instead — is the MCP `avc_restore_file` tool (and the web UI). If you want to restore a single file into a branch workspace from the command line, run the command from inside that workspace directory, or use the agent tool.
