// Captures HubSpot CTA buttons as the live site renders them, for scripts/mirror.mjs to bake into the pages.
//
//   node scripts/capture-ctas.mjs
//
// On freerange.com a CTA is a fallback image that HubSpot's script replaces in the browser with the real button and
// a small stylesheet. This opens every page that has a CTA, waits for that swap, and records the rendered button
// (attributes, label, stylesheet) in scripts/data/cta-renders.json, keyed by the CTA's placement id. The link is
// stored as the CTA's destination rather than HubSpot's click-tracking URL.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch } from './lib/browser.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://freerange.com';
const OUT = path.join(ROOT, 'scripts', 'data', 'cta-renders.json');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const pages = fs.readFileSync(path.join(ROOT, 'scripts', 'pages.txt'), 'utf8').split('\n').filter(Boolean);

// Find the pages that contain a CTA without opening a browser for every page.
const withCtas = [];
for (const p of pages) {
  const html = await (await fetch(ORIGIN + p, { headers: { 'user-agent': UA } })).text();
  if (html.includes('hs-cta-wrapper')) withCtas.push(p);
}
console.log(`pages with CTAs: ${withCtas.join(', ') || 'none'}`);

const renders = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const browser = await launch();
for (const p of withCtas) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(ORIGIN + p, { waitUntil: 'load' });
  await page.waitForFunction(() => [...document.querySelectorAll('.hs-cta-node')].every((n) => n.querySelector('a.cta_button, a[cta_dest_link]')), null, { timeout: 15000 }).catch(() => {});
  const found = await page.evaluate(() => {
    const styles = [...document.querySelectorAll('head style')].map((s) => s.textContent).filter((t) => t.includes('.hs-cta-wrapper p, .hs-cta-wrapper div'));
    const out = {};
    for (const w of document.querySelectorAll('.hs-cta-wrapper')) {
      const node = w.querySelector('.hs-cta-node');
      const a = node && node.querySelector('a');
      if (!a || !a.hasAttribute('cta_dest_link')) continue;
      const aAttrs = Object.fromEntries([...a.attributes].map((x) => [x.name, x.name === 'href' ? a.getAttribute('cta_dest_link') : x.value]));
      out[w.id.replace('hs-cta-wrapper-', '')] = {
        nodeAttrs: Object.fromEntries([...node.attributes].map((x) => [x.name, x.value])),
        aAttrs,
        aHtml: a.innerHTML,
        style: styles.find((s) => aAttrs.id && s.includes(aAttrs.id)) || null,
      };
    }
    return out;
  });
  Object.assign(renders, found);
  console.log(`${p}: ${Object.keys(found).length} CTA(s) captured`);
  await page.close();
}
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(renders, null, 1) + '\n');
console.log(`wrote ${Object.keys(renders).length} CTA(s) to ${path.relative(ROOT, OUT)}`);
