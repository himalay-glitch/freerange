# Free Range — design clone

A pixel-accurate Next.js 16 rebuild of the page templates, layout, typography and interactions of
freerange.com (a HubSpot CMS site), built from browser-extracted computed styles and the site's own
theme CSS/JS. Every one of the 163 URLs in the original sitemap is routed and prerendered.

## What is and isn't reproduced

- **Reproduced:** the design system (fonts, colours, spacing, breakpoints), every page template
  (home, services, about, contact, podcast, R&D lab, archetype quiz/results, legal, blog / case-study
  / resource / job listings and detail pages), and the behaviours (fixed hide-on-scroll header, mega
  menu, mobile menu, canvas morphing hero, scroll-scrubbed approach animation, tabs, sliders,
  hover-expanding card grids, filters, forms).
- **Not reproduced (by design):** the site owner's copyrighted content and assets — article and
  case-study bodies, client logos, testimonial photos and quotes, the brand's illustrations and
  logo. The build ships original placeholder art (`public/placeholders/`) and placeholder copy;
  short UI strings (nav labels, section titles, button labels) are kept so templates read correctly.
  Drop licensed content into `content/` (see `content/README.md`) and replace the placeholders.

## Layout of the repo

- `src/app/(site)/` — pages with the standard header/footer chrome; `[...slug]` renders every
  indexed URL with the template chosen in `src/lib/content.ts`.
- `src/app/(bare)/` — chrome-less pages (archetype quiz and results).
- `src/components/site/` header, footer, page shell · `home/` homepage sections · `cards/` card
  grids · `templates/` inner page templates.
- `src/styles/` — one stylesheet per module, ported rule-for-rule from the original theme CSS
  (`theme-base.css` holds the global base).
- `content/index.json` — navigational index of the 163 URLs (title, description, tags, dates).
- `docs/research/` — extraction artifacts: per-module original CSS/HTML, computed-style trees,
  behaviour notes (`BEHAVIORS.md`), topology (`PAGE_TOPOLOGY.md`) and component specs
  (`components/*.spec.md`). `docs/design-references/` holds reference screenshots; `qa/` the clone's.

## Commands

```
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

`/preview/*` routes render individual components in isolation (useful while refining a module).
