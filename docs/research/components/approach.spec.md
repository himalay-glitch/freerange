# Approach Specification (homepage, scroll-driven)

- **Target files:** `src/components/home/Approach.tsx` (`"use client"`), `src/styles/approach.css`, data `src/lib/data/approach-steps.ts`
- **Screenshot:** `docs/design-references/home-03-approach.png` (1440; the white header band mid-image is the fixed header captured during the full-height shot — ignore it)
- **Sources:** `docs/research/html/home-approach.html`, `docs/research/css/approach.css` (authoritative; selectors prefixed `.dnd-section[...]>.our-approach.row-fluid>.dnd-column[data-w="12"]` or `.our-approach>.container` — keep the latter branch), `docs/research/raw/home-approach.json`
- **Interaction model:** scroll-driven — a sticky canvas on the left scrubs an animation as the section scrolls; four steps alternate left/right on the right column.

## Layout (desktop 1440)
- `.module.our-approach.full-width { position:relative; background:#f0f9fd; padding-top:60px; width:100vw; left:50%; margin-left:-50vw }` (rendered 3108px tall). `.background` (absolute, full size) with `.background-image` (no image configured on the live site → render nothing) and `.background-color { background:#cbe8f9; opacity:0 }` — keep the markup, no visible effect.
- `.container (1240)` > `h2.title.module-title#approach` "Approach" (global `.title[id]:before` adds the 60px anchor offset) > `.our-approach-description.module-description.wysiwyg-content` "A proven four-step process empowers us to understand your audience, brand, and business goals to create a plan for success." (`margin:16px 0 45px`) > `.our-approach-content { position:relative }` (2912px tall).
- `.our-approach-animation { position:sticky; top:≈227px (= (innerHeight − canvasHeight)/2, set in JS on mount/resize); float:left; width:732.6px; height:445.8px; z-index:1; margin:-175px 0 80px -221.6px }` (it hangs 110px left of the container edge) > `.inner-container { position:relative; width:100%; padding-bottom:60.86% }` > `canvas { position:absolute; inset:0; width:100%; height:100% }`. Exact widths/margins per breakpoint are in approach.css (`margin-left:calc(-50vw + 570px - 10%)` etc.).
- `.steps { width:680px; margin-left:auto }` (x 648→1328) > `.step { display:flex; flex-direction:column; min-height:350px; margin-bottom:300px }` (last has margin-bottom per CSS) >
  - `h3[data-number]` `{ font:500 29px/40px; color:#ff4e00; margin:0 0 16px; text-align:right }`; steps 1 and 3 carry `.text-start` → `text-align:left`. `::before { content:attr(data-number); display:block; height:130px; font-family:var(--font-colfax); font-weight:700; font-size:≈120px; line-height:130px; color:#ff4e00 }` — take the exact size from approach.css (`.step h3:before`).
  - `.description p { margin:0 0 32px; font:500 19px/28px; letter-spacing:-.5px }`
  - `.tags` > `span.tag { display:inline-block; position:relative; font:italic 400 18px/24px; color:#4a4a4a; padding:5px 8px 5px 15px; margin:0 5px 10px 0 }` with `::before { content:""; position:absolute; left:0; top:11px; width:12px; height:12px; background:url(<12px blue dot svg data-uri from approach.css>) }` — port the data URI.
- Step content (titles/tags are short labels, keep; write ORIGINAL placeholder descriptions of 2–3 sentences each — do not copy the live paragraphs):
  1. Understand — tags: Discovery & Research, User Stories, Creative Direction, Product Roadmap, Workshops, Focus Groups, Brand Strategy
  2. Explore — tags: Moodboards, Concepts, Information Architecture, Ideation, Design Thinking
  3. Create — tags: Prototype, Minimum Viable Product, Development, Brand Identity, Video Production, Animation, Illustrations, Graphic Design, Package Design, UX/UI Design, Event Design, Display Design, Copywriting, Scripts
  4. Launch — tags: Go-to-Market, Analytics, Strategy, Product Sprints, Planning

## Behaviour (port of the theme JS)
- Sticky canvas: on scroll compute `progress = (scrollY − sectionTop) / (sectionHeight − innerHeight/1.5)`, clamped 0–1; the original scrubs a 193-frame PNG sequence (`frame = min(count−1, ceil(progress*count))`). Do NOT fetch those frames. Instead draw `/placeholders/chick.svg` (732×445) on the canvas and derive a walk from `progress`: translate it horizontally across ~25% of the canvas width, add a 6px vertical bob (`sin(progress*40)`) and a ±4° tilt. Redraw on scroll via rAF; handle devicePixelRatio; resize with ResizeObserver.
- `top` of the sticky block = `(window.innerHeight − canvas.clientHeight) / 2` (recomputed on resize). Body class `navbar-fixed-visible` nudges it (`top:80px` ≤999px, `66px` ≤767px) per approach.css.

## Responsive (port approach.css exactly)
- ≤1439 / ≤1279: animation margin-left/width calc rules; `.steps { max-width:500px }` ≤1279; `max-width:calc(100% − 435px)` ≤1023.
- ≤999: animation becomes a centred non-sticky block (`position:relative; float:none; display:flex; justify-content:center; width:100%; padding-bottom:40px; margin:0 0 60px -1.5rem; background:linear-gradient(180deg,#f0f9fd,#f0f9fd 85%,rgba(240,249,253,.6) 97.5%,rgba(240,249,253,0))`), `.steps { max-width:100% }`, `.our-approach-content { padding-top:0 }`.
- ≤767: `.steps { padding-bottom:10px }`; step headings smaller per CSS.
