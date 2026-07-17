// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const SITE_URL = 'https://avc.trevarix.com';
const REPO_URL = 'https://github.com/trevarix/agentic-vc';
const DOCS_REPO_URL = 'https://github.com/trevarix/avc-docs';

export default defineConfig({
  site: SITE_URL,
  // NO `base` — deployed at root of avc.trevarix.com
  integrations: [
    starlight({
      title: 'Agentic Version Control',
      description:
        'Snapshot, diff, branch, and merge primitives designed for agent-assisted development. CLI, VSCode extension, web UI, and MCP server.',
      logo: {
        light: './src/assets/logo.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
      favicon: '/favicon.svg',
      head: [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' } },
        { tag: 'link', attrs: { rel: 'shortcut icon', href: '/favicon.ico' } },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: REPO_URL }],
      editLink: { baseUrl: `${DOCS_REPO_URL}/edit/main/` },
      lastUpdated: true,
      pagination: true,
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Introduction',
          items: [
            { label: 'Overview', slug: 'index' },
            { label: 'Why AVC', slug: 'why' },
            { label: 'Installation', slug: 'install' },
            { label: 'Quick Start', slug: 'quick-start' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            { label: 'Snapshots', slug: 'concepts/snapshots' },
            { label: 'Branches', slug: 'concepts/branches' },
            { label: 'Merges', slug: 'concepts/merges' },
            { label: 'Storage Layout', slug: 'concepts/storage' },
          ],
        },
        { label: 'CLI Reference', items: [{ autogenerate: { directory: 'cli' } }] },
        { label: 'VSCode Extension', items: [{ autogenerate: { directory: 'extension' } }] },
        { label: 'Web UI', items: [{ autogenerate: { directory: 'web-ui' } }] },
        { label: 'Agent Integration', items: [{ autogenerate: { directory: 'agents' } }] },
      ],
    }),
  ],
});
