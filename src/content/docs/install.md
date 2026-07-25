---
title: Installation
description: Install the AVC CLI and optional clients (VSCode extension, web UI).
---

AVC ships as a single Go binary. Install once, use anywhere — terminal, VSCode, browser, or via MCP from an AI agent.

## CLI

### macOS — Homebrew

```bash
brew install trevarix/tap/avc
```

### Windows — Scoop

Don't have [Scoop](https://scoop.sh) yet? Install it first, in PowerShell (no admin needed):

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod get.scoop.sh | Invoke-Expression
```

Then add the AVC bucket and install:

```powershell
scoop bucket add trevarix https://github.com/trevarix/scoop-bucket
scoop install avc
```

### Linux — direct download

There's no install script — grab the release tarball and move the binary onto your `PATH`:

```bash
curl -sfL https://github.com/trevarix/agentic-vc/releases/latest/download/avc_<version>_linux_amd64.tar.gz | tar xz
sudo mv avc /usr/local/bin/
```

Replace `<version>` with the release version (e.g. `1.0.0`), matching the asset names on the [Releases page](https://github.com/trevarix/agentic-vc/releases).

### macOS / Windows — direct download (without a package manager)

Download the archive for your OS/arch from [GitHub Releases](https://github.com/trevarix/agentic-vc/releases), then:

```bash
# macOS — remove the Gatekeeper quarantine flag
xattr -rd com.apple.quarantine avc
chmod +x avc
sudo mv avc /usr/local/bin/
```

```powershell
# Windows — move into an existing PATH location (no admin needed)
Move-Item avc.exe "$env:LOCALAPPDATA\Microsoft\WindowsApps\"
```
> You can also right-click `avc.exe` → Properties → check **Unblock** → OK before moving it, to dismiss the SmartScreen warning on first run.

### Build from source

Requires Go 1.22 or newer.

```bash
git clone https://github.com/trevarix/agentic-vc.git
cd agentic-vc/avc
go install .
```

This drops `avc` into `~/go/bin/` (or `%USERPROFILE%\go\bin\` on Windows). Make sure that directory is on your `PATH`.

### Verify

```bash
avc --version
avc --help
```

You should see the version number and a list of commands. If not, double-check that the install location is on your `PATH`.

## VSCode Extension

The extension provides a sidebar, Source Control panel integration, and file history for snapshots — without leaving VSCode.

:::note
The extension calls the `avc` CLI under the hood, so install the CLI first.
:::

### From a VSIX

1. Download the latest `.vsix` from [GitHub Releases](https://github.com/trevarix/agentic-vc/releases)
2. In VSCode: `Ctrl+Shift+P` → **Extensions: Install from VSIX…**
3. Pick the downloaded file

The extension isn't on the VSCode Marketplace yet — install from the `.vsix` for now.

See the [VSCode Extension guide](/extension/) for a tour of the features.

## Web UI

Already bundled in the CLI — no separate install. Just run:

```bash
avc ui
```

Your default browser opens to `http://127.0.0.1:3004/`. Use this if you don't use VSCode or want to share a snapshot browser with non-technical teammates.

See the [Web UI guide](/web-ui/) for screenshots and the REST API reference.

## MCP server (for AI agents)

Agents that speak the [Model Context Protocol](https://modelcontextprotocol.io/) can call AVC as a tool. The server is built into the CLI:

```bash
avc mcp serve
```

To configure popular agent frameworks automatically:

```bash
avc init --skills claude-code,cursor,windsurf
```

For each framework this registers the MCP server — in the project itself where the framework supports it (Claude Code, Cursor), so the server is scoped to that project — and writes project-local instruction files. See [`avc init`](/cli/init/#with---skills) and [Agent Integration](/agents/) for details.

## Requirements

| Component | Requirement |
|-----------|-------------|
| OS | macOS 10.15+, Linux (any modern distro), Windows 10+ |
| Architecture | x86_64 or arm64 |
| Disk | ~15 MB for the binary |
| Go (only if building from source) | 1.22+ |

AVC has no runtime dependencies — no Python, no Node.js, no CGO. The SQLite implementation is pure Go.

## Next steps

After installing, walk through the [Quick Start guide](/quick-start/) to take your first snapshot.
