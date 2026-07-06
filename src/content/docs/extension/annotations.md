---
title: Inline Annotations
description: See which snapshot introduced each line, like git blame.
sidebar:
  order: 6
---

Toggle inline gutter annotations to see which snapshot last touched each line of the active file — the editor equivalent of [`avc annotate`](/cli/annotate/).

## How to enable it

Run `Ctrl+Shift+P` → **AVC: Toggle Line Annotations**. Running the command again turns annotations off.

Annotations appear as faint inline text after each line, showing the snapshot that introduced it. They refresh automatically when you switch editors or save the file.

:::note
Annotations are per-window state — they don't persist across VSCode restarts. Re-toggle after reopening.
:::
