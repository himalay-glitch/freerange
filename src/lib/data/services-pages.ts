/**
 * Data for the six service pages rendered by `ServicePage`.
 *
 * Only the page titles (and the fixed section/button labels) are taken from the
 * original site because they are navigational. Every intro, card description,
 * list item, FAQ and CTA paragraph is original placeholder copy.
 */

export type ServiceIcon = "window" | "screens" | "gear" | "bulb" | "pen" | "chart";

export interface ServiceCard {
  title: string;
  description: string;
  items: string[];
  icon: ServiceIcon;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServicePageData {
  path: string;
  title: string;
  intro: string;
  cards: ServiceCard[];
  /** Single card shown in the R&D Lab split section (icon defaults to the light bulb). */
  rdCard: Omit<ServiceCard, "icon"> & { icon?: ServiceIcon };
  rd: {
    heading: string;
    /** Rendered inside `<strong>` so it gets the theme's orange highlight. */
    highlight: string;
    paragraphs: string[];
    cta: { label: string; href: string };
  };
  faqs: ServiceFaq[];
  cta: { heading: string; text: string; label: string; href: string };
}

/* Shared blocks (identical on every service page) */

const RD_CARD: ServicePageData["rdCard"] = {
  title: "R&D Lab",
  description: "Test bold ideas before you build.",
  icon: "bulb",
  items: [
    "Discovery Sprints",
    "Service Blueprinting",
    "Clickable Prototypes & MVPs",
    "Pilot Programs & User Research",
    "Innovation Roadmapping",
  ],
};

const RD_BLOCK: ServicePageData["rd"] = {
  heading: "Explore the Free Range",
  highlight: "R&D Lab",
  paragraphs: [
    "Some problems don’t fit any off-the-shelf tool.",
    "Our lab is where we prototype the tools that don’t exist yet, from internal dashboards to public-facing apps, and share what we learn along the way.",
  ],
  cta: { label: "Learn More", href: "/rd-lab" },
};

const CTA_BLOCK: ServicePageData["cta"] = {
  heading: "Let’s Talk About Your Project",
  text: "Whether you are weighing a full rebuild or just need a second opinion on a plan, a short conversation is the easiest place to start. Tell us where you are and we’ll help you map the next step.",
  label: "Book a Consultation",
  href: "/contact-us",
};

export const SERVICE_PAGES: Record<string, ServicePageData> = {
  "/websites-software-development": {
    path: "/websites-software-development",
    title: "Websites & Software Development",
    intro:
      "Your website is often the first conversation a visitor has with your organization. We plan, design, and build digital platforms that are easy to manage, fast to load, and ready to grow with your mission, whether that means a new site, a careful rebuild, or a custom app.",
    cards: [
      {
        title: "Web Development",
        description: "Platforms that scale with your mission.",
        icon: "window",
        items: [
          "Discovery Workshops & Requirements",
          "Information Architecture & Sitemaps",
          "Responsive Interface Design",
          "CMS Setup & Theme Development",
          "Search, Taxonomy & Content Modeling",
          "Content Migration Planning",
          "Analytics & SEO Foundations",
          "Accessibility QA & Editor Training",
        ],
      },
      {
        title: "Software & Apps",
        description: "Custom tools that extend your reach.",
        icon: "screens",
        items: [
          "Product Roadmapping",
          "System Architecture & Data Design",
          "Front-End & API Development",
          "Third-Party & CRM Integrations",
          "Single Sign-On & Access Control",
          "Usability Testing Rounds",
          "Release Pipelines & DevOps",
        ],
      },
      {
        title: "Hosting & Maintenance",
        description: "Keep everything secure and running.",
        icon: "gear",
        items: [
          "Managed Cloud Hosting",
          "Certificate & Security Monitoring",
          "Platform & Plugin Updates",
          "Scheduled Backups & Recovery",
          "Uptime & Performance Checks",
          "Vulnerability Scanning",
          "Monthly Support & Reporting",
        ],
      },
    ],
    rdCard: RD_CARD,
    rd: RD_BLOCK,
    faqs: [
      {
        q: "Which content platforms do you build on?",
        a: "We build on several open-source and hosted platforms and recommend one only after we understand your editors, your integrations, and how the site needs to evolve over the next few years.",
      },
      {
        q: "How do you make sure a site meets accessibility guidelines?",
        a: "Accessibility is part of our definition of done. We design to recognized standards, test with assistive technology during QA, and document how editors can keep content accessible after launch.",
      },
      {
        q: "How do you handle security and data privacy?",
        a: "Every project ships with hardened hosting, least-privilege access, encrypted connections, and a monitoring plan. We review data handling with you early so privacy decisions are made on purpose.",
      },
      {
        q: "Can you connect the new site to the systems we already use?",
        a: "Yes. Most of our builds integrate with a CRM, a donation or payment processor, an email platform, or an internal database. We map those connections during discovery so nothing is a surprise later.",
      },
      {
        q: "What support is available after launch?",
        a: "You can choose a maintenance plan that covers updates, backups, monitoring, and a set number of support hours each month, with clear response times for anything urgent.",
      },
      {
        q: "How do you use AI tools during a website or software project?",
        a: "We use them where they speed up research, prototyping, and testing. Production code and content are always reviewed by a senior member of the team before you see them.",
      },
    ],
    cta: CTA_BLOCK,
  },

  "/design-brand": {
    path: "/design-brand",
    title: "Design & Brand Identity",
    intro:
      "A strong brand gives every campaign, page, and presentation a head start. We help organizations clarify what they stand for and express it consistently, from the logo and color palette to the layout of the last slide in the deck.",
    cards: [
      {
        title: "Brand Identity",
        description: "Visual systems with a point of view.",
        icon: "pen",
        items: [
          "Brand Discovery Workshops",
          "Positioning & Messaging Frameworks",
          "Logo & Wordmark Design",
          "Color, Type & Iconography",
          "Brand Guidelines & Templates",
          "Rollout Planning",
        ],
      },
      {
        title: "UX/UI Design",
        description: "Interfaces people enjoy returning to.",
        icon: "screens",
        items: [
          "User Research & Journey Mapping",
          "Wireframes & Information Architecture",
          "Interactive Prototypes",
          "Design Systems & Component Libraries",
          "Usability Testing",
          "Developer Handoff",
        ],
      },
      {
        title: "Illustration & Motion",
        description: "Visual stories that stick.",
        icon: "bulb",
        items: [
          "Custom Illustration Styles",
          "Infographics & Data Stories",
          "Explainer Animations",
          "Social & Presentation Graphics",
          "Print & Environmental Design",
        ],
      },
    ],
    rdCard: RD_CARD,
    rd: RD_BLOCK,
    faqs: [
      {
        q: "How long does a brand identity project take?",
        a: "Most identity projects run eight to fourteen weeks depending on how many audiences, sub-brands, and applications need to be covered. We agree on a schedule before the first workshop.",
      },
      {
        q: "Do we need a full rebrand, or just a refresh?",
        a: "Often a refresh is enough. We start with an audit of what is working, what is confusing people, and what has drifted, and then recommend the lightest change that solves the real problem.",
      },
      {
        q: "Who from our team needs to be involved?",
        a: "A small decision-making group works best: usually a leader, someone from communications, and someone who hears from your audience every day. We also interview a wider circle for input.",
      },
      {
        q: "Will we be able to use the brand without you?",
        a: "Yes. Every identity ships with guidelines, editable templates, and a working session for your staff so day-to-day materials can be produced in-house.",
      },
      {
        q: "Can you design within an existing brand?",
        a: "Absolutely. Many of our design engagements extend a brand that already exists, adding a digital design system, campaign look, or illustration style that fits alongside it.",
      },
      {
        q: "How do you test design decisions?",
        a: "We share options early, gather feedback from real audience members where we can, and test key interfaces with users before anything is finalized.",
      },
    ],
    cta: CTA_BLOCK,
  },

  "/content-writing-video-production": {
    path: "/content-writing-video-production",
    title: "Content Writing & Video Production",
    intro:
      "Good stories change minds, and well-made ones change behavior. Our writers, producers, and editors turn complex work into articles, videos, and series that people actually finish, share, and act on, in the formats your audiences already use.",
    cards: [
      {
        title: "Writing & Editorial",
        description: "Clear words for complicated work.",
        icon: "pen",
        items: [
          "Editorial Strategy & Calendars",
          "Web & Landing Page Copy",
          "Long-Form Articles & Reports",
          "Email & Newsletter Programs",
          "Case Studies & Impact Stories",
          "Voice & Tone Guidelines",
        ],
      },
      {
        title: "Video Production",
        description: "From first storyboard to final cut.",
        icon: "screens",
        items: [
          "Concept & Script Development",
          "Documentary & Interview Shoots",
          "Animated Explainers",
          "Motion Graphics & Titling",
          "Editing, Color & Sound",
          "Captioning & Accessible Versions",
        ],
      },
      {
        title: "Distribution & Repurposing",
        description: "Make every story travel further.",
        icon: "chart",
        items: [
          "Channel-Specific Cutdowns",
          "Social Clip Packages",
          "Podcast & Audio Editions",
          "Presentation & Event Reels",
          "Performance Reporting",
        ],
      },
    ],
    rdCard: RD_CARD,
    rd: RD_BLOCK,
    faqs: [
      {
        q: "Can you work with subject-matter experts on our side?",
        a: "That is usually how it goes. We interview your experts, draft in your voice, and run a light review cycle so accuracy is checked without slowing production down.",
      },
      {
        q: "What does a typical video budget cover?",
        a: "Pre-production, one or more shoot days, editing, graphics, music licensing, and delivery in the formats you need. We scope each piece separately so there are no hidden costs.",
      },
      {
        q: "Do you handle filming on location?",
        a: "Yes. Our crews travel, and for distributed teams we can also direct remote recordings and combine them with animation or archival material.",
      },
      {
        q: "How do you keep content accessible?",
        a: "All videos ship with captions and transcripts, written content follows plain-language guidance, and we provide audio description when the material calls for it.",
      },
      {
        q: "Who owns the finished work?",
        a: "You do. Final deliverables, project files, and raw footage are yours, and we document any third-party licenses that come with them.",
      },
      {
        q: "Can you produce content on an ongoing basis?",
        a: "Many partners work with us on a monthly retainer that covers a set mix of articles, emails, and short videos, planned together each quarter.",
      },
    ],
    cta: CTA_BLOCK,
  },

  "/campaign-strategy-execution": {
    path: "/campaign-strategy-execution",
    title: "Campaign Strategy & Execution",
    intro:
      "Campaigns succeed when the message, the audience, and the moment line up. We help you define the goal, shape the creative, choose the channels, and run the plan from launch day to the final report, adjusting as the numbers come in.",
    cards: [
      {
        title: "Campaign Strategy",
        description: "A plan built around real goals.",
        icon: "chart",
        items: [
          "Goal Setting & Success Metrics",
          "Audience Research & Segmentation",
          "Message Architecture",
          "Channel & Budget Planning",
          "Timeline & Milestone Mapping",
          "Stakeholder Alignment Sessions",
        ],
      },
      {
        title: "Creative Development",
        description: "Ideas that earn attention.",
        icon: "bulb",
        items: [
          "Campaign Concepts & Naming",
          "Key Visuals & Toolkits",
          "Landing Pages & Microsites",
          "Video, Social & Display Assets",
          "Partner & Ambassador Kits",
        ],
      },
      {
        title: "Media & Measurement",
        description: "Get it out there and learn fast.",
        icon: "gear",
        items: [
          "Paid Media Setup & Management",
          "Email & Automation Flows",
          "Earned Media & Outreach",
          "Dashboards & Weekly Reporting",
          "Testing & Optimization Cycles",
          "Wrap-Up Analysis & Playbooks",
        ],
      },
    ],
    rdCard: RD_CARD,
    rd: RD_BLOCK,
    faqs: [
      {
        q: "How far in advance should we start planning?",
        a: "Three to four months before launch is comfortable for a multi-channel campaign. Shorter runways are possible when the goal and audience are already clear.",
      },
      {
        q: "Can you manage the media budget for us?",
        a: "Yes. We can place and optimize paid media directly, or work alongside your existing media partner and focus on creative and measurement.",
      },
      {
        q: "What size of campaign do you take on?",
        a: "Everything from a single-issue advocacy push to a year-long national program. The process scales; the attention to the message does not change.",
      },
      {
        q: "How do you measure success?",
        a: "We agree on a small set of outcome metrics at the start, build a dashboard around them, and report against them every week while the campaign is live.",
      },
      {
        q: "Will the campaign fit our existing brand?",
        a: "It will. We design campaign creative to live inside your brand system, and we flag it early if a concept needs more room than the system currently allows.",
      },
      {
        q: "What do we receive when the campaign ends?",
        a: "A wrap-up report, the full asset library, and a playbook describing what worked so your team can run the next round with or without us.",
      },
    ],
    cta: CTA_BLOCK,
  },

  "/team-augmentation": {
    path: "/team-augmentation",
    title: "Team Augmentation",
    intro:
      "Sometimes you do not need a new agency, you need two more capable people on Monday. We embed designers, developers, and producers inside your team, working in your tools and on your schedule, for as long as the work requires.",
    cards: [
      {
        title: "Design Support",
        description: "Senior designers on your schedule.",
        icon: "pen",
        items: [
          "Product & UX Designers",
          "Visual & Brand Designers",
          "Design System Maintenance",
          "Research & Testing Support",
          "Presentation & Report Design",
        ],
      },
      {
        title: "Engineering Support",
        description: "Developers who ship on day one.",
        icon: "window",
        items: [
          "Front-End & CMS Developers",
          "Full-Stack & API Engineers",
          "Code Review & Technical Audits",
          "Performance & Accessibility Fixes",
          "Legacy Platform Upkeep",
          "Deployment & QA Coverage",
        ],
      },
      {
        title: "Project Leadership",
        description: "Keep the work moving and visible.",
        icon: "gear",
        items: [
          "Fractional Product Management",
          "Delivery & Sprint Facilitation",
          "Vendor & Contractor Coordination",
          "Roadmap & Backlog Hygiene",
          "Status Reporting for Leadership",
        ],
      },
    ],
    rdCard: RD_CARD,
    rd: RD_BLOCK,
    faqs: [
      {
        q: "How quickly can someone start?",
        a: "Usually within two weeks. We match on skills and working style first, then handle onboarding so the person is productive in their first few days.",
      },
      {
        q: "Do embedded team members use our tools?",
        a: "Yes. They work in your project tracker, chat, repositories, and design files, following your conventions rather than ours.",
      },
      {
        q: "What is the minimum engagement?",
        a: "Most placements run a minimum of three months at half time or more. Shorter, well-defined bursts are possible for audits and launches.",
      },
      {
        q: "Can the arrangement scale up or down?",
        a: "It can. Capacity is reviewed monthly, so you can add a second person for a push or taper off as your own hires come on board.",
      },
      {
        q: "Who manages the embedded staff?",
        a: "Day to day, you do. Behind the scenes, a Free Range lead checks in regularly, covers absences, and brings in specialists when a task needs one.",
      },
      {
        q: "How is this priced?",
        a: "A flat monthly rate per role based on seniority and allocation, agreed in advance with no recruiting fees or surprise overages.",
      },
    ],
    cta: CTA_BLOCK,
  },

  "/ai-for-operations": {
    path: "/ai-for-operations",
    title: "AI for Operations",
    intro:
      "The repetitive work that fills your team’s week is exactly where AI earns its keep. We design, build, and supervise practical automations and assistants so people can spend their time on the judgment calls and relationships that need them.",
    cards: [
      {
        title: "Workflow Automation",
        description: "Remove the busywork, keep the judgment.",
        icon: "gear",
        items: [
          "Process Mapping & Opportunity Audits",
          "Intake & Routing Automations",
          "Document Drafting & Summaries",
          "Data Entry & Reconciliation",
          "Approval & Notification Flows",
          "Change Management & Training",
        ],
      },
      {
        title: "Custom AI Agents",
        description: "Assistants built for your team’s tasks.",
        icon: "bulb",
        items: [
          "Use-Case Definition & Guardrails",
          "Internal Support Assistants",
          "Constituent & Customer Service Agents",
          "Research & Reporting Agents",
          "Evaluation & Quality Monitoring",
          "Human Review Checkpoints",
        ],
      },
      {
        title: "Knowledge & Data Systems",
        description: "Give the tools something reliable to learn from.",
        icon: "chart",
        items: [
          "Knowledge Base Structuring",
          "Secure Document Retrieval",
          "CRM & Database Connections",
          "Privacy & Access Policies",
          "Usage Dashboards & ROI Tracking",
        ],
      },
    ],
    rdCard: RD_CARD,
    rd: RD_BLOCK,
    faqs: [
      {
        q: "Where should an organization start with AI?",
        a: "With a short audit of the tasks that take the most hours and carry the least risk. The first automation should be boring, measurable, and easy to switch off.",
      },
      {
        q: "Is our data used to train public models?",
        a: "No. We configure every tool so your documents stay within your environment, and we document exactly what each integration can and cannot see.",
      },
      {
        q: "How do you keep the results accurate?",
        a: "Each agent is tested against a set of known cases before launch, monitored afterwards, and designed with review steps for anything that affects a person directly.",
      },
      {
        q: "Will this replace members of our team?",
        a: "In our experience it changes roles rather than removing them. We plan the rollout with staff so the time saved goes toward work that was previously neglected.",
      },
      {
        q: "What tools and platforms do you use?",
        a: "We are platform-agnostic and choose based on your existing systems, your security requirements, and how much control you need over the model and the data.",
      },
      {
        q: "What does ongoing support look like?",
        a: "A monthly plan covers monitoring, model updates, new use-case scoping, and a review meeting where we look at usage data together and decide what to adjust.",
      },
    ],
    cta: CTA_BLOCK,
  },
};

export const SERVICE_PATHS = Object.keys(SERVICE_PAGES);
