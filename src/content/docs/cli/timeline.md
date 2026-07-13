---
title: avc timeline
description: Show branch history as a story, grouped by agent session.
---

Renders the branch's snapshots grouped by the **agent session** that produced them, each with a one-line change summary, interleaved with the restores, merges, and undos from the operations log. This is the "what did my agents do while I was away" report.

## Usage

```bash
avc timeline                     # active branch, all sessions
avc timeline --session sess-42   # one session's story
avc timeline --branch main       # a specific branch
avc timeline --limit 100 --json
```

## Flags

| Flag | Description |
|------|-------------|
| `--session <id>` | Show only this session |
| `--branch <name>` | Branch to show (default: active branch) |
| `--limit <n>` | Max snapshots to include (default 50) |
| `--json` | JSON output |

## Where sessions come from

Sessions are the `session_id` / `task` attribution on snapshots. Pass them when snapshotting:

```bash
avc snapshot "before auth refactor" --session sess-42 --task "add auth endpoints"
```

or via the matching MCP `avc_snapshot` arguments. Agents are instructed to pass a stable session ID for the whole conversation and a one-line task description. Unattributed snapshots appear under **(no session)**.

## JSON output

```json
{
  "branch": "main",
  "sessions": [
    {
      "session_id": "sess-42",
      "task": "add auth endpoints",
      "agents": ["claude"],
      "started_at": 1712275200,
      "ended_at": 1712278800,
      "events": [
        { "kind": "snapshot", "timestamp": 1712275200, "snapshot_id": "snap-abc",
          "label": "auto: before auth refactor", "agent_name": "claude",
          "file_count": 42, "summary": "1 file: modified auth.go (+40 -12)" },
        { "kind": "operation", "timestamp": 1712278800, "op_kind": "restore",
          "details": "restored snapshot snap-abc" }
      ]
    }
  ]
}
```

Summaries missing from older snapshots are computed (and cached) lazily. The same data is served by the web UI at `/api/timeline`.
