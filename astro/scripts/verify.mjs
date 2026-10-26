// Full design cross-check: every page, live freerange.com vs this Astro build, side by side in a real browser.
//
//   node scripts/verify.mjs [--width 1440|390] [--only /path,/path] [--concurrency 4] [--out recheck]
//
// For each page and viewport it loads both versions, scrolls them top to bottom (so lazy images, scroll animations
// and observers run), then compares every element: tag/classes, position and size, colours, background images,
// fonts, borders, radius, shadows, opacity, visibility, transforms, image sources and natural sizes, text, and the
// ::before/::after pseudo-elements. It then screenshots both pages screen by screen and compares pixels.
// Regions that animate on their own (logo carousels, typing text, cursor-following decorations, the hero scene) are
// compared for structure and style but not for position/pixels; HubSpot's chat widget is ignored.
// Results: .mirror-cache/verify/<width>/results.jsonl, and side-by-side PNGs of any screen that differs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.mirror-cache');
const require = createRequire(path.join(CACHE, 'tools', 'package.json'));
const { chromium } = require('playwright-core');
const sharp = createRequire(path.join(ROOT, 'package.json'))('sharp');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => (v.startsWith('--') ? [...a, [v.slice(2), all[i + 1]]] : a), []));
const WIDTHS = args.width ? [Number(args.width)] : [1440, 390];
const CONCURRENCY = Number(args.concurrency || 4);
const LIVE = 'https://freerange.com';
const ASTRO = args.astro || 'http://127.0.0.1:4321';
const CHROME = '/Users/uxui/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

let pages = fs.readFileSync(path.join(CACHE, 'urls-site.txt'), 'utf8').split('\n').filter(Boolean);
pages.push('/this-page-does-not-exist-404-check');
if (args.only) pages = args.only.split(',');

const THIRD_PARTY = '#hubspot-messages-iframe-container, #hs-banner-parent, #hs-eu-cookie-confirmation, [id^="hs-web-interactives"], .hs-web-interactive-inline-container, .grecaptcha-badge, iframe';
const DYNAMIC = '.splide, .logo-carousel, .bg-section-decorator, .parallax-scene, .hidden-layer, .typewriter-container, #hero-text, #hero-container, canvas, .Typewriter';

// ------------------------------------------------------------------------------------------- in-page extraction
function extract({ THIRD_PARTY, DYNAMIC }) {
  const normUrl = (u) => {
    let b = String(u).split('?')[0].split('#')[0].split('/').pop();
    try { b = decodeURIComponent(b); } catch {}
    return b.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/\.[0-9a-f]{8}(\.[a-z0-9]+)$/i, '$1').toLowerCase();
  };
  const normBg = (v) => (v || 'none').replace(/url\("?([^")]+)"?\)/g, (m, u) => 'url(' + normUrl(u) + ')');
  const root = document.querySelector('.body-wrapper') || document.body;
  const els = [...root.querySelectorAll('*')].filter((e) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'BR', 'LINK', 'META', 'TEMPLATE'].includes(e.tagName) && !e.closest(THIRD_PARTY));
  const pseudo = (e, which) => {
    const s = getComputedStyle(e, which);
    if (!s.content || s.content === 'none' || s.content === 'normal') return '';
    return [s.content.slice(0, 20), s.display, s.width, s.height, s.color, s.backgroundColor, normBg(s.backgroundImage), s.borderTopWidth + ' ' + s.borderTopColor, s.transform, s.opacity].join('|');
  };
  return {
    title: document.title,
    height: document.documentElement.scrollHeight,
    bodyClass: document.body.className,
    els: els.map((e) => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      const cls = typeof e.className === 'string' ? e.className : (e.className && e.className.baseVal) || '';
      const own = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
      const isImg = e.tagName === 'IMG';
      return {
        // HubSpot gives each embedded form a random instance id class on every load; ignore those ids
        sig: e.tagName.toLowerCase() + (cls ? '.' + cls.trim().split(/\s+/).filter((c) => !/^(lazyloaded|is-|active|animate|aos-|flickity-|splide__slide--)/.test(c)).map((c) => c.replace(/_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/, '_<instance>')).slice(0, 4).join('.') : ''),
        dyn: !!e.closest(DYNAMIC),
        geo: [Math.round(r.left), Math.round(r.top + window.scrollY), Math.round(r.width), Math.round(r.height)],
        style: {
          color: cs.color, bg: cs.backgroundColor, bgImage: normBg(cs.backgroundImage), bgSize: cs.backgroundSize, bgPos: cs.backgroundPosition,
          font: cs.fontFamily.split(',')[0].trim(), size: cs.fontSize, weight: cs.fontWeight, fstyle: cs.fontStyle, lh: cs.lineHeight, ls: cs.letterSpacing,
          tt: cs.textTransform, td: cs.textDecorationLine, ta: cs.textAlign,
          border: [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth, cs.borderTopStyle, cs.borderTopColor, cs.borderBottomColor].join(' '),
          radius: cs.borderRadius, shadow: cs.boxShadow, tshadow: cs.textShadow, opacity: cs.opacity, vis: cs.visibility, display: cs.display,
          pos: cs.position, z: cs.zIndex, transform: cs.transform, fit: cs.objectFit, filter: cs.filter, overflow: cs.overflow,
        },
        img: isImg ? `${normUrl(e.currentSrc || e.src)} ${e.complete && e.naturalWidth > 0 ? e.naturalWidth + 'x' + e.naturalHeight : 'NOT-LOADED'}` : '',
        text: own.slice(0, 80),
        before: pseudo(e, '::before'),
        after: pseudo(e, '::after'),
      };
    }),
  };
}

// ------------------------------------------------------------------------------------------- comparison
function align(a, b) {
  const pairs = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i].sig === b[j].sig) { pairs.push([i++, j++]); continue; }
    let found = false;
    for (let k = 1; k < 60 && !found; k++) {
      if (j + k < b.length && a[i].sig === b[j + k].sig) { for (let m = 0; m < k; m++) pairs.push([null, j + m]); j += k; found = true; }
      else if (i + k < a.length && a[i + k].sig === b[j].sig) { for (let m = 0; m < k; m++) pairs.push([i + m, null]); i += k; found = true; }
    }
    if (!found) pairs.push([i++, j++]);
  }
  while (i < a.length) pairs.push([i++, null]);
  while (j < b.length) pairs.push([null, j++]);
  return pairs;
}

function compareEls(L, A) {
  const diffs = [];
  let identical = 0;
  for (const [i, j] of align(L.els, A.els)) {
    const a = i == null ? null : L.els[i], b = j == null ? null : A.els[j];
    if (!a || !b) { diffs.push(`${a ? 'only on live' : 'only in astro'}: ${(a || b).sig.slice(0, 90)}`); continue; }
    const d = [];
    if (a.sig !== b.sig) d.push(`element ${a.sig.slice(0, 50)} vs ${b.sig.slice(0, 50)}`);
    if (!a.dyn) {
      ['x', 'y', 'w', 'h'].forEach((k, n) => { if (Math.abs(a.geo[n] - b.geo[n]) > 1) d.push(`${k} ${a.geo[n]}→${b.geo[n]}`); });
      if (a.text !== b.text) d.push(`text "${a.text.slice(0, 40)}"→"${b.text.slice(0, 40)}"`);
    }
    for (const k of Object.keys(a.style)) {
      if (a.dyn && (k === 'transform' || k === 'opacity')) continue;
      if (a.style[k] !== b.style[k]) d.push(`${k} ${String(a.style[k]).slice(0, 60)}→${String(b.style[k]).slice(0, 60)}`);
    }
    if (a.img !== b.img) d.push(`img ${a.img}→${b.img}`);
    if (a.before !== b.before) d.push(`::before ${a.before.slice(0, 60)}→${b.before.slice(0, 60)}`);
    if (a.after !== b.after) d.push(`::after ${a.after.slice(0, 60)}→${b.after.slice(0, 60)}`);
    if (d.length) diffs.push(`${a.sig.slice(0, 70)} @y${a.geo[1]}: ${d.join('; ')}`.slice(0, 400));
    else identical++;
  }
  return { identical, diffs };
}

async function pixelDiff(bufA, bufB) {
  const [a, b] = await Promise.all([sharp(bufA).ensureAlpha().raw().toBuffer({ resolveWithObject: true }), sharp(bufB).ensureAlpha().raw().toBuffer({ resolveWithObject: true })]);
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) return { pct: 100, bbox: 'size differs' };
  const { width, height } = a.info;
  let n = 0, x0 = width, y0 = height, x1 = -1, y1 = -1;
  for (let p = 0, px = 0; p < a.data.length; p += 4, px++) {
    const dv = Math.max(Math.abs(a.data[p] - b.data[p]), Math.abs(a.data[p + 1] - b.data[p + 1]), Math.abs(a.data[p + 2] - b.data[p + 2]));
    if (dv > 24) { n++; const x = px % width, y = (px / width) | 0; if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  }
  return { pct: (100 * n) / (width * height), bbox: n ? [x0, y0, x1, y1] : null };
}

// ------------------------------------------------------------------------------------------- page handling
async function open(browser, url, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const failures = [];
  page.on('response', (r) => { if (r.status() >= 400 && !/google|gstatic|hubspot|hsforms|usemessages|hs-banner|hscollectedforms|hs-analytics|hotjar|facebook|twitter|linkedin|doubleclick|csp/.test(r.url())) failures.push(`${r.status()} ${r.url().slice(0, 140)}`); });
  page.on('pageerror', (e) => failures.push('JS error: ' + e.message.slice(0, 140)));
  await page.mouse.move(0, 0);
  const resp = await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= H; y += Math.round(h / 2)) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0));
  // Measure only once every image has finished loading: some theme layouts (e.g. the footer logo, sized from the row
  // that holds the B Corp badge) settle only after their images arrive, on the live site and here alike.
  await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1800);
  return { ctx, page, failures, status: resp ? resp.status() : 0 };
}

async function comparePage(browser, p, w, h, outDir) {
  const slug = (p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '__')).slice(0, 90);
  const [L, A] = await Promise.all([open(browser, LIVE + p, w, h), open(browser, ASTRO + p, w, h)]);
  try {
    const [l, a] = await Promise.all([L.page.evaluate(extract, { THIRD_PARTY, DYNAMIC }), A.page.evaluate(extract, { THIRD_PARTY, DYNAMIC })]);
    const els = compareEls(l, a);
    const screens = [];
    const H = Math.max(l.height, a.height);
    for (let y = 0, n = 0; y < H; y += h, n++) {
      await Promise.all([L.page.evaluate((v) => window.scrollTo(0, v), y), A.page.evaluate((v) => window.scrollTo(0, v), y)]);
      await Promise.all([L.page.waitForTimeout(900), A.page.waitForTimeout(900)]);
      const shot = (pg) => pg.screenshot({ mask: [pg.locator(DYNAMIC), pg.locator(THIRD_PARTY)], maskColor: '#ff00ff' });
      const [bl, ba] = await Promise.all([shot(L.page), shot(A.page)]);
      const d = await pixelDiff(bl, ba);
      screens.push({ n, y, pct: Number(d.pct.toFixed(3)), bbox: d.bbox });
      if (d.pct > 0.05) {
        const dir = path.join(outDir, slug);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, `live-${String(n).padStart(2, '0')}.png`), bl);
        fs.writeFileSync(path.join(dir, `astro-${String(n).padStart(2, '0')}.png`), ba);
      }
    }
    return {
      path: p, width: w, status: [L.status, A.status], title: l.title === a.title, heights: [l.height, a.height], bodyClass: [l.bodyClass, a.bodyClass],
      elements: [l.els.length, a.els.length], identical: els.identical, differing: els.diffs.length, diffs: els.diffs.slice(0, 25),
      worstScreen: screens.reduce((m, s) => (s.pct > m.pct ? s : m), { pct: 0 }), screensWithDiff: screens.filter((s) => s.pct > 0.05).length, screens: screens.length,
      failures: { live: L.failures.slice(0, 5), astro: A.failures.slice(0, 8) },
    };
  } finally {
    await L.ctx.close();
    await A.ctx.close();
  }
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const w of WIDTHS) {
  const h = w >= 1000 ? 900 : w >= 700 ? 1024 : 844;
  const outDir = path.join(CACHE, 'verify', args.out ? `${args.out}-${w}` : String(w));
  fs.mkdirSync(outDir, { recursive: true });
  const resultsFile = path.join(outDir, 'results.jsonl');
  const done = new Set(fs.existsSync(resultsFile) ? fs.readFileSync(resultsFile, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l).path) : []);
  const queue = pages.filter((p) => !done.has(p));
  let finished = done.size;
  const worker = async () => {
    while (queue.length) {
      const p = queue.shift();
      let r;
      for (let attempt = 0; attempt < 2; attempt++) {
        try { r = await comparePage(browser, p, w, h, outDir); break; } catch (e) { r = { path: p, width: w, error: e.message.slice(0, 200) }; }
      }
      fs.appendFileSync(resultsFile, JSON.stringify(r) + '\n');
      finished++;
      console.log(`[${w}] ${finished}/${pages.length} ${p} ${r.error ? 'ERROR ' + r.error : `${r.identical}/${r.elements[0]} identical, ${r.differing} differing, worst screen ${r.worstScreen.pct}%`}`);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}
await browser.close();
