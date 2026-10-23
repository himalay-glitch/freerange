# freerange.com — Behavior Bible

Source: live site inspected with Playwright at 1440×900, 768 and 390 widths; theme JS at `docs/research/theme/theme-main.js`.
Breakpoints (theme uses em @16px): 767px (xsmall/small → medium), 999/1000px (large), 1023/1024px (xlarge), 1279/1280px, 1439/1440px.
No smooth-scroll library (no Lenis/Locomotive). `html { scroll-behavior: smooth }` only. Anchor links (`/#approach`) scroll to `h2.title#approach`.

## Site-wide

### Header (fixed, hide-on-scroll-down / show-on-scroll-up)
- `header.site-header` is `position: fixed; top: 0; width: 100%; z-index: 1; background: transparent; transition: top .25s`. Body gets `padding-top` = header height (182px at desktop/scroll 0; 132.66px once `.fixed`).
- **Trigger A — any scroll (scrollY > 0):** header gains `.fixed` → `background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,.05); z-index: 2`; `.header__container` padding goes `40px 12px 0` → `11px 12px` (transition padding .8s) and `align-items: center`; `.header__row-2` (tagline) `display: none`; nav `border-bottom: none`. Body gets `.header-fixed`.
- **Trigger B — scroll direction:** while scrolling down, `header.style.top = -headerHeight` (slides out); scrolling up, `top = 0` and body gets `.navbar-fixed-visible`. At scrollY 0 `.fixed` is removed and the transparent 182px layout returns.
- The blue notification banner (48px) is INSIDE the fixed header and scrolls out with it.
- Mega menu: hovering "Services" (`.menu-item.has-mega`) reveals `.mega-menu` (opacity/visibility transition: `max-height .6s ease-in-out, opacity .4s ease-out, visibility 0s linear .8s`). Items highlight on hover (bg `#f1f9fc`, border `1px solid #308bf5`, icon box bg `#308bf5`, icon `filter: brightness(0) invert(1)`); first item is shown highlighted by default. Preview card swaps `default-img` (egg) to `hover-img` (opacity 0→1, .3s) when the card is hovered.
- Nav link hover/active: color `#000` → `#308bf5`, `transition: .3s ease-in-out`.
- Mobile (<768px): hamburger (`.header__navigation--toggle`, 25×20, three 4px `#308bf5` bars) toggles `.menu-visible` on the header (bg `rgba(255,255,255,.96)`, z-index 2) and slides down `.header__navigation.mobile-menu-container` with the nav, the Services sub-list, Contact Us CTA and social icons.

### Footer
- Static. Newsletter form (email + SUBSCRIBE) submits to HubSpot; clone renders a non-functional form with a success message stub. Link hovers: social icons and "Contact Us" button use `.hs-button` hover (fill collapses `scaleY(0)`, text turns `#308bf5`).

### Buttons (`.hs-button`, `.cta_button`)
- Default: white text, `border: 2px solid #308bf5`, `::before` blue fill `scaleY(1)`. Hover/focus: `::before` → `scaleY(0)` (transition transform .3s ease-out), text → `#308bf5`. `.transparent-bg` variant inverts (outline by default, fills on hover).

## Homepage

### Hero — click-driven + mouse parallax + typewriter (INTERACTION MODEL: click + hover + mouse-move)
- Six low-poly birds (Chicken, Toucan, Hummingbird, Eagle, Penguin, Owl) as inline SVGs (717×484.2 viewBox, 219–446 `<polygon>` each) in `.hidden-layer` (only the current index is `display:block`, polygons `fill:#fff; opacity:0`).
- Two `<canvas>` layers draw the bird with the theme's "Shapeshifter" morph: `.layer-fg` canvas (1240×700, scale .8, centered, filled polygons, `transformSpeed .07`, `opacitySpeed .03`, `colorSpeed .03`) and `.layer-bg` canvas (1656×1118 placed `top:-175px; left:-534px; z-index:-1`, stroke-only `strokeOpacity .4`, scale .9, `transformSpeed .04`) — the faint wireframe behind the bird.
- **Click** any polygon → index +1 (wraps) → both canvases morph (per-polygon lerp of points & colours toward the next bird; surplus polygons shrink/fade), `.hidden-layer[hero-animation-current-index]` updates, caption is cleared and re-typed (TypewriterJS, `delay: 4`ms/char) after 1500ms. Touch: swipe right goes back two.
- **Hover** a polygon → `.hidden-layer.show-interaction-tooltip` → `#cursor-tooltip` "Click to see more" follows the cursor (`left = x+20, top = y+20`, fades in .15s after 150ms). Hovered polygon opacity .4, following siblings .25/.15/.1 (white overlay).
- **Mouse parallax** (parallax.js, `frictionX/Y .075`): `.hidden-layer` & `.layer-fg` depth .1, `.layer-bg` depth .7.
- On load: after 1500ms `.typewriter-container` gains `.shown` and the first caption types in (desktop); on xsmall the text is set instantly.
- Mobile (<768): `#hero-container` height `67.5vw`, `.hidden-layer` left 0, caption box has `.mobile-info-tab` ("Why the **chicken**?") that toggles `.is--open`.
- Canvases pause (no rAF) when the hero leaves the viewport.

### Work (card-list-module, 8 cards) — hover-driven
- Hovering a card reveals `.card-list-item-expanded-info` (logo + full title + description) over the dark image; see `raw/home-work-hover.json`.

### Approach — scroll-driven (INTERACTION MODEL: scroll)
- Section bg `#f0f9fd` with `.background .background-image` whose `background-position-y` tracks scroll progress through the section (parallax).
- `.our-approach-animation` (sticky, `top = (innerHeight - canvasHeight)/2`) draws an image sequence (`explore_bird_00001.png` … `count` frames from the module `config` attr) onto a canvas: frame = `ceil(progress * frameCount)` where progress = (scrollY - sectionTop) / (sectionHeight - innerHeight/1.5). The chick walks as you scroll.
- `.background` gets `.fixed` while section is in view and `.bottom` at the end (sticky background).
- Steps alternate left/right of a vertical rail with large orange Colfax numbers.

### Services — click-driven tabs
- Four tabs (Storytelling, Design, Workshops, Product Innovation). Clicking swaps the description text, image slide and Learn More link; see `raw/home-services.json`.

### Podcast cards — static (hover shows social share row on cards).

### Testimonials — click-driven Flickity slider
- Prev/next arrow buttons (`.flickity-button`), 7 slides, wrap-around; see `raw/home-testimonials.json`.

### Get a Free Consultation form — static HubSpot form (First/Last name, Organization, Phone, Email, UTM Term (hidden), Message, reCAPTCHA, Submit). Clone renders the same fields; submit shows the success message.

## Responsive summary
- 1440: 1240px container, 100px gutters. 1280–1439: container 1140. 1024–1279: 960. 1000–1023: 900. 768–999: 836. <768: fluid, 12px gutters.
- Header: nav collapses to hamburger below 768 (theme hides `.header__navigation` in `.header__row-1` on small). Hero stacks (bird on top, text below). Work grid: 4→2→1 columns. Approach: steps full width, chick animation becomes a centered static block. Services tabs → `<select>` on small screens. Footer stacks and centers.
