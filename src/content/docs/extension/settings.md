---
title: Configuration
description: Settings to customize the extension behavior.
sidebar:
  order: 6
---

All settings live under `avc.*`. Edit them in the VSCode settings UI (`Ctrl+,`) or directly in your `settings.json`.

## Core settings

| Setting | Default | Description |
|---------|---------|-------------|
| `avc.cliPath` | `"avc"` | Path to the `avc` CLI binary. Override if it's not on `PATH` — e.g. `"C:/Users/you/go/bin/avc.exe"` |
| `avc.projectPath` | `""` | Override the project root. Defaults to the first workspace folder. |
| `avc.defaultAgentName` | `""` | Auto-fills the agent name when creating a snapshot. Useful if you always want the same identifier (e.g. your name or `"manual"`). |

## Continuous checkpointing

| Setting | Default | Description |
|---------|---------|-------------|
| `avc.watch.enabled` | `false` | Run the [`avc watch`](/cli/watch/) daemon alongside the editor — continuously checkpoints the project as files change, including edits made outside VSCode. Starts and stops with the editor. |

When `avc.watch.enabled` is on it **supersedes** the save-triggered auto-snapshot below: the CLI watcher sees every change (not just editor saves), debounces, and dedupes against the branch HEAD. Tune its debounce and interval under `[watch]` in `.avc/config.toml` — see [`avc watch`](/cli/watch/#configuration).

## Auto-snapshot settings

The extension can automatically create snapshots after you save files. Disabled by default, and ignored while `avc.watch.enabled` is on.

| Setting | Default | Description |
|---------|---------|-------------|
| `avc.autoSnapshot.enabled` | `false` | Master switch. When `true`, the extension watches file saves and creates snapshots in the background. |
| `avc.autoSnapshot.debounceSeconds` | `30` | Wait this long after the last save before snapshotting. Higher values group more changes into one snapshot. |
| `avc.autoSnapshot.cooldownMinutes` | `5` | Minimum gap between auto-snapshots. Prevents the snapshot list from growing too quickly during heavy editing. |

## Example settings.json

```json
{
  "avc.cliPath": "avc",
  "avc.defaultAgentName": "manual",
  "avc.watch.enabled": true
}
```

:::caution
Auto-snapshots are labeled `"Auto-snapshot"` with the configured agent name. They participate in the **Type** filter (sidebar & timeline) so you can hide or show them on demand.
:::

## Toggle line annotations

Run `Ctrl+Shift+P` → **AVC: Toggle Line Annotations** to show or hide inline annotations indicating which snapshot introduced each line. There's no setting — it's a per-session toggle.
