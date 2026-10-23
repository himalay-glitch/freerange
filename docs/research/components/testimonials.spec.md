# Testimonials Specification (homepage, click-driven slider)

- **Target files:** `src/components/home/Testimonials.tsx` (`"use client"`), `src/styles/clients-slider.css`, data `src/lib/data/testimonials.ts`
- **Screenshot:** `docs/design-references/home-06-testimonials.png`
- **Sources:** `docs/research/html/home-testimonials.html`, `docs/research/css/clients-slider.css` (authoritative), `docs/research/raw/home-testimonials.json` (`tree`, `slides`, `btns`)
- **Interaction model:** click-driven prev/next (Flickity, wrap-around, draggable). Implement in React (no library): translateX slider with wrap-around, 0.4s ease, pointer-drag optional.

## Layout (desktop 1440, content 1216)
- `.module.clients-slider` > `h2.title.module-title` "Testimonials" > `.clients-slider-description.module-description.wysiwyg-content` "What our partners are saying." (`margin:16px 0 40px`) > `.slides { position:relative; padding:0 80px }` (1216 wide; viewport 1056) > `.flickity-viewport { overflow:hidden; width:100%; height:441px (tallest slide) }` > `.flickity-slider { display:flex; transition:transform .4s ease }` > `.slide { display:flex; width:100%; flex:0 0 100%; align-items:center }`
  - `img { width:30%; object-fit:cover; object-position:center; align-self:center }` (317×411)
  - `.client-info { width:70%; padding-left:30px; align-self:center }` with `::before { content:""; display:block; width:15px; height:12px; margin-bottom:20px; background:url(<quote glyph>) }` — draw an ORIGINAL 15×12 double-quotation-mark SVG (fill #308bf5) instead of the theme's PNG. Then `p.testimonial { font:500 19px/28px; letter-spacing:-.5px; margin:0 0 40px }`, `p.name { font-weight:700; margin:0 0 5px }`, `p.title { color:#308bf5; font:800 14px/24px; letter-spacing:0; margin:0 0 32px }`.
- Buttons `.flickity-button.flickity-prev-next-button.previous|.next { position:absolute; top:50%; transform:translateY(-50%); width:48px; height:48px; background:#308bf5; border:0; padding:5px; color:#fff; cursor:pointer }`; `.previous { left:0 } .next { right:0 }`; inside `svg.flickity-button-icon` 16×16 with `path.arrow { fill:#fff }` (use `SliderArrowIcon` from `src/components/icons.tsx`); hover/active per clients-slider.css (opacity/box-shadow). Buttons sit at y = 220.5px (centre of the 441px viewport).
- Data (`testimonials.ts`): seven `Testimonial`s with ORIGINAL placeholder quotes (2–4 sentences), generic names and roles ("Director of Programs, Sample Organization"), `image:/placeholders/headshot-N.svg`.

## Behaviour
- Prev/next wrap around (index −1 → last). Keyboard: left/right arrows when the slider is focused. Viewport height = max slide height (measure after mount/resize).

## Responsive (port clients-slider.css exactly)
- ≤999: `.slide { flex-direction:column; align-items:center }`, `.client-info { width:100%; padding-left:0; margin-top:20px }`.
- ≤767: `.slides { padding:0 40px }`, `img { width:50% }`, `p.testimonial { font-size:16px; line-height:24px; margin-bottom:20px }`, `::before { margin-bottom:10px }`; ≤479: `img { width:60% }`.
