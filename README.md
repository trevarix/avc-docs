# avc-docs

Documentation site for [AVC (Agentic Version Control)](https://github.com/trevarix/agentic-vc) — built with [Astro](https://astro.build) and [Starlight](https://starlight.astro.build).

## Local development

**Requirements:** Node 22, npm

```bash
npm install
npm run dev
```

The site is served at `http://localhost:4321`.

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

## Deployment

Pushes to `main` trigger the [Deploy Docs](.github/workflows/docs.yml) workflow, which builds the site and deploys it to GitHub Pages automatically.

## Content

Page content lives in `src/content/docs/` as `.md` and `.mdx` files, organised by section:

| Directory | Section |
|-----------|---------|
| `concepts/` | Core concepts (snapshots, branches, merges, storage) |
| `cli/` | CLI command reference |
| `extension/` | VSCode extension |
| `web-ui/` | Web UI |
| `agents/` | Agent integration (Claude Code, Cursor, MCP) |

Site navigation and sidebar are configured in [`astro.config.mjs`](astro.config.mjs).

## Related

- Main repository: [trevarix/agentic-vc](https://github.com/trevarix/agentic-vc)
