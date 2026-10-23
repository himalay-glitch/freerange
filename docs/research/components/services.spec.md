# Services Specification (homepage, click-driven tabs)

- **Target files:** `src/components/home/Services.tsx` (`"use client"`), `src/styles/services.css`, data `src/lib/data/services.ts`
- **Screenshot:** `docs/design-references/home-04-services.png`
- **Sources:** `docs/research/html/home-services.html`, `docs/research/css/services.css` (authoritative), `docs/research/raw/home-services.json` (`base` tree + `html`)
- **Interaction model:** click-driven tabs (desktop) / `<select>` (≤1023px); slides cross-fade.

## Layout (desktop 1440, content 1216)
- `.module.our-services` > `h2.title.module-title#services` "Services" > `.services-main-description.module-description` "Streamlined services delivering exceptional results: uniquely crafted stories, industry-leading brands, and powerful software." (`margin:16px 0 45px`) > `.services`
- `.tabs { display:flex; margin-bottom:40px }` > `span { display:block; flex:100%; font:500 25px/35px; color:#4a4a4a; padding:10px; text-align:center; cursor:pointer; user-select:none; white-space:nowrap }` (each 304×57); `span.active { border-bottom:2px solid #308bf5 }`. Labels: Storytelling, Design, Workshops, Product Innovation. Hidden ≤1023px.
- `.services-dropdown { display:none; margin-bottom:45px }` → `display:block` ≤1023px (margin-bottom 0 ≤767) > `select` styled per services.css/theme (white, 2px #d1d6dc border, 43px, blue chevron background — use the `SelectChevronIcon` data as a background or inline svg).
- `.services-slider { position:relative; height:608px }` (Flickity fade) > `.services-slider-item.slide { position:absolute; inset:0; display:flex; flex:1 0 100%; min-width:100%; opacity:0; transition:opacity .5s }`; `.is-selected { opacity:1; z-index:1 }`.
  - `.description { display:flex; flex-direction:column; align-items:center; justify-content:center; width:50%; padding:40px 20px }` > `p` (19px/28px; `margin-bottom:32px`) + `a.hs-button` "Learn More" `{ margin-right:auto; margin-top:15px; padding:15px 30px; display:inline-flex }` (153×50).
  - `img { width:50%; align-self:center; margin:0 auto }` (608×608 square).
- Data (`services.ts`): four `ServiceTab`s with ORIGINAL placeholder descriptions (3–4 sentences each, not the live copy), `image:/placeholders/square-N.svg`, `cta:{ label:"Learn More", href:"/services#storytelling" | "#design" | "#workshops" | "#product-innovation" }`.

## Behaviour
- Clicking a tab sets `.active` and the matching slide `.is-selected` (fade .5s). The `<select>` mirrors the same state. Slider height = tallest slide (608 at desktop; at ≤767 compute from the active slide: image 100% width above the text).

## Responsive (port services.css exactly)
- ≤1023: tabs hidden, dropdown shown; `.description { padding-left:0 }`.
- ≤767: slides `flex-direction:column`, `.description { width:100%; padding:20px 0 }`, `.hs-button { margin-left:auto }`, `img { width:100% }`; slider height follows content (`position:relative` slides stacked with only the active one rendered).
