---
title: Install & Setup
description: Get the AVC VSCode extension running in three steps.
sidebar:
  order: 1
---

The AVC extension brings snapshot management directly into VSCode — sidebar, Source Control panel, gutter annotations, and more. Pick the install path that matches how you got AVC.

## Prerequisites

- The `avc` CLI must be on your `PATH` (run `avc --version` to confirm) — see [Installation](/install/)
- Your project must be initialized with `avc init`
- VSCode **1.85+**

The extension isn't on the VSCode Marketplace yet — install from a `.vsix` or run it in development mode.

## Option A — VSIX

Install a packaged build:

1. Download the latest `.vsix` from [GitHub Releases](https://github.com/trevarix/releases), or run `vsce package` in the `extension/` folder to produce one yourself
2. In VSCode: `Ctrl+Shift+P` → **Extensions: Install from VSIX…**
3. Pick the `.vsix` file

## Option B — Development mode

For contributing to the extension itself:

1. Open the `extension/` folder in VSCode: `code extension/`
2. Run `npm install && npm run compile`
3. Press `F5` — a second window opens labeled **[Extension Development Host]**
4. In that window, open any AVC-initialized folder

## Verify the install

You should see all of the following in your project window:

- A **camera icon** in the activity bar (left edge)
- A **status bar item** like `AVC: 4 snapshots`
- A **branch indicator** next to it: `main`
- An **AVC group** in the Source Control panel (`Ctrl+Shift+G`)

:::tip
If the sidebar shows "Loading…" forever, run `avc --version` in your terminal. If it errors, the extension can't find the CLI — set `avc.cliPath` in [settings](/extension/settings/).
:::
