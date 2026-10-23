import type { CaseStudyCard } from "@/types/content";

/**
 * Placeholder content for the homepage "Work" grid (design clone: generic titles, placeholder
 * artwork and logos only). Row 1 has three cards with the third one wide; row 2 has four.
 */
export const WORK_ROWS: CaseStudyCard[][] = [
  [
    {
      slug: "sample-1",
      href: "/case-studies/sample-1",
      title: "Positioning a Mission-Driven Brand",
      client: "Client 1",
      image: "/placeholders/card-1.svg",
      logo: "/placeholders/client-logo-1.svg",
      description: "A refreshed brand platform and website that put a community health mission front and centre.",
    },
    {
      slug: "sample-2",
      href: "/case-studies/sample-2",
      title: "Scaling a Ride-Hailing Startup",
      client: "Client 2",
      image: "/placeholders/card-2.svg",
      logo: "/placeholders/client-logo-2.svg",
      description: "Product design and growth campaigns that helped a mobility startup expand into new cities.",
    },
    {
      slug: "sample-3",
      href: "/case-studies/sample-3",
      title: "Rebranding a Non-Profit Museum",
      client: "Client 3",
      image: "/placeholders/card-3.svg",
      logo: "/placeholders/client-logo-3.svg",
      wide: true,
      description: "A new identity and digital experience that opened a university collection to the public.",
    },
  ],
  [
    {
      slug: "sample-4",
      href: "/case-studies/sample-4",
      title: "Modernizing an Organic Produce Distributor",
      client: "Client 4",
      image: "/placeholders/card-4.svg",
      logo: "/placeholders/client-logo-4.svg",
      description: "An online ordering platform and brand refresh for a long-standing produce distributor.",
    },
    {
      slug: "sample-5",
      href: "/case-studies/sample-5",
      title: "Designing a Learning Management System for an Education Startup",
      client: "Client 5",
      image: "/placeholders/card-5.svg",
      logo: "/placeholders/client-logo-5.svg",
      description: "A custom learning platform and onboarding flow built for first-time learners.",
    },
    {
      slug: "sample-6",
      href: "/case-studies/sample-6",
      title: "Automating an Applicant Intake System",
      client: "Client 6",
      image: "/placeholders/card-6.svg",
      logo: "/placeholders/client-logo-6.svg",
      description: "An automated intake workflow on a CRM that cut application review time in half.",
    },
    {
      slug: "sample-7",
      href: "/case-studies/sample-7",
      title: "Revitalizing a Professional Association Brand",
      client: "Client 7",
      image: "/placeholders/card-7.svg",
      logo: "/placeholders/client-logo-7.svg",
      description: "A brand refresh and membership campaign for a national professional association.",
    },
  ],
];
