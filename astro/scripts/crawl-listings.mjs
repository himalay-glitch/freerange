// Captures what HubSpot's server renders for the three filterable listings (/blog, /case-studies, /resources) so the
// Astro site can serve the same responses without HubSpot:
//   - every card, in HubSpot's order, with its exact markup (all pages of ?page=N),
//   - the posts behind every tag (?tags=<slug>, all pages), used to check filter semantics,
//   - the filter groups shown in the sidebar, the row wrappers and the post id of every card (for search).
// Output: .mirror-cache/listings/<listing>.json (raw, live URLs; scripts/mirror.mjs localises them).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.mirror-cache');
const OUT = path.join(CACHE, 'listings');
const ORIGIN = 'https://freerange.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
fs.mkdirSync(path.join(OUT, 'raw'), { recursive: true });

async function get(url) {
  const file = path.join(OUT, 'raw', url.replace(/[^a-z0-9]+/gi, '_') + '.html');
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8');
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA } });
      const html = await res.text();
      fs.writeFileSync(file, html);
      return html;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  throw new Error('failed ' + url);
}

const norm = (href) => href.replace(/^https?:\/\/(www\.)?freerange\.com/, '').replace(/[?#].*$/, '').replace(/\/$/, '') || '/';

function cardsOf(html) {
  const $ = cheerio.load(html);
  return {
    total: Number($('.blog-index').attr('data-total-posts')),
    cards: $('.card-list-container .card-list-item')
      .toArray()
      .map((el) => ({ url: norm($(el).find('a.card-list-item-link').attr('href') || $(el).find('a').attr('href') || ''), html: $.html(el) })),
    rows: $('.card-list-container > .card-list').toArray().map((el) => ({ attrs: el.attribs, count: $(el).find('.card-list-item').length })),
  };
}

async function allPages(base, query = '') {
  const first = cardsOf(await get(`${ORIGIN}${base}${query ? '?' + query : ''}`));
  const pages = Math.ceil(first.total / 10);
  const cards = [...first.cards];
  for (let n = 1; n < pages; n++) cards.push(...cardsOf(await get(`${ORIGIN}${base}?${query ? query + '&' : ''}page=${n}`)).cards);
  return { total: first.total, cards, rows: first.rows };
}

function contentId(url) {
  const slug = url === '/' ? 'index' : url.replace(/^\//, '').replace(/\//g, '__');
  const file = path.join(CACHE, 'pages', slug + '.html');
  if (!fs.existsSync(file)) return null;
  const m = fs.readFileSync(file, 'utf8').match(/hs-content-id-(\d+)/);
  return m ? m[1] : null;
}

for (const listing of ['blog', 'case-studies', 'resources']) {
  const base = '/' + listing;
  const page0 = await get(ORIGIN + base);
  const $ = cheerio.load(page0);

  // Sidebar filter groups (OR inside a group, AND across groups on the live site)
  const groups = [];
  $('[tag-slug]').each((_, el) => {
    const ul = $(el).closest('ul');
    const title = ul.prevAll('h2, h3, h4, .title').first().text().trim() || ul.parent().find('h2, h3, h4').first().text().trim();
    let g = groups.find((x) => x.title === title);
    if (!g) groups.push((g = { title, tags: [] }));
    g.tags.push($(el).attr('tag-slug'));
  });

  const full = await allPages(base);
  // every tag that appears on any card (cards link their tags as ?tags=<slug>)
  const tagSlugs = new Set(groups.flatMap((g) => g.tags));
  for (const c of full.cards) for (const m of c.html.matchAll(/[?&]tags=([a-z0-9-]+)/g)) tagSlugs.add(m[1]);

  const membership = {};
  for (const slug of tagSlugs) {
    const r = await allPages(base, `tags=${slug}`);
    membership[slug] = { total: r.total, urls: r.cards.map((c) => c.url) };
  }

  // card markup must not depend on its position (row type); record any post whose markup differs between captures
  const seen = new Map();
  const variants = [];
  const collect = (cards) => { for (const c of cards) { if (!seen.has(c.url)) seen.set(c.url, c.html); else if (seen.get(c.url) !== c.html) variants.push(c.url); } };
  collect(full.cards);
  for (const slug of tagSlugs) collect(cardsOf(await get(`${ORIGIN}${base}?tags=${slug}`)).cards);

  const data = {
    listing,
    total: full.total,
    groups,
    rowAttrs: full.rows.map((r) => r.attrs),
    cards: full.cards.map((c) => ({
      url: c.url,
      id: contentId(c.url),
      html: c.html,
      tags: [...tagSlugs].filter((t) => membership[t].urls.includes(c.url)),
    })),
    membership,
  };
  fs.writeFileSync(path.join(OUT, listing + '.json'), JSON.stringify(data, null, 1));
  const missingIds = data.cards.filter((c) => !c.id).map((c) => c.url);
  console.log(`${listing}: total ${data.total}, cards ${data.cards.length}, tags ${tagSlugs.size}, groups ${groups.map((g) => g.title + ':' + g.tags.length).join(' ')}, position-dependent cards ${new Set(variants).size}, cards without id ${missingIds.length}`);
  if (missingIds.length) console.log('   no id:', missingIds.slice(0, 5));
}
