# Page topology — freerange.com

## Shared layout
```
body (padding-top: header height)
├─ header.site-header (FIXED overlay; z-index 1 / 2 when .fixed)
│   ├─ notification banner (48px, #308bf5)
│   ├─ .header__container (logo | nav + CTA / tagline)
│   └─ .mobile-menu-container (mobile only)
├─ main#main-content.body-container-wrapper > .container > .container-fluid.body-container > .row-fluid-wrapper > .row-fluid > .span12
│   └─ one .row-fluid-wrapper.dnd-section per module (80px vertical rhythm, 1240px content)
└─ footer.site-footer (newsletter band #425f80 + bottom band #032049)
```

## Homepage modules (top → bottom, desktop 1440; tops relative to document)
| # | Module | DOM | top | height | bg | Interaction |
|---|--------|-----|-----|--------|----|-------------|
| 0 | Header | `header.site-header` | 0 | 182 | transparent → #fff | scroll + hover (mega) |
| 1 | Hero | `.module.main-hero.full-width` | 73 (margin-top −60) | 700 | #fff | click/hover/parallax |
| 2 | Work | `.card-list-module-container.has-view-more-button` | 822 | 946 | #fff | hover |
| 3 | Approach | `.module.our-approach.full-width` (id `approach`) | 1938 | 3108 | #f0f9fd | scroll |
| 4 | Services | `.module.our-services` | 5046 | 921 | #fff | click tabs |
| 5 | spacer 80 | `.widget-type-space` | 5967 | 80 | | |
| 6 | Podcast heading | `.custom-heading` + rich text | 6047 | 85 | | static |
| 7 | Podcast cards | `.card-list-module-container` (3 cards) | 6172 | 390 | | hover |
| 8 | spacer 80 | | 6732 | 80 | | |
| 9 | Testimonials | `.module.clients-slider` | 6812 | 572 | | slider |
| 10 | spacer 80 | | 7384 | 80 | | |
| 11 | Let's talk form | `.module.lets-talk.full-width.remove-bottom-margin` | 7464 | 759 | #f2f4f7-ish | form |
| 12 | Footer | `footer.site-footer` | 8223 | 439 | #425f80 / #032049 | static |

## Site map (163 URLs, from sitemap.xml) and templates
- `/` home (custom modules above)
- Service pages (template `widget_177152991950`): /websites-software-development, /design-brand, /content-writing-video-production, /campaign-strategy-execution, /team-augmentation, /ai-for-operations
- Archetype pages (template `widget_1713269457124`): /creator, /leader, /entertainer, /guardian, /innovator, /sage; quiz hub /archetypes (dnd modules)
- /about, /contact-us, /podcast, /rd-lab, /privacy-policy, /terms-and-conditions (rich-text template)
- Listings: /blog (83 posts), /case-studies (45), /resources (9), /jobs (2)
- Detail templates: blog post, case study (two URL shapes `/case-studies/<slug>` and `/case-studies/work/<slug>`), resource, job
