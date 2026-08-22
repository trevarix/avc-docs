---
title: avc mcp
description: Start the MCP (Model Context Protocol) server for AI agents.
---

Starts an MCP JSON-RPC 2.0 server over stdio, exposing AVC commands as tools that AI agents can call directly.

## Usage

```bash
avc mcp serve                       # project resolved from the working directory
avc mcp serve --tools core          # advertise a smaller tool set
avc mcp serve --compact             # compact JSON for token-sensitive contexts
avc mcp serve ~/Projects ~/work     # search folders instead of a working directory
```

## Flags

| Flag | Description |
|------|-------------|
| `--tools <tier>` | Tool set to advertise: `core` (4), `standard` (default), or `full` |
| `--compact` | Emit single-line JSON without indentation (saves tokens for LLM context windows) |

## Resolving the project

In order of precedence:

1. The `AVC_PROJECT` environment variable, when set
2. A `.avc/` directory found by walking up from the working directory
3. The search roots given as positional arguments

**Search roots** exist for hosts that launch the server outside any project — [Claude Desktop](/agents/claude-desktop/), for instance. AVC searches each folder up to four levels deep, skipping `node_modules`, `vendor`, `build`, and hidden directories.

With exactly one project found it is selected automatically. With several, the agent picks using `avc_projects_list` and `avc_project_use`, and tools needing a project return an error naming that path forward rather than failing blankly. See [MCP Server](/agents/mcp/) for the full behaviour.

## Available tools

The server exposes 30 tools. Most map directly to a CLI command:

| Tool | CLI equivalent |
|------|----------------|
| `avc_snapshot` | `avc snapshot` |
| `avc_list` | `avc list` |
| `avc_diff` | `avc diff` |
| `avc_restore` | `avc restore` |
| `avc_info` | `avc info` |
| `avc_delete` | `avc delete` |
| `avc_branch_create` | `avc branch create` |
| `avc_branch_list` | `avc branch list` |
| `avc_branch_switch` | `avc branch switch` |
| `avc_branch_diff` | `avc branch diff` |
| `avc_branch_rename` | `avc branch rename` |
| `avc_branch_abandon` | `avc branch abandon` |
| `avc_branch_prune_merged` | `avc branch prune --merged` |
| `avc_merge_preview` | `avc merge --preview` |
| `avc_merge` | `avc merge` |
| `avc_merge_abort` | `avc merge --abort` |
| `avc_run_in_workspace` | run a shell command inside a branch workspace |
| `avc_status` | `avc status` |
| `avc_restore_file` | `avc restore-file` |
| `avc_annotate` | `avc annotate` |
| `avc_tag_snapshot` | `avc snapshot tag` |
| `avc_untag_snapshot` | `avc snapshot untag` |
| `avc_list_conflicts` | list files with unresolved conflict markers after a merge |
| `avc_resolve_conflict` | resolve one conflicted file (`ours`/`theirs`/`content`) |

## Setup for agent frameworks

Don't configure the MCP server by hand — let AVC do it:

```bash
avc init --skills claude-code,cursor,windsurf
```

This writes the right MCP config files for each framework. See [Agent Integration](/agents/) for details.

## Manual integration

If you're building a custom agent or testing the server manually:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | avc mcp serve
```

The server reads JSON-RPC 2.0 messages on stdin and writes responses on stdout. It exits when stdin closes.
