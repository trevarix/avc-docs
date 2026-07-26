---
title: Sidebar Overview
description: Navigate snapshots, branches, and changes from the activity bar.
sidebar:
  order: 2
---

Click the camera icon in the activity bar to open the AVC panel. Everything you need is one or two clicks away.

## Anatomy

```
┌──────────────────────────────────────────────┐
│ AVC SNAPSHOTS            [+ ↻ ⑂ ⌕ ⋔ ⇄ ⏱ ↗]  │  ← header buttons
├──────────────────────────────────────────────┤
│ ▼ Today (3)                                  │  ← calendar-grouped
│   ▶ Auto-snapshot     4/19/2026 12:09 AM    │  ← snapshot (expand for actions)
│   ▶ Manual baseline   4/19/2026 12:08 AM    │
│ ▶ Yesterday (1)                              │
│ ▶ This Week (5)                              │
│ ▶ This Month (7)                             │
│ ▶ Older (12)                                 │
└──────────────────────────────────────────────┘
 ⟲ AVC: 21 snapshots    ⑂ main    ± +0 ~2 -0
```

## Header buttons

The view title bar carries eight buttons, left to right. Each uses a VSCode codicon (shown below by name).

| Button | Codicon | Command | What it does |
|--------|---------|---------|--------------|
| Save Snapshot | `add` | `avc.saveSnapshot` | Prompt for label and notes, create a snapshot |
| Refresh | `refresh` | `avc.refreshSnapshots` | Reload the snapshot list and SCM stats |
| Create Branch | `git-branch-create` | `avc.createBranch` | Create a new branch from the current state |
| Filter | `search` | `avc.filterSnapshots` | Multi-step filter by Agent / Type / Branch |
| Merge Branch | `git-merge` | `avc.mergeBranch` | Merge a branch into main (conflicts checked first) |
| Compare Two | `diff` | `avc.compareTwoSnapshots` | Pick any two snapshots to diff |
| Timeline | `graph-line` | `avc.showTimeline` | Open the visual timeline webview |
| Open Workspace | `link-external` | `avc.openWorkspace` | Open the active branch's workspace in a new window |

## Date grouping

Snapshots bucket by date into **Today / Yesterday / This Week / This Month / Older** (each group carries a calendar icon). Groups start collapsed; click any header to expand. The number next to each group is its snapshot count.

## Status bar (bottom-left)

Three items, in this order:

| Item | Codicon | Click action |
|------|---------|--------------|
| `AVC: N snapshots` | `history` | Refresh the snapshot list |
| `<branch>` | `git-branch` | QuickPick to switch branches |
| `+A ~M -D` | `diff` | Open the diff vs the latest snapshot — only shown when the working tree has changes |
