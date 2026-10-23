# Footer Specification

## Overview
- **Target files:** `src/components/site/Footer.tsx` + `src/styles/footer.css`
- **Screenshot:** `docs/design-references/footer.png` (desktop 1440), `docs/design-references/home-mobile-390-full.png` (bottom)
- **Source of truth:** `docs/research/html/footer.html`, `docs/research/css/footer.css`, `docs/research/theme/social-follow.css`, computed tree `docs/research/raw/footer.json`
- **Interaction model:** static (hover states on links/buttons; newsletter form has a submit stub)
- **Data:** `SOCIAL_LINKS`, `LOGO_WHITE`, `SITE_NAME`, `B_CORP_BADGE`, `COPYRIGHT`, `HEADER_CTA` from `src/lib/site.ts`

## DOM structure
```
footer.footer.site-footer (background:#f8fafc)
└─ div.footer__container
   ├─ div.footer-top (background:#425f80; padding:70px 0; display:flex; flex-direction:column; justify-content:center; height 248px)
   │   └─ div.container (1240) > div.widget-type-form
   │        h3.form-title "New Ideas, Delivered To Your Inbox" (color:#fff; font:700 26px/36px Work Sans; text-align:center; margin:0 0 32px)
   │        form.hs-form (centered row: input[type=email placeholder="mail@domain.com"] 390×40 white, border 1px #d1d6dc, padding 0 16px, font 16px; + button "SUBSCRIBE" 150×40 background:#308bf5 color:#fff font:600 14px uppercase letter-spacing .5px; gap 10px) — exact rules in footer.css under `#hs_cos_wrapper_footer_subscribe_form` / `.footer-top form`
   └─ div.footer-bottom (background:#032049; padding:40px 0; display:flex; flex-direction:column; justify-content:center; height ≈191px)
       ├─ div.container (display:flex)
       │    div.footer-logo (display:flex; align-items:center; width ≈352px)
       │       img (white mark, 73×67 natural 124×114) ; a.site-name (padding-left:12px) > span "FREE RANGE" (Colfax 700 28px, letter-spacing 4px, color:#fff, margin-top:7px)
       │    div.footer-info (margin-left:auto; width ≈169px) > div.footer-info-top (display:flex)
       │       div (display:flex; flex-direction:column; margin-right:25px) → a.hs-button "Contact Us" (blue, 35px tall, padding 5px 20px) then div.social-row (display:flex; gap:≈14px; margin-top:12px) 4 svg icons 18px tall, fill #fff, hover fill #308bf5
       │       div.certifications → img badge 39×60 (placeholder `/placeholders/badge.svg`)
       └─ div.container (display:flex) > div.footer__copyright (margin:20px 0 0 auto; text-align:right; font: 200 16px/24px Work Sans; letter-spacing:.4px; color:#fff) "© 2026 Free Range" (use `COPYRIGHT`)
```

## Responsive
- <768: both bands centre their content; logo row stacks above the info block; social icons centred; copyright centred; newsletter input full width with the button below (footer.css `@media (max-width:47.9375em)` rules are authoritative).

## Behaviors
- `.hs-button` hover as in global CSS. Social `a:hover svg { fill:#308bf5 }` (social-follow.css).
- Newsletter submit: prevent default, show "Thanks for subscribing!" in place of the form (`.submitted-message`, color #fff).
