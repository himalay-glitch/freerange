# Service page template (6 pages: /websites-software-development, /design-brand, /content-writing-video-production, /campaign-strategy-execution, /team-augmentation, /ai-for-operations)

- **Target:** `src/components/templates/ServicePage.tsx` (+ client `FaqAccordion.tsx`), `src/styles/service-page.css`, data `src/lib/data/services-pages.ts`
- **Screenshots:** `docs/design-references/service-desktop-1440-full.png`, `service-mobile-390-full.png`
- **Sources:** `docs/research/html/service-main.html` (full original main DOM of /websites-software-development), `docs/research/html/service-subservices.html`, `docs/research/css/service-page.css` (theme rules for the subservice cards, FAQ accordion, page header, decorator), `docs/research/css/service-inline.css` (page-level inline rules: row paddings, `#hs_cos_wrapper_widget_1771529919502 { padding: 0 120px; text-align:center }`, cell paddings/alignment, background layers of the CTA band), `docs/research/raw/service-modules.json` (section rects at 1440)
- **Interaction model:** click (FAQ accordion)

## Sections (desktop 1440; content width 1216 inside `.container`)
1. **Page header** (top 262, h 290): `.page-header` centred — `h1` title (Work Sans 600, ~40px/48px, #2f2f34), intro `p` (19px/28px, padding 0 120px), `a.hs-button` "Book A Consultation" → `/contact-us`. Inline rules give the exact paddings (`.dnd_area-row-0-padding`).
2. **Subservices grid** (top 672, h 535): `.subservices-grid` of three `.subservice-card` (white; radius 8px; `box-shadow:0 2px 12px rgba(0,0,0,.08)`; padding 24px; gap 24px): `.card-icon-wrapper` (48×48, background #425f80, radius 8px, white 20px icon), `h3.card-title` (~26px 600), `p.card-description` (19px/28px), `ul.sub-list > li.sub-list-item` (`span.blue-dot-icon` + `span.item-text` italic 16px/24px). Exact values in service-page.css.
3. **R&D Lab split** (top 1267, h 493): row with `span5` `.subservices-grid` single card ("R&D Lab", 5 list items) and `span7` `.secondary-header`: `h2` "Explore the Free Range <strong>R&D Lab</strong>" (strong = orange highlight), two paragraphs, `a.hs-button` "Learn More" → `/rd-lab`.
4. **FAQ** (top 1760, h 738): `.faq-split-container` (flex) — `.faq-intro-column` (left, ~33%) with `h2.faq-main-title` "Frequently Asked Questions" (40px 600) and optional `p.faq-description`; `.faq-accordion-column` (right, ~62%) with six `.accordion-item` (`button.accordion-header` → `span.question-text` 24px/32px 400 #2f2f34 + `span.icon` "+" (rotates/changes to "–" when open), `.accordion-content > .content-inner` with the answer `p` (19px/28px), `max-height` transition .3s; items separated by 1px solid #d9d9d9; header padding 20px 0).
5. **CTA band** (top 2498, h 374, full width): `.dnd_area-row-5-background-layers` background (light blue — value in service-inline.css) → centred `h2` "Let’s Talk About Your Project" (40px 600), `p`, `a.hs-button` "Book a Consultation" → `/contact-us`.
6. Footer follows (shared).

## Data (placeholders — do not copy the live copy)
`services-pages.ts`: one record per service path with `title` (use the real page titles — they are navigational: "Websites & Software Development", "Design & Brand Identity", "Content Writing & Video Production", "Campaign Strategy & Execution", "Team Augmentation", "AI for Operations"), a 2-sentence placeholder intro, three sub-service cards (title + 1-line description + 5–8 placeholder list items), one R&D card, six FAQ items (placeholder Q/A), CTA copy. Icons: inline SVGs you draw (window/screens/gear/bulb style) or `/placeholders/icon-*.svg`.

## Responsive (port service-page.css + service-inline.css exactly)
- ≤1023: cards 2-up then 1-up; FAQ stacks (intro above accordion); ≤767: header padding 0; all single column; CTA band padding reduced.
