// Mirrors live freerange.com pages into this Astro project, byte-for-byte in markup, styles, scripts and media.
//
//   node scripts/mirror.mjs                 -> every page in scripts/pages.txt, plus the 404 page
//   node scripts/mirror.mjs / /about        -> only these paths
//
// Inputs: scripts/pages.txt (page list), scripts/data/cta-renders.json (from capture-ctas.mjs) and
// .mirror-cache/listings/*.json (from crawl-listings.mjs). Downloads are cached in .mirror-cache/.
//
// For every page it: downloads the live HTML (cached in .mirror-cache/pages), downloads every stylesheet, script,
// image, font and video it references (recursively through CSS url()/@import), rewrites those URLs to local
// copies under public/, rewrites links to other pages to root-relative paths, removes analytics/tracking tags
// (kept in src/components/Tracking.astro behind PUBLIC_ENABLE_TRACKING), replaces HubSpot CTA redirects with
// their real destinations, and writes the page as an .astro file that uses the shared Header/Footer components.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.mirror-cache');
const PUB = path.join(ROOT, 'public');
const SRC = path.join(ROOT, 'src');
const ORIGIN = 'https://freerange.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const SITE_HOSTS = new Set(['freerange.com', 'www.freerange.com']);
// Hosts whose files are copied locally (everything else, e.g. YouTube, HubSpot forms, social widgets, stays external).
const LOCAL_HOSTS = new Set([
  ...SITE_HOSTS,
  '2211982.fs1.hubspotusercontent-na1.net',
  'f.hubspotusercontent30.net',
  'f.hubspotusercontent10.net',
  'f.hubspotusercontent00.net',
  'f.hubspotusercontent20.net',
  'f.hubspotusercontent40.net',
  'cdn2.hubspot.net',
  'static.hubspot.com',
  'no-cache.hubspot.com',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'lh3.googleusercontent.com',
  'lh4.googleusercontent.com',
  'lh5.googleusercontent.com',
  'lh6.googleusercontent.com',
  'media0.giphy.com',
]);
const SITE_ASSET_PREFIXES = ['/hubfs/', '/hs-fs/', '/hs/hsstatic/', '/_hcms/googlefonts/', '/_hcms/forms/'];
const FILE_EXT = /\.(css|js|mjs|json|png|jpe?g|gif|svg|webp|avif|ico|bmp|tiff?|mp4|webm|mov|m4v|ogg|ogv|mp3|wav|woff2?|ttf|otf|eot|pdf|zip|txt|xml|vtt)$/i;
const CT_EXT = {
  'text/css': '.css', 'application/javascript': '.js', 'text/javascript': '.js', 'image/png': '.png', 'image/jpeg': '.jpg',
  'image/gif': '.gif', 'image/svg+xml': '.svg', 'image/webp': '.webp', 'image/avif': '.avif', 'video/mp4': '.mp4',
  'font/woff2': '.woff2', 'font/woff': '.woff', 'application/pdf': '.pdf', 'image/x-icon': '.ico', 'image/vnd.microsoft.icon': '.ico',
};

// Tags removed from every page (analytics, session recording, CMS editor tooling, web-vitals beacons).
const TRACKING_SCRIPT_SRC = [/googletagmanager\.com/, /\/hs\/scriptloader\//, /HubspotToolsMenu/, /content-cwv-embed/];
const TRACKING_INLINE = [/gtag\(/, /_hjSettings/, /_hsq\.push/];

// Edits applied to downloaded scripts so features that called HubSpot's servers run on this site instead.
const JS_PATCHES = [
  ['"https://api.hubapi.com/contentsearch/v2/search?portalId="', '"/api/contentsearch?portalId="'],
  ['window.location.origin+"/_hcms/api/get-file"', 'window.location.origin+"/api/get-file"'],
  ['window.location.origin+"/_hcms/api/update-download-resources"', 'window.location.origin+"/api/update-download-resources"'],
];

// Runtime-built URL families: the approach animation loads `<base>00000.png` … `<base>00192.png` from its config.
function expandSequences(url) {
  const m = url.match(/^(.*explore_bird_)(\d{5})\.png$/);
  if (!m) return [];
  const out = [];
  for (let i = 0; i < 193; i++) out.push(`${m[1]}${String(i).padStart(5, '0')}.png`);
  return out;
}

// ---------------------------------------------------------------------------------------------- helpers
const sha = (s, n = 8) => crypto.createHash('sha1').update(s).digest('hex').slice(0, n);
const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });
const pageSlug = (p) => (p === '/' ? 'index' : p.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, '__'));
const decodeRaw = (raw) => raw.replace(/&amp;/g, '&').replace(/\\\//g, '/');

function toAbs(raw, base = ORIGIN + '/', keepHash = false) {
  try {
    const u = new URL(decodeRaw(raw), base);
    if (!/^https?:$/.test(u.protocol)) return null;
    u.searchParams.delete('hsLang');
    if (!keepHash) u.hash = '';
    return u;
  } catch {
    return null;
  }
}

function isAsset(u) {
  if (!LOCAL_HOSTS.has(u.hostname)) return false;
  if (SITE_HOSTS.has(u.hostname)) return SITE_ASSET_PREFIXES.some((p) => u.pathname.startsWith(p)) || FILE_EXT.test(u.pathname);
  if (/googleusercontent\.com$/.test(u.hostname)) return true;
  if (u.hostname === 'fonts.googleapis.com') return u.pathname.startsWith('/css');
  return FILE_EXT.test(u.pathname) || u.pathname.startsWith('/hubfs/');
}

// ---------------------------------------------------------------------------------------------- downloads
const FILES = path.join(CACHE, 'files');
ensureDir(FILES);
ensureDir(path.join(CACHE, 'pages'));
const manifestPath = path.join(CACHE, 'files.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};

async function download(url) {
  if (manifest[url] && fs.existsSync(path.join(FILES, manifest[url].file))) return manifest[url];
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA, accept: '*/*' }, redirect: 'follow' });
      const buf = Buffer.from(await res.arrayBuffer());
      const entry = { status: res.status, type: (res.headers.get('content-type') || '').split(';')[0].trim(), file: sha(url, 16), size: buf.length };
      if (res.ok) fs.writeFileSync(path.join(FILES, entry.file), buf);
      manifest[url] = entry;
      return entry;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  manifest[url] = { status: 0, error: String(lastErr), file: sha(url, 16), size: 0 };
  return manifest[url];
}

async function pool(items, n, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: n }, async () => { while (queue.length) await fn(queue.shift()); }));
}

// ---------------------------------------------------------------------------------------------- local paths
const localPaths = new Map(); // abs url -> local path
const taken = new Map(); // local path -> abs url
function sanitizePath(p) {
  return p
    .split('/')
    .map((seg) => {
      let s = seg;
      try { s = decodeURIComponent(seg); } catch {}
      return s.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/-+/g, '-');
    })
    .join('/');
}
function localPathFor(url) {
  if (localPaths.has(url)) return localPaths.get(url);
  const u = new URL(url);
  let p = sanitizePath(u.pathname);
  if (p.endsWith('/')) p += 'index';
  if (!SITE_HOSTS.has(u.hostname)) p = `/ext/${u.hostname}${p.startsWith('/') ? '' : '/'}${p}`;
  let ext = path.posix.extname(p);
  const entry = manifest[url];
  if (!ext || !FILE_EXT.test(p)) {
    const guess = entry && CT_EXT[entry.type];
    if (guess) { p += guess; ext = guess; }
  }
  if (u.search) p = p.slice(0, p.length - ext.length) + '.' + sha(u.search) + ext;
  // Compare case-insensitively: macOS and Windows file systems treat "Eero.png" and "eero.png" as one file.
  const key = (x) => x.toLowerCase();
  if (taken.has(key(p)) && taken.get(key(p)) !== url) p = p.slice(0, p.length - ext.length) + '.' + sha(url) + ext;
  taken.set(key(p), url);
  localPaths.set(url, p);
  return p;
}

// ---------------------------------------------------------------------------------------------- URL scanning
const ABS_RE = /(?:https?:)?\/\/(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?(?:\/[^"'\s<>\\`]*)?/gi;
const ESC_RE = /https?:\\\/\\\/(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\\\/[^"'\s<>`]*)?/gi;
const REL_RE = /(?<=["'(\s,=])\/(?:hubfs|hs-fs|hs\/hsstatic|_hcms\/googlefonts|_hcms\/forms)\/[^"'\s<>\\`]+/g;
const ENTITY_TAIL = /(&quot;|&#34;|&#39;|&#x27;|&apos;|&gt;|&lt;).*$/;

function trimRaw(raw) {
  let r = raw.replace(ENTITY_TAIL, '');
  // Parentheses belong to the URL only when balanced (e.g. "Icon Area (1).svg"); the first unbalanced ")" ends it
  // (it closes a CSS url(...) or a JS call).
  let depth = 0;
  for (let i = 0; i < r.length; i++) {
    if (r[i] === '(') depth++;
    else if (r[i] === ')') {
      if (depth === 0) { r = r.slice(0, i); break; }
      depth--;
    }
  }
  return r.replace(/[.,;:!]+$/, '');
}

function findUrls(text, base) {
  const found = [];
  for (const re of [ESC_RE, ABS_RE, REL_RE]) {
    re.lastIndex = 0;
    for (const m of text.matchAll(re)) {
      const raw = trimRaw(m[0]);
      if (re === ABS_RE && text[m.index - 1] === '\\') continue;
      const u = toAbs(raw, base);
      if (u) found.push({ raw, abs: u });
    }
  }
  return found;
}

function cssRefs(css, cssUrl) {
  const out = [];
  for (const m of css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
    if (/^(data:|#|about:)/.test(m[2])) continue;
    const u = toAbs(m[2], cssUrl);
    if (u) out.push({ raw: m[2], abs: u });
  }
  for (const m of css.matchAll(/@import\s+(?:url\()?\s*['"]([^'"]+)['"]/g)) {
    const u = toAbs(m[1], cssUrl);
    if (u) out.push({ raw: m[1], abs: u });
  }
  return out;
}

// Replace every URL occurrence in a text with its local path (assets) or root-relative path (site pages).
function rewriteText(text, base) {
  const replace = (raw, escaped) => {
    const u = toAbs(raw, base);
    if (!u) return raw;
    const href = u.href;
    let out;
    if (isAsset(u) && localPaths.has(href)) out = localPaths.get(href);
    else if (SITE_HOSTS.has(u.hostname) && !isAsset(u)) {
      const withHash = toAbs(raw, base, true);
      out = (u.pathname || '/') + u.search + (withHash ? withHash.hash : '');
      if (/&amp;/.test(raw)) out = out.replace(/&/g, '&amp;');
    } else return raw;
    return escaped ? out.replace(/\//g, '\\/') : out;
  };
  let t = text.replace(ESC_RE, (m) => {
    const raw = trimRaw(m);
    return replace(raw, true) + m.slice(raw.length);
  });
  t = t.replace(ABS_RE, (m, offset, whole) => {
    if (whole[offset - 1] === '\\') return m;
    const raw = trimRaw(m);
    return replace(raw, false) + m.slice(raw.length);
  });
  t = t.replace(REL_RE, (m) => {
    const raw = trimRaw(m);
    return replace(raw, false) + m.slice(raw.length);
  });
  // Links that were already root-relative still carry HubSpot's language parameter.
  t = t.replace(/\?hsLang=en(&amp;|&)?/g, (m, next) => (next ? '?' : '')).replace(/(&amp;|&)hsLang=en/g, '');
  return t;
}

function rewriteCss(css, cssUrl) {
  let out = css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, ref) => {
    if (/^(data:|#|about:)/.test(ref)) return m;
    const u = toAbs(ref, cssUrl);
    if (u && localPaths.has(u.href)) return `url(${q}${localPaths.get(u.href)}${q})`;
    return m;
  });
  out = out.replace(/@import\s+(url\()?\s*(['"])([^'"]+)\2/g, (m, url, q, ref) => {
    const u = toAbs(ref, cssUrl);
    return u && localPaths.has(u.href) ? m.replace(ref, localPaths.get(u.href)) : m;
  });
  return rewriteText(out, cssUrl);
}

// ---------------------------------------------------------------------------------------------- page processing
async function fetchPage(p) {
  const file = path.join(CACHE, 'pages', pageSlug(p) + '.html');
  if (!fs.existsSync(file)) {
    const res = await fetch(ORIGIN + (p === '/404' ? '/this-page-does-not-exist-404-check' : p), { headers: { 'user-agent': UA } });
    fs.writeFileSync(file, await res.text());
  }
  return fs.readFileSync(file, 'utf8');
}

const ctaCache = path.join(CACHE, 'cta.json');
const ctaTargets = fs.existsSync(ctaCache) ? JSON.parse(fs.readFileSync(ctaCache, 'utf8')) : {};
async function resolveCta(href) {
  if (ctaTargets[href]) return ctaTargets[href];
  // HubSpot answers with a meta-refresh page rather than a 30x, so read the destination out of the body.
  const res = await fetch(href, { headers: { 'user-agent': UA }, redirect: 'manual' });
  let loc = res.headers.get('location');
  if (!loc) {
    const body = await res.text();
    const m = body.match(/http-equiv="refresh"\s+content="\d+;url=([^"]+)"/i) || body.match(/var redirectUrl = "([^"]+)"/);
    loc = m ? m[1] : href;
  }
  ctaTargets[href] = loc;
  return loc;
}

const trackingSnippets = new Map();

// HubSpot CTAs as the live site renders them (scripts/capture-ctas.mjs writes this file): placement id -> rendered
// node and anchor attributes (href already set to the destination), label and the stylesheet HubSpot injects.
const CTA_RENDERS = path.join(ROOT, 'scripts', 'data', 'cta-renders.json');
const ctaRenders = fs.existsSync(CTA_RENDERS) ? JSON.parse(fs.readFileSync(CTA_RENDERS, 'utf8')) : {};

// Load-event timing: the theme registers its window "load" listeners inside cash's ready(), which cash defers with
// setTimeout. HubSpot pages load slowly enough that this always happens before "load"; served locally the page can
// finish first and those listeners (form set-up, slider resize, header "init" removal, filter replay) never run.
// This shim runs a "load" listener attached after the page has loaded, reproducing the live order of events.
const LOAD_SHIM = "(function($){if(!$||!$.fn)return;var on=$.fn.on;$.fn.on=function(e,f){if(this[0]===window&&e==='load'&&typeof f==='function'&&document.readyState==='complete'){var self=this;setTimeout(function(){f.call(window,new Event('load'))},0);return self}return on.apply(this,arguments)}})(window.cash);";

async function prepare(p) {
  const html = await fetchPage(p);
  const $ = cheerio.load(html);

  // Tracking / analytics
  $('script').each((_, el) => {
    const $el = $(el);
    const src = $el.attr('src') || '';
    const body = $el.html() || '';
    const isTracking = src ? TRACKING_SCRIPT_SRC.some((re) => re.test(src)) : TRACKING_INLINE.some((re) => re.test(body));
    if (isTracking) {
      if (!/_hsq\.push|HubspotToolsMenu|content-cwv-embed/.test(src + body)) trackingSnippets.set($.html(el), true);
      $el.remove();
    }
  });
  $('link[rel="amphtml"]').remove();
  // HubSpot CMS render metadata. Its presence tells HubSpot's chat widget the page is CMS-hosted, which sends it to
  // the CMS-only /_hcms/livechat proxy; nothing in the site's own code reads it.
  $('script:not([src])').each((_, el) => { if (/^\s*var hsVars\s*=/.test($(el).html() || '')) $(el).remove(); });

  // HubSpot CTAs: the live page swaps the fallback image for the CTA as HubSpot renders it (button markup plus an
  // injected stylesheet). Bake that rendered state in; links go straight to the destination; the loader is dropped.
  const ctaStyles = [];
  for (const w of $('.hs-cta-wrapper').toArray()) {
    const guid = ($(w).attr('id') || '').replace('hs-cta-wrapper-', '');
    const r = ctaRenders[guid];
    const node = $(w).find('.hs-cta-node').first();
    if (r && node.length) {
      for (const k of Object.keys(node.attr() || {})) node.removeAttr(k);
      for (const [k, v] of Object.entries(r.nodeAttrs)) node.attr(k, v);
      const a = $('<a></a>');
      for (const [k, v] of Object.entries(r.aAttrs)) a.attr(k, v);
      a.html(r.aHtml);
      node.empty().append(a);
      if (r.style) ctaStyles.push(r.style);
    } else {
      console.warn(`  ! CTA ${guid} on ${p} has no captured render; keeping its fallback image`);
      for (const el of $(w).find('a[href*="cta-redirect.hubspot.com"]').toArray()) $(el).attr('href', await resolveCta($(el).attr('href')));
    }
  }
  if (ctaStyles.length) $('head').prepend($('<style></style>').text(ctaStyles.join('\n')));
  $('script[src*="/hs/cta/cta/current.js"]').remove();
  $('script:not([src])').each((_, el) => { if (/hbspt\.cta\.load/.test($(el).html() || '')) $(el).remove(); });

  // HubSpot forms: the CMS points the loader at its own /_hcms/forms/ proxy; without it the loader talks to HubSpot's
  // public form servers directly, which render and submit the same forms from any host.
  $('script:not([src])').each((_, el) => {
    const js = $(el).html() || '';
    if (/formsBaseUrl:\s*'\/_hcms\/forms\/',/.test(js)) $(el).text(js.replace(/\s*formsBaseUrl:\s*'\/_hcms\/forms\/',/, ''));
  });

  // Run late "load" listeners (see LOAD_SHIM above).
  const cashTag = $('script[src*="cash.min.js"]').first();
  if (cashTag.length) cashTag.after(`<script>${LOAD_SHIM}</script>`);

  return $;
}

function collectFromDocument($, set) {
  for (const { abs } of findUrls($.html(), ORIGIN + '/')) if (isAsset(abs)) set.add(abs.href);
}

async function crawlAssets(initial) {
  const seen = new Set();
  let queue = [...initial];
  while (queue.length) {
    const batch = [];
    for (const url of queue) {
      if (seen.has(url)) continue;
      seen.add(url);
      batch.push(url);
      for (const extra of expandSequences(url)) if (!seen.has(extra)) { seen.add(extra); batch.push(extra); }
    }
    queue = [];
    await pool(batch, 8, async (url) => {
      const entry = await download(url);
      if (!(entry.status >= 200 && entry.status < 300)) return;
      const isCss = entry.type === 'text/css' || /\.css$/i.test(new URL(url).pathname);
      const isJs = /javascript/.test(entry.type) || /\.m?js$/i.test(new URL(url).pathname);
      if (!isCss && !isJs) return;
      const text = fs.readFileSync(path.join(FILES, entry.file), 'utf8');
      const refs = isCss ? [...cssRefs(text, url), ...findUrls(text, url)] : findUrls(text, url);
      for (const { abs } of refs) if (isAsset(abs) && !seen.has(abs.href)) queue.push(abs.href);
    });
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  }
  return seen;
}

function writePublic(urls) {
  let ok = 0;
  const failed = [];
  for (const url of urls) {
    const entry = manifest[url];
    if (!entry || !(entry.status >= 200 && entry.status < 300)) { failed.push([url, entry && entry.status]); continue; }
    const local = localPathFor(url);
    const dest = path.join(PUB, local);
    ensureDir(path.dirname(dest));
    const u = new URL(url);
    const isCss = entry.type === 'text/css' || /\.css$/i.test(u.pathname);
    const isJs = /javascript/.test(entry.type) || /\.m?js$/i.test(u.pathname);
    if (isCss) fs.writeFileSync(dest, rewriteCss(fs.readFileSync(path.join(FILES, entry.file), 'utf8'), url));
    else if (isJs) {
      let js = rewriteText(fs.readFileSync(path.join(FILES, entry.file), 'utf8'), url);
      for (const [a, b] of JS_PATCHES) js = js.split(a).join(b);
      fs.writeFileSync(dest, js);
    } else fs.copyFileSync(path.join(FILES, entry.file), dest);
    ok++;
  }
  return { ok, failed };
}

// ---------------------------------------------------------------------------------------------- Astro output
const OPEN = '\u0001';
const CLOSE = '\u0002';
// Web addresses written as visible text (e.g. "https://www.freerange.com/contact-us" in the privacy policy) must stay
// word for word, so "//" in text nodes is masked while links are rewritten. JSON data blocks (read by scripts) are not
// text for readers and keep being rewritten.
const SLASH_MASK = '\u0003';
const maskText = (t) => (/^\s*[[{]/.test(t) ? t : t.replace(/\/\//g, '/' + SLASH_MASK + '/'));
const unmask = (t) => t.replace(/\u0003/g, '');
// Serialise a cheerio selection as Astro-safe template markup: scripts/styles stay raw (is:inline) and literal
// braces in text become entities so Astro does not read them as expressions.
function toAstro($, nodes) {
  const sel = $(nodes);
  sel.find('script, style').addBack('script, style').attr('data-astro-raw', '');
  const walk = (node) => {
    for (const child of node.childNodes || []) {
      if (child.type === 'text') child.data = maskText(child.data).replace(/\{/g, OPEN).replace(/\}/g, CLOSE);
      else if (child.type === 'tag' && !['script', 'style'].includes(child.name)) walk(child);
    }
  };
  sel.each((_, node) => {
    if (node.type === 'text') node.data = maskText(node.data).replace(/\{/g, OPEN).replace(/\}/g, CLOSE);
    else if (node.type === 'tag' && !['script', 'style'].includes(node.name)) walk(node);
  });
  return sel
    .toArray()
    .map((n) => $.html(n))
    .join('')
    .replace(/ data-astro-raw=""/g, ' is:inline')
    .replace(/\u0001/g, '&#123;')
    .replace(/\u0002/g, '&#125;');
}

// Social-share tags and canonical links must stay absolute (link previews and search engines need full URLs).
function absolutizeMeta(head) {
  const abs = (p) => ORIGIN + (p === '/' ? '' : p); // the live homepage canonical is "https://freerange.com", no slash
  return head
    .replace(/(<meta\b[^>]*\bcontent=")(\/(?:hubfs|hs-fs|ext)\/[^"]*)"/g, (m, a, p) => `${a}${ORIGIN}${p}"`)
    .replace(/(<link\b[^>]*rel="(?:canonical|alternate)"[^>]*href=")(\/[^"]*)"/g, (m, a, p) => `${a}${abs(p)}"`)
    .replace(/(<link\b[^>]*href=")(\/[^"]*)("[^>]*rel="(?:canonical|alternate)")/g, (m, a, p, b) => `${a}${abs(p)}${b}`)
    .replace(/(<meta\b[^>]*property="og:url"[^>]*content=")(\/[^"]*)"/g, (m, a, p) => `${a}${abs(p)}"`);
}

function relImport(fromFile, target) {
  let rel = path.relative(path.dirname(fromFile), target).split(path.sep).join('/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function pageFile(p) {
  if (p === '/404') return path.join(SRC, 'pages', '404.astro');
  const clean = p.replace(/\/$/, '');
  if (clean === '' || clean === '/') return path.join(SRC, 'pages', 'index.astro');
  return path.join(SRC, 'pages', clean.slice(1) + '.astro');
}

const sharedParts = { header: new Map(), footer: new Map() };

// Listing pages: card rows, the post count and the checked state of filter boxes depend on the query string, so they
// become placeholders that the page fills on request (see src/lib/listings.ts).
const LISTINGS = ['/blog', '/case-studies', '/resources'];
function markListing($) {
  const rows = $('.card-list-container > .card-list');
  rows.first().replaceWith('<!--@@CARDS@@-->');
  rows.slice(1).remove();
  $('.blog-index').attr('data-total-posts', '@@TOTAL@@');
  $('input[tag-slug]').each((_, el) => { $(el).attr('data-astro-checked', $(el).attr('tag-slug')); });
}

// Turn a parsed page into Astro-ready markup. Header and footer are lifted out (they become shared components) and
// left as placeholders until every page is known, so pages with a different header get their own variant component.
function buildPage(p, $) {
  if (LISTINGS.includes(p)) markListing($);
  const head = $('head');
  head.find('meta[charset]').remove();
  const lang = $('html').attr('lang') || 'en';
  const bodyClass = $('body').attr('class') || '';

  const parts = {};
  for (const [name, sel] of [['header', 'header.site-header'], ['footer', 'footer.site-footer']]) {
    const el = $(sel).first();
    if (el.length) {
      const markup = unmask(rewriteText(toAstro($, el), ORIGIN + p));
      const key = sha(markup, 12);
      if (!sharedParts[name].has(key)) sharedParts[name].set(key, { markup, pages: [] });
      sharedParts[name].get(key).pages.push(p);
      parts[name] = key;
      el.replaceWith(`<!--@@${name.toUpperCase()}@@-->`);
    }
  }
  const headMarkup = unmask(absolutizeMeta(rewriteText(toAstro($, head.contents()), ORIGIN + p)));
  const bodyMarkup = unmask(rewriteText(toAstro($, $('body').contents()), ORIGIN + p));
  return { p, lang, bodyClass, headMarkup, bodyMarkup, parts };
}

function componentNames() {
  const names = { header: new Map(), footer: new Map() };
  for (const name of ['header', 'footer']) {
    const variants = [...sharedParts[name].entries()].sort((a, b) => b[1].pages.length - a[1].pages.length);
    variants.forEach(([key, v], i) => {
      const base = name === 'header' ? 'Header' : 'Footer';
      names[name].set(key, i === 0 ? base : `${base}${i + 1}`);
      const file = path.join(SRC, 'components', `${names[name].get(key)}.astro`);
      ensureDir(path.dirname(file));
      const usedBy = i === 0 ? 'every page that has a site ' + name : v.pages.join(', ');
      fs.writeFileSync(file, `---\n// Site ${name} (mirrored from ${ORIGIN}). Used by ${usedBy}.\n---\n${v.markup}\n`);
    });
    if (variants.length > 1) console.log(`  ${name} variants:`, variants.map(([, v]) => `${v.pages.length} (${v.pages.slice(0, 3).join(' ')}${v.pages.length > 3 ? ' ...' : ''})`).join(' | '));
  }
  return names;
}

function writePage(b, names) {
  const file = pageFile(b.p);
  ensureDir(path.dirname(file));
  const imports = [`import BaseLayout from '${relImport(file, path.join(SRC, 'layouts', 'BaseLayout.astro'))}';`];
  let body = b.bodyMarkup;
  for (const name of ['header', 'footer']) {
    if (!b.parts[name]) continue;
    const comp = names[name].get(b.parts[name]);
    imports.push(`import ${comp} from '${relImport(file, path.join(SRC, 'components', comp + '.astro'))}';`);
    body = body.replace(`<!--@@${name.toUpperCase()}@@-->`, `<${comp} />`);
  }
  const extra = PAGE_HOOKS[b.p] ? PAGE_HOOKS[b.p](file, body) : { imports: [], frontmatter: '', body };
  fs.writeFileSync(file, `---
// Mirrored from ${ORIGIN}${b.p === '/404' ? ' (its 404 page)' : b.p} — markup, styles and scripts are the live page's own.
${[...imports, ...extra.imports].join('\n')}
${extra.frontmatter}---
<BaseLayout lang="${b.lang}" bodyClass="${b.bodyClass}">
<Fragment slot="head">${b.headMarkup}</Fragment>
${extra.body}
</BaseLayout>
`);
}

// Per-page edits applied when writing the .astro file (listing pages plug in their server-rendered card rows).
const PAGE_HOOKS = {};
for (const lp of LISTINGS) {
  PAGE_HOOKS[lp] = (file, body) => ({
    imports: [
      `import ListingCards from '${relImport(file, path.join(SRC, 'components', 'ListingCards.astro'))}';`,
      `import { selectCards } from '${relImport(file, path.join(SRC, 'lib', 'listings.ts')).replace(/\.ts$/, '')}';`,
    ],
    frontmatter: `// Rendered per request: HubSpot's theme script fetches this page with ?page=, ?tags= and ?posts= for filters,
// search and "Load More", exactly as it did against HubSpot.
export const prerender = false;
const { rows, total, selected } = selectCards('${lp.slice(1)}', Astro.url.searchParams);
`,
    body: body
      .replace('<!--@@CARDS@@-->', '<ListingCards rows={rows} />')
      .replace('data-total-posts="@@TOTAL@@"', 'data-total-posts={total}')
      .replace(/ data-astro-checked="([^"]+)"/g, (m, slug) => ` checked={selected.has('${slug}')}`),
  });
}

function emitTracking() {
  const tracking = [...trackingSnippets.keys()].map((s) => rewriteText(s, ORIGIN + '/')).join('\n');
  fs.writeFileSync(path.join(SRC, 'components', 'Tracking.astro'), `---
// Analytics, session recording and the HubSpot tracking loader from the live site.
// Off by default; set PUBLIC_ENABLE_TRACKING=true to include them exactly as freerange.com does.
const enabled = import.meta.env.PUBLIC_ENABLE_TRACKING === 'true';
const html = ${JSON.stringify(tracking)};
---
{enabled && <Fragment set:html={html} />}
`);
}

// ---------------------------------------------------------------------------------------------- site data
const LISTING_SRC = path.join(CACHE, 'listings');
function loadListings() {
  if (!fs.existsSync(LISTING_SRC)) return [];
  return fs.readdirSync(LISTING_SRC).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(LISTING_SRC, f), 'utf8')));
}

function writeListings(listings) {
  const dir = path.join(SRC, 'data', 'listings');
  ensureDir(dir);
  for (const l of listings) {
    const out = {
      listing: l.listing,
      total: l.total,
      groups: l.groups,
      rowAttrs: l.rowAttrs,
      cards: l.cards.map((c) => ({ id: c.id, url: c.url, tags: c.tags, html: rewriteText(c.html, ORIGIN + '/' + l.listing) })),
      // HubSpot's order for each single-tag page (posts published at the same moment can swap places per query)
      tagOrder: Object.fromEntries(Object.entries(l.membership).map(([t, m]) => [t, m.urls])),
    };
    fs.writeFileSync(path.join(dir, l.listing + '.json'), JSON.stringify(out));
  }
}

// What HubSpot's site search indexed: one entry per post in the blog, case-study and resource groups.
function writeSearchIndex(paths) {
  const entries = [];
  for (const p of paths) {
    if (!/^\/(blog|case-studies|resources)\/./.test(p) || /\/page\/\d+$/.test(p)) continue;
    const raw = fs.readFileSync(path.join(CACHE, 'pages', pageSlug(p) + '.html'), 'utf8');
    const id = (raw.match(/hs-content-id-(\d+)/) || [])[1];
    const groupId = (raw.match(/content_group_id:\s*(\d+)/) || [])[1];
    if (!id) continue;
    const $ = cheerio.load(raw);
    const title = ($('meta[property="og:title"]').attr('content') || $('title').text()).trim();
    const description = ($('meta[name="description"]').attr('content') || '').trim();
    const body = $('main').clone();
    // HubSpot's search indexed the whole main area, related-post cards included (checked against its live results)
    body.find('script, style, noscript, form').remove();
    entries.push({ id, groupId, url: p, title, description, text: body.text().replace(/\s+/g, ' ').trim() });
  }
  ensureDir(path.join(SRC, 'data'));
  fs.writeFileSync(path.join(SRC, 'data', 'search-index.json'), JSON.stringify(entries));
  return entries.length;
}

// Resource downloads: HubSpot's get-file function maps a resource id to its file; the files are copied locally.
const resourceCachePath = path.join(CACHE, 'resource-files.json');
const resourceFiles = fs.existsSync(resourceCachePath) ? JSON.parse(fs.readFileSync(resourceCachePath, 'utf8')) : {};
async function collectResourceFiles(docs) {
  for (const [p, $] of docs) {
    const id = $('[data-resource-id]').attr('data-resource-id');
    if (!id || resourceFiles[id]) continue;
    const res = await fetch(ORIGIN + '/_hcms/api/get-file', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', 'user-agent': UA }, body: JSON.stringify({ resourceId: id }) });
    if (res.ok) resourceFiles[id] = { ...(await res.json()), page: p };
  }
  fs.writeFileSync(resourceCachePath, JSON.stringify(resourceFiles, null, 1));
  return Object.values(resourceFiles).map((r) => r.fileURL).filter(Boolean);
}
function writeResourceFiles() {
  const out = {};
  for (const [id, r] of Object.entries(resourceFiles)) {
    const u = toAbs(r.fileURL);
    if (u && localPaths.has(u.href)) out[id] = { fileURL: localPaths.get(u.href), filename: r.filename };
  }
  ensureDir(path.join(SRC, 'data'));
  fs.writeFileSync(path.join(SRC, 'data', 'resource-files.json'), JSON.stringify(out, null, 1));
  return Object.keys(out).length;
}

// ---------------------------------------------------------------------------------------------- sitemap and robots.txt
// The live sitemap lists every page plus the full-size originals of its images and video thumbnails; those files are
// copied too and the sitemap points at the local copies. robots.txt is copied as is.
const SITEMAP_CACHE = path.join(CACHE, 'sitemap-live.xml');
async function loadSitemap() {
  if (!fs.existsSync(SITEMAP_CACHE)) fs.writeFileSync(SITEMAP_CACHE, await (await fetch(ORIGIN + '/sitemap.xml', { headers: { 'user-agent': UA } })).text());
  const xml = fs.readFileSync(SITEMAP_CACHE, 'utf8');
  const urls = [...xml.matchAll(/<(image:loc|video:thumbnail_loc|video:content_loc)>([^<]+)</g)].map((m) => toAbs(m[2].replace(/&amp;/g, '&'))).filter(Boolean);
  return { xml, urls };
}
function writeSitemap(xml) {
  const out = xml.replace(/(<(image:loc|video:thumbnail_loc|video:content_loc)>)([^<]+)(<\/\2>)/g, (m, open, tag, raw, close) => {
    const u = toAbs(raw.replace(/&amp;/g, '&'));
    return u && localPaths.has(u.href) ? open + ORIGIN + localPaths.get(u.href) + close : m;
  });
  fs.writeFileSync(path.join(PUB, 'sitemap.xml'), out);
}
async function writeRobots() {
  fs.writeFileSync(path.join(PUB, 'robots.txt'), await (await fetch(ORIGIN + '/robots.txt', { headers: { 'user-agent': UA } })).text());
}

// ---------------------------------------------------------------------------------------------- main
const args = process.argv.slice(2);
const paths = args.length ? args : [...fs.readFileSync(path.join(ROOT, 'scripts', 'pages.txt'), 'utf8').split('\n').filter(Boolean), '/404'];

const docs = new Map();
const assetSet = new Set();
for (const p of paths) {
  const $ = await prepare(p);
  docs.set(p, $);
  collectFromDocument($, assetSet);
}
fs.writeFileSync(ctaCache, JSON.stringify(ctaTargets, null, 1));
const listings = loadListings();
const sitemap = await loadSitemap();
for (const u of sitemap.urls) if (isAsset(u) || /hubspotusercontent/.test(u.hostname)) assetSet.add(u.href);
for (const l of listings) for (const c of l.cards) for (const { abs } of findUrls(c.html, ORIGIN + '/')) if (isAsset(abs)) assetSet.add(abs.href);
for (const f of await collectResourceFiles(docs)) { const u = toAbs(f); if (u) assetSet.add(u.href); }
console.log(`pages: ${docs.size}, directly referenced assets: ${assetSet.size}`);

const all = await crawlAssets(assetSet);
// Assign local paths for everything first so CSS/JS rewriting can resolve cross references.
for (const url of all) if (manifest[url] && manifest[url].status >= 200 && manifest[url].status < 300) localPathFor(url);
const { ok, failed } = writePublic(all);
console.log(`assets written: ${ok}, failed: ${failed.length}`);
for (const [u, s] of failed) console.log('  FAILED', s, u);

console.log(`listings: ${listings.length}, search index entries: ${writeSearchIndex([...docs.keys()])}`);
const built = [...docs].map(([p, $]) => buildPage(p, $));
const names = componentNames();
for (const b of built) writePage(b, names);
emitTracking();
writeListings(listings);
writeSitemap(sitemap.xml);
await writeRobots();
console.log(`resource files: ${writeResourceFiles()}`);
fs.writeFileSync(path.join(CACHE, 'local-paths.json'), JSON.stringify(Object.fromEntries(localPaths), null, 1));
console.log('done');
