// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import redirects from './src/data/redirects.json' with { type: 'json' };

// Mirror of freerange.com. Pages are static; the three listing pages (/blog, /case-studies, /resources) and /api/*
// render per request through the Node adapter, because HubSpot's theme script queries them for filters, search,
// "Load More" and resource downloads. HTML is emitted exactly as authored (no minification, no dev toolbar overlay)
// so the output matches the live markup.
export default defineConfig({
  site: 'https://freerange.com',
  // Old URLs the live site redirects (HubSpot URL mappings), with the same status codes.
  redirects: /** @type {Record<string, import('astro').RedirectConfig>} */ (redirects),
  adapter: node({ mode: 'standalone' }),
  compressHTML: false,
  devToolbar: { enabled: false },
  trailingSlash: 'ignore',
  build: { format: 'directory', inlineStylesheets: 'never' },
});
