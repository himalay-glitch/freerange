# Simple page templates: About, Jobs listing, Legal (rich text)

- **Target:** `src/components/templates/AboutPage.tsx` (+ `TeamGrid.tsx`), `JobsListingPage.tsx`, `LegalPage.tsx`, `src/styles/about.css`, `src/styles/jobs.css`, data `src/lib/data/team.ts`, `src/lib/data/jobs.ts`
- **Screenshots:** `about-desktop-1440-full.png`, `about-mobile-390-full.png`, `jobs-listing-desktop-1440-full.png`, `jobs-listing-mobile-390-full.png`, `privacy-desktop-1440-full.png`
- **Sources:** `docs/research/html/about-main.html`, `about-team.html`, `jobs-listing-main.html`, `privacy-main.html` (structure only), `docs/research/css/about.css`, `docs/research/css/jobs.css`, `docs/research/css/listing.css` (`.blog-hero-module`, `.blog-header`), `docs/research/raw/about-modules.json`, `jobs-listing-modules.json`, `privacy-modules.json`
- **Interaction model:** hover (team member overlay)

## About (desktop 1440, container 1216)
1. `.horizontal-space` 60px (y 182→242).
2. Headline rich text (y 242, h 144): `h2` 40px/48px 600 #2f2f34 with the first line wrapped in `<strong>` (orange highlight) — placeholder copy "Helping mission-driven organizations promote social good." may be used (short UI copy).
3. `.module.half-video-half-wysiwyg.invert` (y 418, h 316): `.module-content` flex — `.wysiwyg-content` (left, width ≈585px; three `p` 19px/28px) + `.video-content` (right, 592×296 at x 740) containing `.oembed` 16:9 thumbnail with a centred play button (use `/placeholders/card-5.svg` and a white circle/triangle play glyph; clicking opens nothing). about.css has the exact flex/padding.
4. `.horizontal-space` 20px.
5. `h2.custom-heading` "Our Team" styled like `.title` (25px 700, orange underline; y 786, h 48).
6. `.team-members-container > .team-grid` (y 874, h 1264): 4 columns × 3 rows of `.team-member` — oval portrait (`img` width ≈ 240, height ≈ 340, `border-radius:50%`, object-fit cover) with `.overlay` (absolute, same oval, rgba dark, opacity 0 → 1 on hover, .3s) holding `h3` name (20px 700 white) and `p` role (16px white). Use `/placeholders/headshot-1..7.svg` (repeat) and generic names ("Team Member One") and roles.
7. Rich text (y 2137, h 267, centred): `h2` "Want to join our team?" (orange highlight span, 40px), `p` 19px/28px (placeholder sentence), `a.hs-button` "Browse Job Openings" → `/jobs` (blue, 15px 30px).

## Jobs listing (desktop 1440)
`.body-container--blog-index.body-container--custom-blog-index.jobs` → `.blog-header > .blog-header__inner.container` (y 182, h 1151) > `.blog-hero-module.hero-no-animation`: `h2` 40px/60px 600 headline whose last two words are an orange highlight `<span>` (placeholder: "We want diverse perspectives that help us create work that <span>changes lives</span>"), then rich text: `p`, a `ul` of four values each `<strong>Label</strong><br>sentence` (placeholders), closing `p`. Then `.content-wrapper > .blog-index` (y 1333): `h2.title` "Available Jobs" → `.job-card` × N (background #f0f9fd, padding 30px, margin-bottom 30px): `h3.job-title` 20px/28px 700, skills row of chips (`span` 12px #308bf5, border 1px solid #308bf5, radius 2px, padding 2px 6px, margin 0 6px 6px 0), `p` 19px/28px, `a.hs-button` "Apply to this job" → `/jobs/<slug>`. Data: two placeholder jobs ("Project Manager", "Designer") with placeholder skills.

## Legal / rich-text page
`LegalPage`: `.horizontal-space` 20px → `.container` rich text (`h2` 25px 700 uppercase first heading, `p` 19px/28px, `ul` 18px/24px margin 0 0 24px 24px) → `.horizontal-space` 60px. Takes `{ title, bodyHtml }`; renders owner-supplied HTML or a placeholder (title + two neutral paragraphs + "Body content pending import").

## Responsive (port about.css / jobs.css exactly)
About: video/text stack ≤999 (video first per `.invert` rules), team grid 2 columns ≤999 and 1–2 columns ≤767 (check CSS). Jobs: headline 28px ≤767; job-card padding 20px.
