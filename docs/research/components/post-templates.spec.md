# Post templates: blog post, case study, resource, job (+ shared layout)

- **Target:** `src/components/templates/PostLayout.tsx` (shared `.blog-post` frame + sticky sidebar), `BlogPostTemplate.tsx`, `CaseStudyTemplate.tsx`, `ResourceTemplate.tsx`, `JobTemplate.tsx`, `src/styles/post-templates.css`, `RelatedPosts.tsx` (section wrapper that accepts `children` so the card grid can be injected later)
- **Screenshots:** `blog-post-desktop-1440-full.png`, `casestudy-desktop-1440-full.png`, `casestudy-work-desktop-1440-full.png`, `resource-desktop-1440-full.png`, `job-desktop-1440-full.png` (+ `*-mobile-390-full.png` for each) in `docs/design-references/`
- **Sources:** `docs/research/html/blog-post-main.html`, `casestudy-main.html`, `casestudy-work-main.html`, `resource-main.html`, `job-main.html` (original DOM), `docs/research/css/post-templates.css` (all theme rules for these templates incl. breakpoints), `docs/research/css/blog.css`, `docs/research/css/project.css`, `docs/research/css/resource-job.css`, computed probes in `docs/research/raw/blog-post-modules.json` (`probes`), `casestudy-modules.json`, `resource-modules.json`, `job-modules.json`
- **Interaction model:** static; sticky sidebar on scroll (`position:sticky; top:110px` when `body.navbar-fixed-visible`, per CSS); case-study side navigation is anchor links with active state via IntersectionObserver.

## Shared frame (desktop 1440)
`main > .body-container.body-container--blog-post.body-container--custom-post-template.body-container--<variant> > .content-wrapper > article.blog-post.<variant>` (1216 wide, starts at y 182 i.e. straight under the header, no top spacer) →
- `.custom-post-template-featured-image.<variant>-featured-image` — 1216×398 at y 222 (margin-top 40px), `img` object-fit cover (placeholder `/placeholders/card-1.svg`).
- `.blog-post__body.<variant>__body.row` — `display:flex`, margin-top 60px: `.custom-post-template-sidebar.<variant>-sidebar` (width 405px, background #f0f9fd, `position:sticky`) + `.custom-post-template-body.<variant>-body` (width 781px, starts at x 547 → 30px gap).
- Body typography: `p` 19px/28px 500 #4a4a4a letter-spacing -.5px margin 0 0 32px; `h2` 40px/1.2 600; `h3` 32px/41.6px 600 #2f2f34 margin 0 0 32px; `a` #308bf5; `ul/ol` per theme; `img` max-width 100%; `blockquote` italic.
- `.blog-related-posts` (full width, background #fff, padding 80px 0) > `.content-wrapper.container` > `h2.title` ("Related Posts" / "Related Projects") + `.blog-related-posts__list` (render `children`; the card grid component is supplied by the page).

## Variants
### Blog post (`default-blog-post`)
Sidebar: `.custom-post-template-title` block (background #425f80, padding 30px, `h1` 25px/30px 700 #fff) → `.autor-and-date` (`span.author` 16px 700, `span.date` 16px; padding 20px 30px) → `.custom-post-template-info` with "Share" label + four 24px circular outlined blue share icons. Body: optional italic intro `p`, then rich text. Related: 4 post cards.
### Case study (`case-study-post`)
Featured image carries `.case-study-post-logo` (white logo, top-left inset 32px, max-height 70px). Sidebar: `h1.case-study-title` (25px 700 white on #425f80 band) → `.case-study-info` rows (label | values): Services, Industries, Causes, Share (icons) — label column 90px with a 1px #308bf5 right rule, 16px text → `ul.case-study-navigation` links: "Overview", "1. Understand", "2. Explore", "3. Create", "4. Launch" (16px, padding 10px 30px, active = #308bf5). Body: `h2.title` "Overview" (orange underline) → `h1`-style headline 40px/48px 600 → paragraphs → numbered section headings `h3` with orange Colfax number + label and a 1px rule (`[data-number]`), images. Related: "Related Projects" 4 case-study cards. The `/case-studies/work/<slug>` variant is identical with a shorter body.
### Resource (`resource-post`)
Featured image shows the title centred as `h1` white on orange highlight (40px 600, padding 5px 15px). Body width ≈ 670px; sidebar is on the RIGHT: `.resource-post-sidebar` (width 320px, background #f0f9fd, padding 20px, margin-top -50px so it overlaps the banner, `position:sticky`) with `h3.form-title` (centred 25px 700, orange underline) and a form: First name / Last name (2 cols), Phone number, Email*, consent checkbox "I agree to receive other communications from Free Range", `input[type=submit]` "Download" (blue, full width). Submit stub shows "Thanks — check your inbox." Related: 4 post cards.
### Job (`job-post`)
No featured image. `h1.job-post-title` as orange highlight (40px 600 white, padding 5px 15px, margin 72px 0 30px) → `.blog-post__body` full width 1216 rich text (`h3` 24px/32px 400 #308bf5 section labels, nested `ul`) → `.job-form` (700px centred, margin 40px auto) with `h3.form-title` "Apply" (orange underline) + a stub form (Name, Email, Message, Submit).

## Props
Each template takes `{ entry: ContentEntry; bodyHtml: string | null; related?: ReactNode; sidebar?: {...} }` from `src/lib/content.ts`. When `bodyHtml` is null render a placeholder body (two paragraphs of neutral placeholder text + "Body content pending import" note) inside `.custom-post-template-body` using `dangerouslySetInnerHTML` only for owner-supplied HTML.

## Responsive (port the CSS exactly)
≤999: sidebar and body stack (sidebar first, full width, not sticky); resource sidebar moves below body; ≤767: featured image height auto (16:9), paddings 16px.
