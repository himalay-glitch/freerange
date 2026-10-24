import type { ApproachStep } from "@/types/content";

/** Section title and intro, as rendered on the live homepage. */
export const APPROACH_TITLE = "Approach";
export const APPROACH_DESCRIPTION =
  "A proven four-step process empowers us to understand your audience, brand, and business goals to create a plan for success.";

/**
 * The four steps of the Approach section. Titles and tags are the live site's
 * short UI labels; the descriptions are original placeholder copy.
 */
export const APPROACH_STEPS: ApproachStep[] = [
  {
    number: 1,
    title: "Understand",
    align: "left",
    description:
      "Every engagement starts with listening. We map your audience, your market, and the pressures shaping your organization, then look for the openings others have missed. The result is a shared picture of the problem worth solving.",
    tags: [
      "Discovery & Research",
      "User Stories",
      "Creative Direction",
      "Product Roadmap",
      "Workshops",
      "Focus Groups",
      "Brand Strategy",
    ],
  },
  {
    number: 2,
    title: "Explore",
    align: "right",
    description:
      "With the brief in hand, we widen the lens and sketch many possible directions before narrowing to the few that matter. Ideas are tested against real constraints early, so ambition and feasibility grow together. The goal is a clear path you can commit to with real confidence.",
    tags: ["Moodboards", "Concepts", "Information Architecture", "Ideation", "Design Thinking"],
  },
  {
    number: 3,
    title: "Create",
    align: "left",
    description:
      "Now the plan becomes tangible. Writers, designers, and engineers work side by side to turn strategy into words, visuals, and working software. We iterate quickly, review often, and keep the craft tight until the work is ready to meet its audience and earn its place.",
    tags: [
      "Prototype",
      "Minimum Viable Product",
      "Development",
      "Brand Identity",
      "Video Production",
      "Animation",
      "Illustrations",
      "Graphic Design",
      "Package Design",
      "UX/UI Design",
      "Event Design",
      "Display Design",
      "Copywriting",
      "Scripts",
    ],
  },
  {
    number: 4,
    title: "Launch",
    align: "right",
    description:
      "Shipping is a beginning, not a finish line. We release, measure what happens, and tune the experience with you as real feedback arrives. Over the following sprints we build on what works and retire what doesn’t serve you.",
    tags: ["Go-to-Market", "Analytics", "Strategy", "Product Sprints", "Planning"],
  },
];
