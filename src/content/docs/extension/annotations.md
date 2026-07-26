---
title: Inline Annotations
description: See which snapshot introduced each line, like git blame.
sidebar:
  order: 6
---

Toggle inline annotations to see which snapshot last touched each line of the active file — the editor equivalent of [`avc annotate`](/cli/annotate/).

## How to enable it

Run `Ctrl+Shift+P` → **AVC: Toggle Line Annotations**. Running the command again turns annotations off.

Annotations appear as faint inline text at the end of a line, showing the snapshot that introduced that block of code and how long ago. They refresh automatically when you switch editors or save the file.

## Grouped by block, not per line

To stay readable, AVC annotates **once per contiguous block** of lines that share the same originating snapshot — like `git blame` — rather than repeating the annotation on every line. Blank lines are never annotated. A run of ten lines all introduced by the same snapshot shows a single annotation at the top of the block, not ten.

## Agent vs. human

Each annotation is colour-coded and labelled by who authored the change:

- **Agent** — lines introduced by an AI agent (e.g. `claude`, `cursor`) are tinted and labelled with the agent's name.
- **You** — lines you wrote yourself are shown in the muted default colour and labelled `you`. This includes the extension's automatic save-snapshots, since those capture your own edits.

Hover any annotation to see the full snapshot label, the exact author and time, and the snapshot ID.

:::note
Annotations are per-window state — they don't persist across VSCode restarts. Re-toggle after reopening.
:::
