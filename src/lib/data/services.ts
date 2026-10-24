import type { ServiceTab } from "@/types/content";

/** Homepage "Services" section — title / intro are short UI copy from the original. */
export const SERVICES_TITLE = "Services";
export const SERVICES_DESCRIPTION =
  "Streamlined services delivering exceptional results: uniquely crafted stories, industry-leading brands, and powerful software.";

/**
 * Four tabs. Descriptions are ORIGINAL placeholder copy (design clone — the live paragraphs are not
 * reproduced); lengths roughly match the originals so the slide heights line up (7 / 4 / 5 / 7 lines
 * at the 568px desktop measure).
 */
export const SERVICES: ServiceTab[] = [
  {
    id: "storytelling",
    label: "Storytelling",
    description:
      "Every organization carries a story worth hearing, and the right one changes how people see you. We start by listening closely to your team, your audience, and the moments that shaped your mission. From there we shape a narrative that is honest, memorable, and built to travel. The result is a story your supporters can repeat, share, and rally behind, and your team learns the craft of telling it along the way.",
    image: "/placeholders/square-1.svg",
    cta: { label: "Learn More", href: "/services#storytelling" },
  },
  {
    id: "design",
    label: "Design",
    description:
      "Thoughtful design makes complex ideas feel simple and welcoming. We pair research with craft to create identities, interfaces, and print that hold up under real use and serve the people on the other side.",
    image: "/placeholders/square-2.svg",
    cta: { label: "Learn More", href: "/services#design" },
  },
  {
    id: "workshops",
    label: "Workshops",
    description:
      "Our workshops give your team a shared language for the brand you are building together. Over a few focused sessions we map your audience, uncover the archetype behind your voice, and sketch the story arc that ties it all together. You leave with practical tools and a plan you can act on today.",
    image: "/placeholders/square-3.svg",
    cta: { label: "Learn More", href: "/services#workshops" },
  },
  {
    id: "product-innovation",
    label: "Product Innovation",
    description:
      "Great products start with a clear understanding of the problem and the people living with it. We prototype early, test with real users, and refine until the experience feels truly effortless. Our designers and engineers work side by side, so what you see in the mockups is what ships. Along the way we document everything, leaving you with software that is easy to maintain and ready to grow with you.",
    image: "/placeholders/square-4.svg",
    cta: { label: "Learn More", href: "/services#product-innovation" },
  },
];
