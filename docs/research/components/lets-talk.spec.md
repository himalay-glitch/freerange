# LetsTalk (Get a Free Consultation) Specification

## Overview
- **Target files:** `src/components/home/LetsTalk.tsx` (client — controlled form + submit stub), `src/styles/lets-talk.css`
- **Screenshot:** `docs/design-references/home-07-letstalk.png` (1440); mobile: `home-mobile-390-full.png` (near the bottom)
- **Source of truth:** `docs/research/html/home-letstalk.html`, `docs/research/css/lets-talk.css` (authoritative — includes the HubSpot form field rules and all breakpoints), computed tree + field list in `docs/research/raw/home-letstalk.json`
- **Interaction model:** static form; submit stub shows the success message

## Layout (desktop 1440)
- `.module.lets-talk.full-width.remove-bottom-margin { position:relative; width:100vw; left:50%; margin-left:-50vw; background:#f2f4f7; padding:40px 0; height ≈759px }`
- `.container (1240; display:flex)`
  - `.lets-talk-form.form { flex:1 0 65%; padding-right:40px }`
    - `h2.title` "Get a Free Consultation" (25px/35px 700 #4a4a4a; 2px #ff4e00 underline; pb 10; mb 40) containing `span.phone-number { float:right; color:#ff4e00; font:500 19px/24px; letter-spacing:-.5px; padding:8px 0; background:transparent }` — use the placeholder number "+1.000.000.0000".
    - `.lets-talk-content-wrapper { min-height:450px }` > `form.hs-form.stacked { display:flex; flex-wrap:wrap; position:relative }`
      - `.hs-form-field { flex:1 1 calc(50% - 20px); margin-bottom:20px; position:relative }`; 1st & 3rd `margin-right:10px`, 2nd & 4th `margin-left:10px`; `label { margin-bottom:4px; display:block } > span { color:#308bf5; font:700 12px/12px; letter-spacing:0; text-transform:uppercase }` (required fields append `*` inside the span).
      - inputs: `height:43px; padding:10px; font:400 16px/16px; color:#494a52; background:#fff; border:2px solid #d1d6dc; border-radius:3px; width:100%` ; focus `border-color:#494a52` ; placeholder colour #494a52.
      - fields in order: First name* (text, placeholder "First name"), Last name* (text, "Last name"), Organization (text, "Organization"), Phone number (tel, "+1 123456789"), Email* (email, "mail@domain.com", full width `flex:1 1 100%`), hidden `utm_term`, Message (textarea `.hs-fieldtype-textarea { flex:100% }`, placeholder "How can we help?", `min-height:135px; padding:16px 10px; line-height:19.2px`).
      - `.hs_error_rollup { position:absolute; top:calc(100% - 30px) }` with `label { color:#ff4e00 }`; field errors `.hs-error-msgs { position:absolute; left:0 } .hs-error-msg { color:#ff4e00; font-size:12px; line-height:12px }`; `.invalid { border-color:#ff4e00 }`.
      - `.hs-submit { display:flex; flex:100%; justify-content:flex-end; transition:all .5s }` > `input[type=submit].hs-button.primary` value "Submit" `{ background:#308bf5; color:#fff; border:none; border-radius:0; min-width:135px; padding:12px 20px; font:500 16px/16px; letter-spacing:.06px; cursor:pointer }` (rendered 135×40 at x≈727); hover per lets-talk.css.
      - The reCAPTCHA badge is NOT reproduced (no third-party scripts).
      - On submit (client-side validation of required + email format): replace the form with `.submitted-message > p` "Thanks! We'll be in touch shortly." (`color:#308bf5; font:600 1.5rem/1.3 Work Sans`).
  - `.lets-talk-image { flex:1 0 35%; padding-top:45px; position:relative }` > `img { position:absolute; bottom:-70px; width:100%; max-width:600px }` (at ≥1440 the theme lets it reach 857px wide — see lets-talk.css `@media (min-width:90em)`); the module clips via `overflow:hidden` on the dnd wrapper at ≤1279px. Use `/placeholders/side-illustration.svg`.

## Responsive (port lets-talk.css exactly)
- ≤999px: every field `flex:100%`, no side margins; error rollup static; submit margin-top 15px.
- ≤767px: container stacks (`flex-direction:column`); form `flex:1 1 100%; padding-right:0`; title `padding-bottom:2px` and phone number drops under the title (per CSS); image block `flex:1 1 100%; align-self:center; margin-bottom:-25%; padding-top:30px` with the img `position:relative; bottom:auto; margin-left:25%`.
