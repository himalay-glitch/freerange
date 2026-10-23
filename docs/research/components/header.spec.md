# Header Specification

## Overview
- **Target files:** `src/components/site/Header.tsx` (client component) + `src/styles/header.css` (global, imported by the component file)
- **Screenshots:** `docs/design-references/home-01-hero.png` (top state, cropped), `docs/design-references/header-megamenu-open.png` (mega menu open), `docs/design-references/home-mobile-390-full.png` (mobile top), `docs/design-references/home-03-approach.png` (shows the `.fixed` white state at the middle of the image)
- **Source of truth:** `docs/research/html/header.html` (exact DOM), `docs/research/css/header.css` (every rule, incl. breakpoints), `docs/research/theme/notification-banner.css`, computed values in `docs/research/raw/header-scroll0.json`, `header-scroll-states.json`, `header-megamenu-open.json`
- **Interaction model:** scroll-driven (fixed/hide/show) + hover (mega menu, links) + click (mobile hamburger)
- **Data:** `NAV_ITEMS`, `HEADER_CTA`, `HEADER_TAGLINE`, `NOTIFICATION_BANNER`, `SOCIAL_LINKS`, `LOGO_ORANGE`, `SITE_NAME` from `src/lib/site.ts`. Logo image is a placeholder slot (`/placeholders/logo-mark.svg`).

## DOM structure (keep these class names; port the CSS verbatim)
```
header.header.site-header[.fixed][.menu-visible] (position:fixed)
├─ div.notification-banner > div.notification-banner__content.container
│    p.notification-banner__message "Want to improve your brand story?"  a[target=_blank] > u "Take the Brand Archetype Quiz" + " →"
├─ div.header__container.content-wrapper.container.d-flex
│   ├─ div.header__logo.header__logo--main
│   │    a > img (60px wide, 45px <768) ; a.site-name > span "FREE RANGE"
│   └─ div.header__column.ml-auto
│       ├─ div.header__row-1.header__navigation-container
│       │    div.header--toggle.header__navigation--toggle (hamburger, shown <768)
│       │    div.header__navigation.header--element
│       │      nav.navigation-primary > ul.submenu.level-1 > li.menu-item(.no-submenu|.has-mega) > a.menu-link(.has-arrow)
│       │        li.has-mega also contains div.mega-menu > div.mega-container > div.mega-nav-side (6× a.mega-item > div.mega-icon > img + span.mega-label) + div.mega-content-side > div.preview-card (div.preview-img-container > img.preview-img.default-img + img.preview-img.hover-img, h3.preview-title, p.preview-desc, a.preview-cta)
│       │      a.hs-button#hs-button_header_cta_button "Contact Us"
│       └─ div.header__row-2 > div.header__tagline-container.header--element > p.header-tagline "Storytelling + Innovation for Good"
└─ div.header__navigation.mobile-menu-container > div.mobile-menu.header--element (same nav markup + CTA + social icon row)
```

## Computed styles (desktop 1440, scroll 0)
- header: `position:fixed; top:0; left:0; width:100%; height:182px; z-index:1; background:transparent; box-shadow:0 4px 4px rgba(0,0,0,.05); transition: top .25s`. Body `padding-top: 182px` (set from measured header height; update on resize).
- banner: `height:48px; background:#308bf5;` content centered; text `Work Sans 19px/28px 500`, message `#fff`, link `#fff` underline on the `<u>` part, arrow after. (See notification-banner.css for exact flex/padding.)
- `.header__container`: `max-width:1240px; margin:0 auto; padding:40px 12px 0; display:flex; transition: padding .8s; height:134px`.
- logo wrapper: `display:flex; margin-bottom:auto`; img `max-width:60px` (natural 124×114 → 60×55); `.site-name` `align-self:center; padding-left:12px`; span `font-family: Colfax; font-size:28px; font-weight:700; letter-spacing:4px; color:#ff4e00; margin-top:7px; display:block; line-height:normal`.
- `.header__column`: `margin-left:auto; position:relative; display:flex; flex-direction:column; align-self:center`.
- row-1: `display:flex; align-items:center; justify-content:center; gap:20px; height:60px`.
- `.header__navigation`: `display:flex; align-items:center; justify-content:center; border-bottom:1px solid #dbdbdb; padding:12px 0`.
- `.navigation-primary` height 35px; `.menu-item` inline-flex, height 100%, align center, padding 0; `.menu-link`: `color:#000; font: 500 16px/16px Work Sans; padding:5px 12px; transition:.3s ease-in-out`; first item `padding-left:0`; hover/`.active-item` → `color:#308bf5`.
- `.menu-link.has-arrow`: `display:flex; align-items:center; position:relative; padding-right` leaves room; `::after { content:""; width:7px; height:7px; border:solid #000; border-width:0 2px 2px 0; position:absolute; top:13.5px; right:0; transform: rotate(45deg) }` (chevron down; exact in header.css).
- CTA `#hs_cos_wrapper_header_cta_button { margin-left:15px }` → `a.hs-button { height:35px; padding:5px 20px; font:500 16px/16px; letter-spacing:.06px; color:#fff; border:2px solid #308bf5 }` with the global `.hs-button::before` blue fill; hover → fill collapses, text `#308bf5`.
- row-2 tagline: `text-align:right; font: 500 16px/24px Work Sans; color:#4a4a4a` (see header.css `.header-tagline`), height 24px.

## States & behaviors
### Scroll → `.fixed`
- **Trigger:** `window.scrollY > 0` (any amount).
- **Before:** transparent, `padding-top:40px`, row-2 visible, nav border visible, z-index 1.
- **After (`header.fixed`, `body.header-fixed`):** `background:#fff; box-shadow:0 4px 12px rgba(0,0,0,.05); z-index:2`; `.header__container { padding:11px 12px; align-items:center }`; `.header__row-2 { display:none }`; `.header__navigation { border:none }`; header height becomes ≈132.66px; body padding-top updated to the new height.
- **Transition:** container padding `.8s`; header `top .25s`.
### Scroll direction → hide/show
- Keep `lastScrollY`. On scroll, if `scrollY > 0` and menu not visible: if `scrollY < lastScrollY` (up) → `header.style.top = '0px'`, add `body.navbar-fixed-visible`; else (down) → `header.style.top = -headerHeight + 'px'`, remove the class. If `scrollY === 0` → remove `.fixed`, `top = 0`.
- Pause direction logic while `.menu-visible`.
### Mega menu (hover, desktop ≥1024)
- `.mega-menu { position:absolute; top:56px; left:228px (centred under the nav); width:800px; max-width:800px; background:#fff; border-radius:12px; box-shadow:0 10px 12px rgba(0,0,0,.1); padding:20px; overflow:hidden; z-index:1; opacity:0; visibility:hidden; max-height:0; transition: max-height .6s ease-in-out, opacity .4s ease-out, visibility 0s linear .8s }`; on `li.has-mega:hover` → `opacity:1; visibility:visible; max-height:600px` (exact in header.css). Translate: the panel is centred via `transform:translateX(-400px)` from `left:50%`.
- `.mega-container { display:flex; gap:20px }`; `.mega-nav-side { flex:1 }`; `.mega-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border:1px solid transparent; border-radius:12px; transition:.3s ease-in-out; color:#308bf5 }` → hover: `background:#f1f9fc; border-color:#308bf5`; first item rendered in the hover state by default (screenshot). `.mega-icon { width:36px; height:36px; display:flex; align-items:center; justify-content:center; background:#f1f9fc; border-radius:6px }` → hover `background:#308bf5` and `img { filter: brightness(0) invert(1) }`; icon img 16×16. `.mega-label { color:#2f2f34; font-weight:600; font-size:16px }`.
- `.mega-content-side { width:350px }` → `.preview-card { background:#425f80; border-radius:12px; padding:36px 24px 30px; text-align:center; color:#fff; height:358px }`: `.preview-img-container { position:relative; width:120px; height:120px; margin:0 auto 20px }` default-img `position:relative; z-index:1; opacity:1`, hover-img `position:absolute; inset:0; z-index:2; opacity:0; transition: opacity .3s ease-in-out` → card hover shows hover-img. `.preview-title { color:#fff; font:700 18px/24px; margin:0 0 4px }`, `.preview-desc { color:#fff; font:400 13px/20px; opacity:.8; margin:0 0 24px; max-width:210px; margin-inline:auto }`, `.preview-cta { display:inline-block; background:#308bf5; color:#fff; border-radius:999px; padding:12px 30px; font:600 14px/16px; letter-spacing:-.3px }` (verify every value against header.css — it is authoritative).
### Mobile (<768) menu
- `.header__navigation--toggle` visible: 25×20, `::before/::after` 4px bars `#308bf5` (after has `box-shadow:0 8px 0 #308bf5, 0 16px 0 #308bf5`); when `.menu-visible` → bars rotate into an X (see header.css).
- Clicking the toggle toggles `.menu-visible` on header (`background:rgba(255,255,255,.96); z-index:2`) and `.header__row-1.menu-visible`; `.mobile-menu-container` expands (max-height transition) showing: nav links stacked (`font-size:14px`), the Services sub-items, Contact Us button, and the 4 social icons (use `src/components/icons.tsx`).
- Logo 45px; `.site-name span { font-size:14px; letter-spacing:3px }`; container padding 16px; desktop `.header__navigation` hidden; tagline hidden.

## Responsive
- ≥1440: as above. 1280–1439: container 1140. 1024–1279: nav font 14px/14px (header.css rule), container 960. 768–1023: hamburger layout (theme hides desktop nav below 64em — check header.css `@media (max-width:63.9375em)`). <768: mobile.

## Text content (verbatim UI strings)
Banner: "Want to improve your brand story?" / "Take the Brand Archetype Quiz" →. Nav: Work, Services, Approach, About, Jobs, Resources. CTA: "Contact Us". Tagline: "Storytelling + Innovation for Good". Mega items & preview copy are in `src/lib/site.ts`.

## Notes
- Render the mega menu markup once for desktop and once inside the mobile menu (as the original does), or share a component.
- Use `next/link` for internal hrefs (`/case-studies`, `/#approach`, …); banner link opens in a new tab.
- No HubSpot scripts. No chat widget.
