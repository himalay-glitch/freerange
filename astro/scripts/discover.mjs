// Finds every freerange.com URL reachable from the mirrored pages that the sitemap does not list: pages (e.g. older
// posts, paginated listings) and redirects (HubSpot URL mappings). Follows links breadth-first through new pages.
// Output: .mirror-cache/extra-pages.txt (live 200 HTML pages) and .mirror-cache/redirects.json (path -> target, status).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.mirror-cache');
const ORIGIN = 'https://freerange.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const slug = (p) => (p === '/' ? 'index' : p.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '__'));
const clean = (p) => (p.length > 1 ? p.replace(/\/$/, '') : p);

const known = new Set(fs.readFileSync(path.join(CACHE, 'urls.txt'), 'utf8').split('\n').filter(Boolean).map(clean));
const statusCache = path.join(CACHE, 'discover-status.json');
const status = fs.existsSync(statusCache) ? JSON.parse(fs.readFileSync(statusCache, 'utf8')) : {};

function linksOf(html) {
  const $ = cheerio.load(html);
  const out = new Set();
  $('a[href], link[rel="next"][href], link[rel="prev"][href]').each((_, el) => {
    const href = $(el).attr('href');
    let u;
    try { u = new URL(href, ORIGIN + '/'); } catch { return; }
    if (!/^(www\.)?freerange\.com$/.test(u.hostname) || !/^https?:$/.test(u.protocol)) return;
    if (/^\/(hubfs|hs-fs|hs|_hcms|cs)\//.test(u.pathname) || /\.(xml|pdf|png|jpe?g|gif|svg|mp3|mp4|zip|docx?|pptx?)$/i.test(u.pathname)) return;
    out.add(u.pathname);
  });
  return out;
}

async function probe(p) {
  if (status[p]) return status[p];
  const res = await fetch(ORIGIN + p, { headers: { 'user-agent': UA }, redirect: 'manual' });
  const entry = { status: res.status, location: res.headers.get('location') || null, type: res.headers.get('content-type') || '' };
  if (res.status === 200 && entry.type.includes('text/html')) fs.writeFileSync(path.join(CACHE, 'pages', slug(clean(p)) + '.html'), await res.text());
  status[p] = entry;
  return entry;
}

const extraPages = new Set();
const redirects = {};
let frontier = [...known];
const visited = new Set(frontier);
while (frontier.length) {
  const next = new Set();
  for (const p of frontier) {
    const file = path.join(CACHE, 'pages', slug(p) + '.html');
    if (!fs.existsSync(file)) continue;
    for (const l of linksOf(fs.readFileSync(file, 'utf8'))) if (!visited.has(clean(l))) next.add(l);
  }
  frontier = [];
  for (const l of next) {
    visited.add(clean(l));
    const r = await probe(l);
    if (r.status === 200 && r.type.includes('text/html')) { extraPages.add(clean(l)); frontier.push(clean(l)); }
    else if (r.status >= 300 && r.status < 400 && r.location) {
      redirects[clean(l)] = { to: r.location, status: r.status };
      const target = new URL(r.location, ORIGIN + '/');
      if (/^(www\.)?freerange\.com$/.test(target.hostname) && !visited.has(clean(target.pathname))) {
        visited.add(clean(target.pathname));
        const t = await probe(target.pathname);
        if (t.status === 200 && t.type.includes('text/html')) { extraPages.add(clean(target.pathname)); frontier.push(clean(target.pathname)); }
      }
    } else if (r.status !== 200) redirects[clean(l)] = redirects[clean(l)] || null;
  }
  fs.writeFileSync(statusCache, JSON.stringify(status, null, 1));
}

fs.writeFileSync(path.join(CACHE, 'extra-pages.txt'), [...extraPages].join('\n') + '\n');
fs.writeFileSync(path.join(CACHE, 'redirects.json'), JSON.stringify(Object.fromEntries(Object.entries(redirects).filter(([, v]) => v)), null, 1));
const missing = Object.entries(status).filter(([, v]) => v.status === 404).map(([k]) => k);
console.log(`extra live pages: ${extraPages.size}`);
for (const p of extraPages) console.log('  +', p);
console.log(`redirects: ${Object.values(redirects).filter(Boolean).length}`);
for (const [k, v] of Object.entries(redirects)) if (v) console.log('  ', v.status, k, '->', v.to);
console.log(`links that are 404 on the live site too: ${missing.length}`, missing.slice(0, 20));
