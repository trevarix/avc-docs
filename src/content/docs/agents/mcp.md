---
title: MCP Server
description: How AVC exposes its commands as MCP tools for AI agents.
sidebar:
  order: 1
---

AVC includes a built-in [Model Context Protocol](https://modelcontextprotocol.io/) server. Any agent that speaks MCP can call AVC's commands as tools — no separate process to manage, no HTTP layer to configure.

## Start the server

```bash
avc mcp serve                    # default: the "standard" tier, pretty output
avc mcp serve --tools core       # minimal 4-tool set
avc mcp serve --tools full       # every tool
avc mcp serve --compact          # compact JSON for token-sensitive contexts
```

The server runs over stdio: it reads JSON-RPC 2.0 messages on stdin and writes responses on stdout. Agent frameworks spawn it as a subprocess.

When the server is pointed at a directory with no `.avc/` project, `tools/list` returns an **empty set** — agents never see tools they can't use.

## Tool tiers

Tools are exposed in three tiers (`--tools core|standard|full`) so agents with small context windows aren't handed everything at once. `standard` is the default.

| Tool | Tier | Maps to |
|------|------|---------|
| `avc_snapshot` | core | [`avc snapshot`](/cli/snapshot/) — accepts `session_id` / `task` |
| `avc_list` | core | [`avc list`](/cli/list/) |
| `avc_diff` | core | [`avc diff`](/cli/diff/) |
| `avc_restore` | core | [`avc restore`](/cli/restore/) |
| `avc_status` | standard | [`avc status`](/cli/status/) |
| `avc_undo` | standard | [`avc undo`](/cli/undo/) |
| `avc_branch_create` | standard | [`avc branch create`](/cli/branch/) — `from_branch` to stack |
| `avc_branch_list` | standard | [`avc branch list`](/cli/branch/) |
| `avc_branch_switch` | standard | [`avc branch switch`](/cli/branch/) |
| `avc_branch_diff` | standard | [`avc branch diff`](/cli/branch/) — `against` for cross-branch |
| `avc_merge` | standard | [`avc merge`](/cli/merge/) |
| `avc_merge_abort` | standard | [`avc merge --abort`](/cli/merge/) |
| `avc_info` | full | [`avc info`](/cli/info/) |
| `avc_delete` | full | [`avc delete`](/cli/delete/) |
| `avc_branch_rename` | full | [`avc branch rename`](/cli/branch/) |
| `avc_branch_abandon` | full | [`avc branch abandon`](/cli/branch/) |
| `avc_branch_prune_merged` | full | [`avc branch prune --merged`](/cli/branch/) |
| `avc_merge_preview` | full | [`avc merge --preview`](/cli/merge/) |
| `avc_merge_train` | full | [`avc merge --train`](/cli/merge/) — merge a fleet in sequence |
| `avc_run_in_workspace` | full | Run a shell command inside a branch workspace (gated — see below) |
| `avc_bisect` | full | [`avc bisect`](/cli/bisect/) (gated — see below) |
| `avc_restore_file` | full | [`avc restore-file`](/cli/restore-file/) — workspace-aware |
| `avc_annotate` | full | [`avc annotate`](/cli/annotate/) |
| `avc_tag_snapshot` / `avc_untag_snapshot` | full | [`avc snapshot tag`](/cli/snapshot/) |
| `avc_list_conflicts` / `avc_resolve_conflict` | full | Inspect and resolve merge conflicts |

Each tool's JSON Schema is published via `tools/list` so the agent can discover them programmatically.

## The `[run] enabled` gate

`avc_run_in_workspace` and `avc_bisect` execute commands, so they are refused unless a human sets `[run] enabled = true` in `.avc/config.toml`. Agents cannot enable it themselves — the gate exists precisely to stop autonomous command execution. (The CLI `avc run` is a human-invoked command and is not gated; see [`avc run`](/cli/run/).)

Similarly, `avc_merge` and `avc_merge_train` have **no** protected-paths override — only a human running `avc merge --allow-protected` can lift the `[protect]` gate.

## Don't configure it by hand

Use the one-shot setup instead:

```bash
avc init --skills claude-code,cursor,windsurf,generic
```

This writes the right config files for each framework into your project. See the per-framework guides:

- [Claude Code](/agents/claude-code/)
- [Cursor](/agents/cursor/)
- [Windsurf](/agents/windsurf/)

## Manual integration

For custom agents not covered by `--skills`, here's the minimal config snippet:

```json
{
  "mcpServers": {
    "avc": {
      "command": "avc",
      "args": ["mcp", "serve", "--compact"]
    }
  }
}
```

Drop that into whatever MCP config file your framework uses. Most frameworks (Claude Desktop, Cline, etc.) follow this convention.

## When the agent should use each tool

AVC ships **agent skill files** (e.g., `.claude/skills/avc-snapshot/SKILL.md`) that document when to call which tool. These are written by `avc init --skills` and serve as instructions to the agent — "always snapshot before risky changes", "use branches for non-trivial refactors", etc.

If you write your own agent, you can copy the skill files as a starting point for your prompt engineering.
