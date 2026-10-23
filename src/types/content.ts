/** Shared content types for the Free Range clone. */

export interface NavLink {
  label: string;
  href: string;
  /** External/new-tab link */
  external?: boolean;
}

export interface MegaMenuItem extends NavLink {
  /** Path under /public for the 24px icon */
  icon: string;
}

export interface MegaMenuPreview {
  defaultImage: string;
  hoverImage: string;
  title: string;
  description: string;
  cta: NavLink;
}

export interface NavItem extends NavLink {
  /** Present when the item opens the Services mega menu */
  mega?: { items: MegaMenuItem[]; preview: MegaMenuPreview };
}

export interface SocialLink {
  network: "facebook" | "linkedin" | "twitter" | "instagram";
  label: string;
  href: string;
}

/** One of the six low-poly birds that morph in the homepage hero. */
export interface HeroAnimal {
  name: string;
  text: string;
  /** Raw inline SVG markup (717 x 484.2 viewBox) */
  svg: string;
}

/** Card used by the "Work" grid and case-study listings. */
export interface CaseStudyCard {
  slug: string;
  href: string;
  title: string;
  client: string;
  /** Background photo */
  image: string;
  /** White client logo laid over the card */
  logo?: string;
  /** Wide card spanning two columns */
  wide?: boolean;
  category?: string;
  description?: string;
}

/** Podcast / blog post card on the homepage. */
export interface PostCard {
  slug: string;
  href: string;
  title: string;
  image: string;
  tags: string[];
  wide?: boolean;
  excerpt?: string;
  date?: string;
  author?: string;
}

export interface ApproachStep {
  number: number;
  title: string;
  description: string;
  tags: string[];
  /** Side of the vertical rail the step hangs on */
  align: "left" | "right";
}

export interface ServiceTab {
  id: string;
  label: string;
  description: string;
  image: string;
  cta: NavLink;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  image: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "hidden";
  placeholder?: string;
  required?: boolean;
  /** Occupies the full row */
  full?: boolean;
}
