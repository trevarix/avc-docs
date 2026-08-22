---
title: Claude Code
description: Integrate AVC with Claude Code via MCP and skills.
sidebar:
  order: 2
---

[Claude Code](https://claude.ai/code) is Anthropic's official CLI for Claude. AVC integrates with it via the Model Context Protocol — Claude can call `avc_snapshot`, `avc_diff`, `avc_restore`, etc. as native tools.

## Setup

Two ways in. The plugin is machine-wide and covers every project; `--skills` writes files into one project.

### Option A — install the plugin (recommended)

```
/plugin marketplace add trevarix/claude-marketplace
/plugin install agentic-vc@trevarix
```

One install applies everywhere, so there is nothing to run per repository. It registers the MCP server and adds:

- the AVC **skills** — when to snapshot, branch, restore, merge, and run commands
- four **slash commands** — `/agentic-vc:snapshot`, `:timeline`, `:review-branch`, `:undo`
- a **pre-edit hook** that checkpoints the project before an agent's first edit of a session (see [`avc hook pre-edit`](/cli/hook/))

The plugin expects `avc` on your `PATH` and the project initialized with `avc init`. If either is missing, ask Claude to run the bundled `avc-setup` skill and it walks you through both.

### Option B — per-project files

```bash
avc init --skills claude-code
```

That single command writes everything needed into the current project.

## What `--skills` writes

```
.mcp.json                               ← MCP server registration (project-scoped)
CLAUDE.md                               ← always-loaded project instructions (AVC block appended)
.claude/
└── skills/
    ├── avc-snapshot/SKILL.md           ← "When and how to snapshot"
    ├── avc-branch/SKILL.md             ← "When to use branches"
    ├── avc-restore/SKILL.md            ← "When to roll back"
    ├── avc-merge/SKILL.md              ← "How to merge an agent branch"
    └── avc-run/SKILL.md                ← "How to run commands in a workspace"
```

The project-level `.mcp.json` registers the AVC MCP server, and Claude Code discovers it automatically when you open the project:

```json
{
  "mcpServers": {
    "avc": {
      "command": "avc",
      "args": ["mcp", "serve", "--tools", "standard"]
    }
  }
}
```

Writing `.mcp.json` in the project (rather than your global `~/.claude.json`) keeps the AVC server scoped to this project, and Claude Code gates first use behind its normal project-server approval prompt. All of these generated files are added to `.gitignore` automatically.

The skill files are prompt instructions Claude reads when it loads the project. They explain the four primitives and when to use each tool.

## Workflow

Open the project in Claude Code:

```bash
claude
```

Claude detects the `.claude/` directory and loads the skills. Ask it to do something non-trivial:

> "Refactor the auth module to use bcrypt"

What Claude does (with AVC integration):

1. Calls `avc_branch_create` to make a `refactor-auth` workspace
2. Edits files inside `.avc/workspaces/refactor-auth/`
3. Calls `avc_snapshot` after each meaningful change
4. When done, summarizes what it did and asks if you want to merge

You can run `avc list` (or open the [Web UI](/web-ui/)) at any time to see every snapshot Claude took.

## Updating skills

If you update AVC and want the latest skill files:

```bash
avc init --skills claude-code
```

This is idempotent — it merges the AVC entry into `.mcp.json` and leaves existing skill files and your other tools' config untouched.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Claude says "tool avc_snapshot not found" | Restart Claude Code so it re-reads `.mcp.json`, and approve the AVC server if prompted |
| AVC server stuck "pending approval" | Run `claude` interactively and approve it, or set `enableAllProjectMcpServers: true` in your `.claude/settings.json` |
| `avc: command not found` in the MCP error | Set the full path in `.mcp.json`: `"command": "/usr/local/bin/avc"` |
| Skills not being followed | Confirm `.claude/skills/avc-*/SKILL.md` files exist; rerun `avc init --skills claude-code` |
