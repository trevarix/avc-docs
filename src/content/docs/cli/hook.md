---
title: avc hook
description: Checkpoint the project before an agent's first edit of a session.
---

Handlers invoked by an agent harness, not by hand. Claude Code calls `avc hook pre-edit` from a `PreToolUse` hook, and the [AVC plugin](/agents/claude-code/) wires that up for you.

## `avc hook pre-edit`

Takes **one snapshot per agent session**, capturing the project as it stood before that session edited anything. Safety stops depending on the agent remembering to snapshot.

```bash
echo '{"session_id":"sess-42","cwd":"/path/to/project"}' | avc hook pre-edit --json
```

The session — not the edit — is the unit. A snapshot on every `Write` would flood [`avc list`](/cli/list/) and leave [`avc timeline`](/cli/timeline/) unreadable, so the handler reads `session_id` from the hook payload: the first edit of a session produces a checkpoint, every later edit is a no-op.

## Stdin payload

Extra fields are ignored, so the full Claude Code `PreToolUse` payload can be piped straight in.

| Field | Description |
|-------|-------------|
| `session_id` | Agent session this edit belongs to. Without it nothing is snapshotted — there would be no way to tell a first edit from a hundredth |
| `cwd` | Directory the agent is working in; AVC walks up from here to find `.avc/` |
| `tool_name` | The tool about to run. Recorded but not acted on |

## Output

```json
{
  "action": "snapshotted",
  "snapshot_id": "snap-3f7f0e6a40fc",
  "label": "auto: session start checkpoint",
  "session_id": "sess-42",
  "project": "/path/to/project"
}
```

When no snapshot was taken, `action` is `skipped` and `reason` says why: `not an AVC project`, `hook payload carried no session_id`, or `session already has a checkpoint`.

## Always exits 0

A hook that blocked an edit because AVC hit a problem would be worse than no hook at all. Failures are reported on stderr — or as a `skipped` result under `--json` — and the agent proceeds. This is the one place AVC deliberately does not turn an error into a non-zero exit code.

## Wiring it up by hand

The plugin does this for you. To do it yourself, add to your Claude Code hook settings:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{ "type": "command", "command": "avc hook pre-edit" }]
      }
    ]
  }
}
```
