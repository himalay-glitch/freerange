# freerange.com on Astro

A one-to-one copy of freerange.com (previously HubSpot CMS) as an Astro 7 site. Every page, image, illustration,
font, stylesheet, script and animation is the live site's own, stored in this project and served by Astro.

## Run it

Node 22.12 or newer. Large media (PDF, MP3, MP4) is stored with Git LFS, so install it before cloning
(`brew install git-lfs`, then `git lfs install`).

```sh
npm install
npm run build
npm run preview -- --port 4321     # http://localhost:4321
```

`npm run dev` also works for editing.

## Folder structure

```
astro/
├── astro.config.mjs          Astro config: Node adapter, redirects, untouched HTML output
├── package.json              scripts and dependencies
├── public/                   every file the pages use, in the live site's own folder layout
│   ├── hubfs/  hs-fs/        HubSpot file manager images, PDFs, audio (hs-fs = resized variants)
│   ├── hs/  _hcms/           HubSpot's i18n script, form loader and Google fonts
│   ├── ext/<host>/           files the live site loaded from other hosts (HubSpot CDN, Google, cdnjs)
│   ├── blog/rss.xml …        RSS feeds
│   └── sitemap.xml  robots.txt
├── src/
│   ├── pages/                one .astro file per URL (177 pages + 404.astro), named after the URL
│   │   ├── blog/  case-studies/  resources/  jobs/
│   │   ├── api/              contentsearch.ts, get-file.ts, update-download-resources.ts
│   │   ├── meetings/[...path].ts   forwards to meetings.hubspot.com
│   │   └── favicon.ico.ts    302 to the chicken icon, as on the live site
│   ├── layouts/BaseLayout.astro
│   ├── components/           Header, Footer, HubSpotWidgets, Tracking, ListingCards
│   ├── lib/                  listings.ts (listing filters and paging), search.ts (search)
│   └── data/                 listing cards, search index, resource files, redirects
└── scripts/                  how the site was produced from freerange.com, and how it is checked
    ├── pages.txt             the 177 page URLs
    ├── data/cta-renders.json HubSpot CTA buttons as the live site renders them
    ├── lib/browser.mjs       shared headless browser
    ├── crawl-listings.mjs  discover.mjs  capture-ctas.mjs  mirror.mjs  verify.mjs
```

Page files and folders use the live URLs exactly (for example `src/pages/blog/coming-home-the-heros-journey-pt.-4.astro`
serves `/blog/coming-home-the-heros-journey-pt.-4`). Asset file names keep the live names with unsafe characters
replaced by `-`; resized variants of one image get a short suffix (`Cover-image.61d9e9f1.png`).

| Path | Contents |
|---|---|
| `src/pages/**/*.astro` | Each page's own markup and `<head>`, using the shared layout, header and footer. |
| `src/components/HubSpotWidgets.astro` | HubSpot live chat and pop-ups, loaded the same way the live site loads them. |
| `src/components/Tracking.astro` | Google Analytics, Hotjar and HubSpot tracking. Off unless `PUBLIC_ENABLE_TRACKING=true`. |
| `src/components/ListingCards.astro`, `src/lib/listings.ts` | Card rows for /blog, /case-studies and /resources. |
| `src/lib/search.ts`, `src/pages/api/contentsearch.ts` | The listing search box. |
| `src/pages/api/get-file.ts` | Resource downloads (the nine PDFs are in `public/`). |

## Where it differs from HubSpot, and why

These features ran on HubSpot's servers. They now run in this project and behave the same:

- **Listing filters, tag links, infinite scroll and paginated listings** (`/blog/page/2` onward): served by Astro for
  any `?page=`, `?tags=` or `?posts=` query, with HubSpot's rules (tags in one group combine with OR, groups with AND).
  Checked against the live site for every tag and for scroll-loading through to the last card.
- **Search**: a local index of the same content HubSpot indexed. The same posts match for 96% of test queries.
  HubSpot's exact ranking formula is not public, so the order of results can differ.
- **Resource downloads**: the files are copied into the project. The CRM note HubSpot added on download is not
  recorded (`/api/update-download-resources` only acknowledges it).
- **Old URLs** HubSpot redirected (`src/data/redirects.json`) redirect the same way. `/meetings/*` forwards to the same
  booking pages on meetings.hubspot.com.
- **HubSpot CTA buttons** are stored in their rendered form and link straight to their destination.

Still served by HubSpot, as on the live site: the forms (contact, newsletter, quiz, job and resource forms submit
to your HubSpot portal), live chat and pop-ups. The chat is set to show on freerange.com only, so it hides itself on
localhost.

Two small compatibility fixes keep behaviour identical when the files load faster than they did from HubSpot:

- **Load-event shim** (inserted after the `cash` library on each page): the theme attaches some `load` listeners a
  moment after the page is ready. These cover form set-up, the testimonial slider, header spacing and filter replay.
  Served locally the page can finish loading first, so the shim runs any listener that arrives late.
- **CMS-only settings removed**: the `formsBaseUrl` form option and HubSpot's `hsVars` page metadata pointed at
  HubSpot CMS endpoints that only exist on HubSpot hosting.

## Checking it against the live site

```sh
npx playwright-core install chromium      # once; or set CHROME_PATH to any Chrome/Chromium
npm run build && npm run preview -- --port 4321 &
npm run verify -- --width 1440            # also 768 and 390; --only /path,/path for a subset
```

Opens every page live and here side by side, compares every element (position, size, colours, fonts, borders,
shadows, images, text, pseudo-elements) and every screen pixel by pixel. Results land in `.mirror-cache/verify/`.

## Regenerating from the live site

Run these in order while freerange.com is still live:

```sh
npm run discover         # finds pages and redirects missing from scripts/pages.txt and src/data/redirects.json
npm run crawl-listings   # listing cards, tag membership and order for /blog, /case-studies, /resources
npm run capture-ctas     # CTA buttons as HubSpot renders them (needs the browser from the section above)
npm run mirror           # every page, file, listing, search index, resource file, sitemap and robots.txt
npm run build
```

Add any pages `discover` reports to `scripts/pages.txt`, and any redirects you want to keep to
`src/data/redirects.json`. Downloads are cached in `.mirror-cache/` (not committed); delete it to fetch everything
fresh.

## Size

`public/` is about 1.9 GB, mostly the Thrive podcast MP3s (about 550 MB), the archetype cards PDF (177 MB) and
HubSpot's resized image variants. PDFs, MP3s and MP4s are stored with Git LFS (see `.gitattributes`); GitHub rejects
files over 100 MB without it.
