import type { NavLink, ProductCard, TechBadge } from "@/types/content";

/**
 * Content for the R&D Lab page template (/rd-lab).
 * Section headings are the live site's short UI labels; every other string is original
 * placeholder copy, and all imagery points at the SVG placeholders under /public/placeholders.
 */

export const RDLAB_HERO = {
  title: "R&D Lab",
  image: "/placeholders/card-5.svg",
};

/** Right-aligned highlight heading under the banner: line one plain, line two in an orange box. */
export const RDLAB_INTRO = {
  line: "Exploring the edges of web technology—",
  highlight: "one build at a time.",
};

export const RDLAB_TECH_TITLE = "Tech Stack";
export const RDLAB_PRODUCTS_TITLE = "In-House Products";
export const RDLAB_FEATURED_TITLE = "Featured Case Studies";
export const RDLAB_INDUSTRIAL_TITLE = "Industrial Design";

/* Brand palette used by the badge SVGs (see globals.css tokens). */
const BLUE = "#308bf5";
const BLUE_DARK = "#0270e0";
const ORANGE = "#ff4e00";
const ORANGE_ALT = "#ff5201";
const YELLOW = "#f2c135";
const SLATE = "#425f80";
const NAVY = "#032049";
const INK = "#2f2f34";
const SKY_DEEP = "#cbe8f9";
const MIST = "#f2f4f7";
const WHITE = "#ffffff";

/** First carousel (scrolls left-to-right): 16 badges. */
export const RDLAB_TECH_ROW_1: TechBadge[] = [
  { label: "JS", shape: "square", background: YELLOW, color: INK },
  { label: "TS", shape: "square", background: BLUE, color: WHITE },
  { label: "PY", shape: "circle", background: NAVY, color: WHITE },
  { label: "GO", shape: "pill", background: SKY_DEEP, color: NAVY },
  { label: "RB", shape: "diamond", background: ORANGE, color: WHITE },
  { label: "RS", shape: "hexagon", background: INK, color: WHITE },
  { label: "PHP", shape: "square", background: SLATE, color: WHITE },
  { label: "C++", shape: "circle", background: BLUE_DARK, color: WHITE },
  { label: "SW", shape: "pill", background: ORANGE_ALT, color: WHITE },
  { label: "KT", shape: "hexagon", background: BLUE, color: WHITE },
  { label: "DT", shape: "diamond", background: SKY_DEEP, color: NAVY },
  { label: "JV", shape: "square", background: ORANGE, color: WHITE },
  { label: "SC", shape: "circle", background: SLATE, color: WHITE },
  { label: "EX", shape: "pill", background: INK, color: WHITE },
  { label: "HS", shape: "hexagon", background: YELLOW, color: INK },
  { label: "LU", shape: "diamond", background: NAVY, color: WHITE },
];

/** Second carousel (scrolls right-to-left): 16 badges. */
export const RDLAB_TECH_ROW_2: TechBadge[] = [
  { label: "RE", shape: "circle", background: BLUE, color: WHITE },
  { label: "VU", shape: "hexagon", background: SKY_DEEP, color: NAVY },
  { label: "NX", shape: "square", background: INK, color: WHITE },
  { label: "SV", shape: "diamond", background: ORANGE_ALT, color: WHITE },
  { label: "ND", shape: "pill", background: NAVY, color: WHITE },
  { label: "DJ", shape: "square", background: SLATE, color: WHITE },
  { label: "LV", shape: "circle", background: ORANGE, color: WHITE },
  { label: "RL", shape: "hexagon", background: BLUE_DARK, color: WHITE },
  { label: "PG", shape: "square", background: NAVY, color: WHITE },
  { label: "MG", shape: "pill", background: YELLOW, color: INK },
  { label: "RD", shape: "diamond", background: ORANGE, color: WHITE },
  { label: "K8", shape: "hexagon", background: BLUE, color: WHITE },
  { label: "DK", shape: "circle", background: SKY_DEEP, color: NAVY },
  { label: "AW", shape: "pill", background: SLATE, color: WHITE },
  { label: "GC", shape: "square", background: MIST, color: INK },
  { label: "AZ", shape: "diamond", background: BLUE, color: WHITE },
];

/** Three hover-expanding product cards. */
export const RDLAB_PRODUCTS: ProductCard[] = [
  {
    title: "Starter Theme Foundation Kit",
    description:
      "A modular website theme with ready-made sections, sensible defaults, and a content model editors actually enjoy. Starter and Pro editions ship with documentation, a demo site, and an upgrade path that never locks you in.",
    image: "/placeholders/card-6.svg",
    cta: { label: "Learn more", href: "/contact-us" },
  },
  {
    title: "Composable Page Builder",
    description:
      "Drag, drop, and publish. The builder gives marketing teams full control over layouts without touching code, while performance budgets and accessibility checks run quietly in the background on every save.",
    image: "/placeholders/card-7.svg",
    cta: { label: "Learn more", href: "/contact-us" },
  },
  {
    title: "Addon Kit",
    description:
      "A lightweight review layer for any web page: drop a marker, write a note, and hand it straight to the person who can fix it. Works on staging and production alike, with no plugin for reviewers to install.",
    image: "/placeholders/card-8.svg",
    cta: { label: "Learn more", href: "/contact-us" },
  },
];

/** Two-line intro above the featured case-study grid; `highlight` renders in blue. */
export const RDLAB_FEATURED_INTRO = {
  line1: "Taking ideas apart with care—",
  line2Prefix: "and turning them into ",
  highlight: "real products",
  line2Suffix: ".",
};

export const RDLAB_FEATURED_CTA: NavLink = { label: "View More Product Case Studies", href: "/case-studies" };

/** Industrial-design partnership split (image left, copy right). */
export const RDLAB_INDUSTRIAL = {
  image: "/placeholders/card-2.svg",
  /** Partner wordmark rendered as type; the trailing period is red. */
  partner: "northforge",
  heading: "Building something physical?",
  paragraphs: [
    "Take a concept from napkin sketch to production-ready hardware with a partner fluent in circuits and code.",
  ],
  partnerSentence: {
    before: "We team up with ",
    link: { label: "Northforge", href: "/contact-us" },
    after: " for industrial design and mechanical engineering, so the app and the object it controls ship together.",
  },
};

/** Full-width consultation band at the bottom of the page. */
export const RDLAB_CTA_BAND = {
  heading: "Have a tricky build or a half-formed idea we could help with?",
  cta: { label: "Get a Free Consultation", href: "/contact-us" } satisfies NavLink,
};
