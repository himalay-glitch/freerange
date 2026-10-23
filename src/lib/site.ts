import type { NavItem, SocialLink } from "@/types/content";

/** Primary navigation, extracted verbatim from the live header. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "/case-studies" },
  {
    label: "Services",
    href: "#",
    mega: {
      items: [
        { label: "Website & Software Development", href: "/websites-software-development", icon: "/hubfs/Icon-Area.svg" },
        { label: "Design & Brand Identity", href: "/design-brand", icon: "/hubfs/Container.svg" },
        { label: "Content Writing & Video Production", href: "/content-writing-video-production", icon: "/hubfs/Icon-Area-1.svg" },
        { label: "Campaign Strategy & Execution", href: "/campaign-strategy-execution", icon: "/hubfs/Icon-Area-2.svg" },
        { label: "Team Augmentation", href: "/team-augmentation", icon: "/hubfs/Icon-Area-3.svg" },
        { label: "AI for Operations", href: "/ai-for-operations", icon: "/hubfs/astroid.png" },
      ],
      preview: {
        defaultImage: "/hubfs/image-31.png",
        hoverImage: "/hubfs/image-32.png",
        title: "Not sure where to start?",
        description: "No worries. Break out of your shell and give us a call.",
        cta: { label: "Get a Free Consultation →", href: "/contact-us" },
      },
    },
  },
  { label: "Approach", href: "/#approach" },
  { label: "About", href: "/about" },
  { label: "Jobs", href: "/jobs" },
  { label: "Resources", href: "/resources" },
];

export const HEADER_CTA = { label: "Contact Us", href: "/contact-us" };
export const HEADER_TAGLINE = "Storytelling + Innovation for Good";

export const NOTIFICATION_BANNER = {
  message: "Want to improve your brand story?",
  linkLabel: "Take the Brand Archetype Quiz",
  href: "/archetypes",
};

export const SOCIAL_LINKS: SocialLink[] = [
  { network: "facebook", label: "Follow us on Facebook", href: "https://www.facebook.com/FreeRangeStudios/" },
  { network: "linkedin", label: "Follow us on LinkedIn", href: "https://www.linkedin.com/company/free-range-studios" },
  { network: "twitter", label: "Follow us on Twitter", href: "https://twitter.com/freerangestudio" },
  { network: "instagram", label: "Follow us on Instagram", href: "https://www.instagram.com/freerangestudios/" },
];

export const SITE_NAME = "FREE RANGE";
export const LOGO_ORANGE = "/hubfs/Free-Range/Chicken.svg";
export const LOGO_WHITE = "/hubfs/Free-Range/white-chicken-svg.svg";
export const B_CORP_BADGE = "/hubfs/B-Corp-1.svg";
export const COPYRIGHT = `© ${new Date().getFullYear()} Free Range`;
