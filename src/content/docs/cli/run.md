---
title: avc run
description: Run a command in an agent branch workspace, sandboxed.
---

Executes a shell command inside the materialized workspace for a branch — useful for running tests or builds against workspace files without touching the real project root.

The command runs with environment scrubbing, an execution timeout, and process-tree kill on timeout.

## Usage

```bash
avc run --branch feat-auth "go test ./..."
avc run --branch feat-auth --timeout 30 "npm test"
avc run --branch feat-auth "pytest" --json
```

## Flags

| Flag | Description |
|------|-------------|
| `--branch <name>` | Branch whose workspace to run in (required) |
| `--timeout <seconds>` | Execution timeout in seconds (default from config) |
| `--json` | JSON output |

## JSON output

```json
{
  "exit_code": 0,
  "stdout": "...",
  "stderr": "",
  "workspace_path": "/path/to/project/.avc/workspaces/feat-auth",
  "env_info": { "type": "venv", "path": "/path/.../venv" },
  "sandbox_info": {
    "platform": "linux",
    "layers": {
      "env_scrubbing": true,
      "execution_limits": true,
      "process_tree_kill": true
    }
  }
}
```

In human-readable mode, stdout/stderr are streamed directly and the process exits with the command's own exit code.

## The `[run] enabled` gate is agent-facing

The CLI `avc run` is a **human-invoked** command and runs regardless of config — typing the command at a terminal is itself the authorization. The `[run] enabled = true` gate in `.avc/config.toml` exists to stop **agents** from executing commands autonomously:

- It gates the `avc_run_in_workspace` MCP tool (disabled by default; a human must enable it).
- [`avc bisect`](/cli/bisect/) and merge [`--validate`](/cli/merge/#merge-trains) run commands too, and enforce the same gate at the CLI.

## Agent usage

This command backs the `avc_run_in_workspace` MCP tool. Per AVC's agent guidelines, agents must show the user the exact command and get approval before calling it — running arbitrary shell commands is consequential even when sandboxed. See [Agent Integration](/agents/) for details.

The MCP tool additionally returns `files_created` — files the command wrote that are not yet ignored and would enter the next snapshot. This lets an agent add build or test artifacts to the workspace `.avcignore` **before** snapshotting, so they never pollute the branch (ignoring them afterward won't remove them — see [ignoring never untracks](/concepts/snapshots/#ignoring-never-untracks)).
