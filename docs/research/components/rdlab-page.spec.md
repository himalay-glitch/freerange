# R&D Lab page (/rd-lab)

- **Target:** `src/components/templates/RdLabPage.tsx` (+ client `LogoCarousel.tsx`, `CtaCardList.tsx`), `src/styles/rdlab.css`, data `src/lib/data/rdlab.ts`
- **Screenshots:** `docs/design-references/rdlab-desktop-1440-full.png`, `rdlab-mobile-390-full.png`
- **Sources:** `docs/research/html/rdlab-main.html` (original DOM), `docs/research/css/rdlab.css` (`.logo-carousel`, `.cta-card-list`, `.hubstrap-*`, `.custom-heading`), `docs/research/css/rdlab-inline.css` (page-level inline rules: hero row background/padding, column widths, CTA band background), `docs/research/raw/rdlab-modules.json` (section rects at 1440), `docs/research/theme/theme-main.js` (`ctaCardList` plugin for the hover behaviour)
- **Interaction model:** time-driven (two auto-scrolling logo marquees, opposite directions) + hover (CTA cards expand/collapse)

## Sections (desktop 1440; container 1216; y from the live page)
1. **Hero banner** (y 198, h 235, inset to 1192 wide at x 124): background photo (`/placeholders/card-5.svg`, cover, dark overlay) with `h1` "R&D Lab" (white, 40px/48px 600) inside `.hubstrap-col.span8` with ≈40px padding.
2. Rich text (y 465, h 115, right-aligned): `h2` 28px/36px 600 — two lines, second line an orange `<span>` highlight (placeholder copy of the same shape).
3. **Tech Stack** (y 612): `h2.custom-heading.h2.title` "Tech Stack" (rdlab.css `.custom-heading` rules; appears orange text with a dark 2px underline) → `.module.logo-carousel` (h 156) scrolling left-to-right → 40px spacer → second `.logo-carousel` scrolling right-to-left (h 156) → 40px spacer. Each carousel: 16 slides 156×156 (`.slide-item > .slide-content > img`, logo ≈59px tall centred). Implement with a duplicated track + CSS keyframe `translateX(0 → -50%)` (≈40s linear infinite; `animation-direction: reverse` for the second), pause on hover. Logos: generate 16 original simple "tech badge" SVGs (rounded squares with 2-letter labels) — not the live logos.
4. **In-House Products** (y 1073): `h2.custom-heading` "In-House Products" → `.cta-card-list.items-3` (y 1142, h 212): three `.cta-card-list-item` (flex; each ≈384×212; `img` cover + dark overlay; `.card-content > h4.card-title` white 16px/24px 700 centred with a "+" below; `.card-expanded-content` hidden until `.expanded`: title, `p.description` 16px, `a.cta` link). Hover (≥1000px, 300ms delay): hovered item `.expanded` (flex-grow), siblings `.collapsed`; list gets `.has-item-expanded`; mouseleave resets. Port exact rules from rdlab.css. Data: three placeholder products with `/placeholders/card-6/7/8.svg`.
5. **Featured Case Studies** (y 1426): `h2.custom-heading` "Featured Case Studies" → rich-text `h3` 28px/32px 600 with a blue (#308bf5) span on the last words → `featured` slot (`ReactNode` prop; the page injects a 3-card CardList) → centred `a.hs-button` "View More Product Case Studies" → `/case-studies`.
6. **Industrial Design** (y 2129): `h2.custom-heading` "Industrial Design" → `.module-content` two columns (y 2198, h 611): left image (`/placeholders/card-2.svg`, ≈560×560), right: partner wordmark as `h2` 40px/48px 700 with a red period, `h3` "Need more than software?" (28px 600), two `p` 19px/28px with a blue link.
7. **CTA band** (y 2861, h 204, full width, background #f0f9fd): centred `h3` 28px/36px 600 + `a.hs-button` "Get a Free Consultation" → `/contact-us`.

## Responsive (port rdlab.css + rdlab-inline.css)
≤999: cta cards stack (no hover expand), industrial design stacks (image above), hero height auto; ≤767: carousel slides 100px.
