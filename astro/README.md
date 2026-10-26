# freerange.com on Astro

A one-to-one copy of freerange.com (previously HubSpot CMS) as an Astro 7 site. Every page, image, illustration,
font, stylesheet, script and animation is the live site's own, stored in this project and served by Astro.

## Run it

```sh
npm install
npm run build
npx astro preview --port 4321      # http://localhost:4321
```

`npm run dev` also works for editing. Node 22.12 or newer is required.

## What's here

| Path | Contents |
|---|---|
| `src/pages/**/*.astro` | One file per page (177 pages plus the 404 page), holding that page's own markup. |
| `src/layouts/BaseLayout.astro` | The document shell every page uses. |
| `src/components/Header.astro`, `Footer.astro` | The site header and footer, shared by every page. |
| `src/components/HubSpotWidgets.astro` | HubSpot live chat and pop-ups, loaded the same way the live site loads them. |
| `src/components/Tracking.astro` | Google Analytics, Hotjar and HubSpot tracking. Off unless `PUBLIC_ENABLE_TRACKING=true`. |
| `src/components/ListingCards.astro`, `src/lib/listings.ts` | Card rows for /blog, /case-studies and /resources (filters, tag links, "Load More"). |
| `src/lib/search.ts`, `src/pages/api/contentsearch.ts` | The listing search box. |
| `src/pages/api/get-file.ts` | Resource downloads (the nine PDFs are in `public/`). |
| `src/data/` | Listing cards, search index, resource files and redirects. |
| `public/sitemap.xml`, `public/robots.txt` | The live sitemap (image addresses point at the local copies) and robots.txt. |
| `public/` | Every image, font, stylesheet, script, PDF and audio file the pages use. |
| `scripts/` | The scripts that produced all of the above from the live site. |

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
npx astro build && npx astro preview --port 4321 &
node scripts/verify.mjs --width 1440    # also 768 and 390; --only /path,/path for a subset
```

Opens every page live and here side by side, compares every element (position, size, colours, fonts, borders,
shadows, images, text, pseudo-elements) and every screen pixel by pixel. Results land in `.mirror-cache/verify/`.
It needs `playwright-core` installed in `.mirror-cache/tools` and a local Chromium.

## Regenerating from the live site

```sh
node scripts/crawl-listings.mjs   # listing cards and tag membership
node scripts/discover.mjs         # pages and redirects not listed in the sitemap
node scripts/mirror.mjs $(cat .mirror-cache/urls-all.txt)   # pages, assets, data
```

Downloads are cached in `.mirror-cache/` (not committed).

## Size

`public/` is about 1.9 GB, mostly the Thrive podcast MP3s (about 550 MB), the archetype cards PDF (177 MB) and
HubSpot's resized image variants. GitHub rejects files over 100 MB, so commit `public/` with Git LFS or host the
largest files elsewhere.
