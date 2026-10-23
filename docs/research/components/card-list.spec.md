# CardList Specification (Work grid + Podcast cards; reused by listings)

## Overview
- **Target files:** `src/components/cards/CardList.tsx` (client — hover expand), `src/components/cards/CaseStudyCardItem.tsx`, `src/components/cards/PostCardItem.tsx`, `src/styles/card-list.css`, demo data `src/lib/data/work-cards.ts` + `src/lib/data/podcast-cards.ts`, section wrappers `src/components/home/WorkSection.tsx` and `src/components/home/PodcastSection.tsx`
- **Screenshots:** `docs/design-references/home-02-work.png` (default), `home-02-work-hover.png` (first card hovered → expanded, siblings collapsed), `home-05-podcast.png`
- **Source of truth:** `docs/research/html/home-work.html`, `docs/research/html/home-podcast.html`, `docs/research/html/home-podcast-heading.html`, `docs/research/css/card-list.css` (authoritative, incl. breakpoints), computed trees `docs/research/raw/home-work.json`, `home-work-hover.json` (hover state), `home-podcast.json`
- **Interaction model:** hover-driven (desktop ≥1000px): hovered card expands, siblings in the same row collapse

## Module wrapper
- `.module.card-list-module-container.has-view-more-button { position:relative; margin-bottom:170px }` (room for the absolutely positioned view-more row).
- `h2.title.module-title` "Work" (global `.title` rule: 25px/35px 700 #4a4a4a, 2px #ff4e00 underline, pb 10, mb 40).
- `.card-list-description.module-description.wysiwyg-content { margin:16px 0 45px; font:500 19px/28px; letter-spacing:-.5px }` — inline `<span>` highlights: `background:#ff5201; color:#fff` (rule in card-list.css). Text (keep, short UI copy): "Our partners are transforming <span>health</span>, <span>education</span>, and <span>climate resilience</span> with stories and technology that drive impactful missions."
- `.filters-and-cards-wrapper > .card-list-container > .no-results-container (hidden) + .card-list[data-items][.items-per-row-3|.items-per-row-4]` — one `.card-list` per row, `display:flex`, rows separated by `margin-bottom:30px`.
- `.view-more { position:absolute; top:100%; width:100%; margin-top:40px; text-align:center }` > `a.hs-button` "See All Case Studies" → `/case-studies` (`display:inline-block; padding:15px 30px; height:50px; width ≈226px`).

## Card geometry (desktop 1440, content width 1216)
- `.card-list-item { position:relative; display:flex; flex-direction:column; overflow:hidden; height:390px; flex:0 1 calc(25% - 22.5px) (=281.5px); max-width:calc(75% - 7.5px); transition: max-width .6s, flex .6s }`; every item but the first in a row has `margin-left:30px`. Wide card: `flex:0 1 calc(50% - 15px)` (=593px) — in the Work grid the 3rd card of row 1 is wide; in Podcast the 3rd of its single row is wide.
- **Hover (expanded):** hovered item gets `.expanded` → `flex:0 0 100%` (capped by max-width → 904.5px); siblings get `.collapsed` → they shrink to 125.75px each (their flex-basis stays but `flex-shrink:1`); list gets `.has-item-expanded`. The theme applies `.expanded` after a 300ms hover delay and clears all on `mouseleave` of the list. Disabled below 1000px (xsmall/small).
- Inside each item: `a.card-list-item-link { display:block; height:100%; transition:.3s }` > `img.card-bg { width:100%; height:390px; object-fit:cover; display:block }` + `.collapsed-info { position:absolute; inset:0; background:rgba(0,0,0,.6); display:flex; flex-direction:column; align-items:flex-start }`, and a sibling `.card-list-item-expanded-info.expanded-info { position:absolute; inset:0; padding:32px; display:flex; flex-direction:column; color:#fff; font:500 16px/24px; opacity:0; transition:.5s }` → `opacity:1` when `.expanded`.

### Case-study variant (Work)
- `.collapsed-info { padding:32px; justify-content:flex-start }` > `.logo { height:70px; display:flex; transition:.2s }` > `img { height:70px; max-width:100%; object-fit:contain }` ; `p.category.impact-statement { margin-top:auto (208px at rest); font:400 16px/24px; color:#fff; text-align:center; padding-right:15px; transition:.2s }` → both fade to `opacity:0` when `.expanded`.
- Expanded info: `img` (logo, 70px tall) → `p` (title; `font:500 19px/28px; letter-spacing:-.5px; margin:10px 0 32px`) → `.description { margin-top:auto; opacity:0; transition:opacity .5s }` (`.show` → 1) > `div { padding-bottom:15px } > p.summary { font:500 16px/24px; margin:0 }` + `a` "View Case Study" (`display:inline-block; background:#fff; color:#000; font:500 14px/16px; padding:10px 12px`).

### Blog-post variant (Podcast; also used by /blog and /resources listings)
- `.card-list-item.blog-post-card .collapsed-info { padding:20px; justify-content:flex-end }` > `h2.title { font:700 20px/28px; color:#fff; margin:0 0 10px; padding:0 0 10px; position:relative; overflow:hidden; text-overflow:ellipsis; border:none }` with `::before { content:""; position:absolute; left:0; bottom:0; width:100%; height:1px; background:#fff }` ; `p.category { font:400 16px/24px; color:#fff; text-align:center; padding-right:15px }` listing the tags joined by ", ".
- Expanded info: `p` (tag links, 16px white, `margin:10px 0 32px`) → `.description` > `div { border-bottom:1px solid #fff; padding-bottom:12px; margin-bottom:15px }` > `a` (title link `color:#308bf5; font:500 16px/24px`) + `p.summary` → `a` "View Post" (white 14px button) ; `.social-share { position:absolute; right:32px; bottom:32px; display:flex; align-items:center }` > `span` "Share" (`font:italic 400 16px/24px; margin-right:10px`) + four 24px share icons (use the icons from `src/components/icons.tsx` at 24px, white) — links can be `#`.
- Podcast section heading block (separate module above the cards, `docs/research/html/home-podcast-heading.html`): `h2.custom-heading.h2.title` "The Free Ranger Podcast" rendered with the global `.title` style (25px/35px 700, orange underline) followed by a rich-text `p` "Telling the stories that matter." (`margin:1rem 0 45px`). The cards row has `margin-top:40px` and a view-more button "Browse All Episodes" → `/resources`.

## Data (placeholders — design clone; do NOT copy real case studies, logos or photos)
- `work-cards.ts`: 7 `CaseStudyCard` items (row 1: three cards, third `wide:true`; row 2: four cards) using `image:/placeholders/card-N.svg`, `logo:/placeholders/client-logo-N.svg`, generic titles ("Positioning a Mission-Driven Brand", "Scaling a Ride-Hailing Startup", …) and one-sentence summaries. `href:/case-studies/sample-N`.
- `podcast-cards.ts`: 3 `PostCard` items (third `wide:true`) with `/placeholders/card-N.svg`, generic episode titles, `tags:["The Free Ranger Podcast","Podcast"]`, `href:/blog/sample-episode-N`.

## Responsive (port card-list.css exactly)
- ≤999px: hover-expand disabled; cards keep their row flex until 767.
- ≤767px: each `.card-list` wraps (`flex-wrap:wrap`); every card `flex:1 1 100%; margin-left:0; margin-bottom:30px`; wide cards same as others; `.collapsed-info` paddings per CSS; view-more button full-width centred.

## Props
`<CardList rows={CaseStudyCard[][] | PostCard[][]} variant="case-study" | "post" viewMore={{label, href}} />` plus `WorkSection` (title, description with highlights, rows, view more) and `PodcastSection` (heading block + cards + view more).
