---
title: Claude Desktop
description: Install AVC in Claude Desktop as a one-click extension.
sidebar:
  order: 3
---

[Claude Desktop](https://claude.ai/download) runs local MCP servers as **extensions**, not plugins. AVC ships a `.mcpb` bundle per platform with the `avc` binary inside it, so there is nothing else to install and no config file to edit.

:::note
A plugin's MCP server does **not** run in Desktop chat — plugins contribute skills there and nothing else. The extension below is the only way Desktop gets the `avc_*` tools. For Claude Code, see [Claude Code](/agents/claude-code/).
:::

## Install

Download the bundle for your platform from the [latest release](https://github.com/trevarix/agentic-vc/releases/latest):

| Platform | File |
|----------|------|
| macOS (Apple Silicon) | `avc-<version>-darwin-arm64.mcpb` |
| macOS (Intel) | `avc-<version>-darwin-amd64.mcpb` |
| Windows | `avc-<version>-windows-amd64.mcpb` |
| Linux (x86_64) | `avc-<version>-linux-amd64.mcpb` |
| Linux (ARM) | `avc-<version>-linux-arm64.mcpb` |

Then in Claude Desktop: **Settings → Extensions → Advanced settings → Install Extension…** and select the file.

## Choose your project folders

On install, Desktop asks for **Project folders**. Pick the directories your projects live in — `~/code`, say, or several at once.

AVC searches each one up to four levels deep, skipping `node_modules`, `vendor`, `build`, and hidden directories, and treats every directory containing `.avc/` as a project. It stops at a project boundary, so branch workspaces under `.avc/workspaces/` never appear as projects of their own.

This is why one install covers everything you work on: you are pointing AVC at a *search root*, not at a single project.

## Working across projects

**One project found** — it is selected automatically and you can start straight away.

**Several found** — ask Claude to pick one:

> List my AVC projects, then switch to the api one.

Claude calls `avc_projects_list` and `avc_project_use`. You can switch again mid-conversation at any time; nothing needs restarting.

**A folder that is not an AVC project yet** — ask Claude to set it up, and it calls `avc_init`. That writes `.avc/` with a database, default ignore rules, and config. Claude asks before doing it, since it writes to your project root and adds `.gitignore` entries.

## What Desktop is good for

Desktop chat has no file-editing tools, so AVC there is a **review and recovery** surface rather than an authoring one:

- *"What did my agents do in the api project yesterday?"* — `avc_timeline`, `avc_list`
- *"Show me what changed between those two snapshots"* — `avc_diff`
- *"Roll that project back to before the refactor"* — `avc_restore`, `avc_undo`
- *"Is that branch ready to merge?"* — `avc_branch_diff`

The authoring side lives in [Claude Code](/agents/claude-code/) or the [VSCode extension](/extension/), which act on the project you have open.

## Upgrading

Install the new `.mcpb` over the old one.

:::caution[Disable before uninstalling]
On Windows, uninstalling while the extension is enabled can fail: the running `avc.exe` cannot be deleted, and Desktop removes the manifest before it discovers this — leaving an extension that reports `Failed to read manifest` and cannot be removed from the UI.

**Disable the extension first**, which stops the server, then uninstall.

To recover from that state, quit Claude Desktop completely, then delete:

- `%APPDATA%\Claude\Claude Extensions\local.mcpb.trevarix-corp..avc\` (macOS: `~/Library/Application Support/Claude/…`)
- the matching `.json` in `Claude Extensions Settings`
- its entry in `extensions-installations.json`
:::

## Troubleshooting

**The extension installs but does not start.** Check the extension log in Desktop. `spawn … ENOENT` means the bundled binary could not be found — versions before 0.5.0 shipped a broken path. Upgrade to 0.5.0 or later.

**Only three tools appear** (`avc_init`, `avc_projects_list`, `avc_project_use`). Versions before 0.5.0 hid the rest until a project was selected, and clients cache the tool list. Upgrade; the full set is now advertised from the start.

**No projects are found.** The folders you chose contain no `.avc/` directories within four levels. Either point AVC at the right folder, or ask Claude to run `avc_init` on one.
