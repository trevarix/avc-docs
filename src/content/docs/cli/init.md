---
title: avc init
description: Initialize AVC for a project.
---

Initialize AVC for a project. Creates `.avc/` with a SQLite database, default config, and `.avcignore`.

If the project is inside a git repository and has no `.gitignore` yet, AVC creates one with its entries; if a `.gitignore` already exists, AVC appends `.avc/` and `.avcignore` to it.

## Usage

```bash
avc init                            # initialize current directory
avc init /path/to/project           # initialize a specific directory
avc init --skills claude-code       # also write agent integration files
avc init --skills claude-code,cursor,windsurf
```

## Flags

| Flag | Description |
|------|-------------|
| `--skills <list>` | Comma-separated agent frameworks to set up. Supported: `claude-code`, `cursor`, `windsurf`, `generic` |
| `--yes`, `-y` | Skip the confirmation prompt when no AVC project exists at the path yet |
| `--json` | JSON output |

## Confirmation prompt

If no AVC project exists at the target path yet, `avc init` asks before creating one:

```
⚠ No AVC project found at /path/to/project
  Initialize a new AVC project here? [y/N]
```

Answering anything other than `y`/`yes` aborts with no changes made. This only fires on first-time bootstrap — re-running `avc init` on an already-initialized project never prompts.

Pass `--yes` to skip the prompt in scripts or CI. `--json` mode also skips it, since machine consumers are presumed to know what they're asking for.

## JSON output

```json
{
  "id": "proj-a1b2c3",
  "path": "/path/to/project",
  "name": "project",
  "already_initialized": false,
  "success": true
}
```

## What it creates

```
.avc/
├── avc.db
├── config.toml
├── .gitignore
└── objects/
.avcignore                    ← in the project root
```

Re-running on an already-initialized project is a no-op — no data loss.

## With `--skills`

For each requested framework, AVC writes two kinds of file: the **MCP server config** (so the framework knows how to launch `avc mcp serve`) and **instruction files** (so the agent knows when to use each tool).

Where the framework supports it, the MCP config is written **in the project**, so the AVC server is scoped to that project rather than registered globally for every project on your machine. Frameworks without a project-level config option fall back to their home-directory config:

| Framework | MCP config | Instruction files (in the project) |
|-----------|------------|------------------------------------|
| `claude-code` | `.mcp.json` (project) | `CLAUDE.md`, `.claude/skills/avc-*/SKILL.md` |
| `cursor` | `.cursor/mcp.json` (project) | `.cursor/rules/avc.mdc` |
| `windsurf` | `~/.codeium/windsurf/mcp_config.json` (home) | `.windsurfrules` |
| `generic` | — | `AGENT_INSTRUCTIONS.md` |

Every file AVC creates is added to `.gitignore` automatically — generated agent files are local tooling, not repo content. Files you already own are left as-is: if a `CLAUDE.md` or MCP config already exists, AVC appends to (or merges into) it and does **not** gitignore it, so your tracking choice stands. To share an AVC-generated config, remove its entry from `.gitignore` and commit it.

Re-running `--skills` is safe: existing files are never overwritten, the JSON config is **merged** (not duplicated), and rules files are append-only with a dedup marker. See [Agent Integration](/agents/) for details.
