/** One opening on the /jobs listing. `href` is the job detail route (/jobs/<slug>). */
export interface JobListing {
  slug: string;
  href: string;
  title: string;
  /** Skill chips rendered under the title */
  skills: string[];
  /** Short description paragraph */
  excerpt: string;
}

/** A company value listed in the /jobs hero (bold label + one sentence). */
export interface JobValue {
  label: string;
  text: string;
}

/** Hero copy above the listing. The highlighted tail is wrapped in <strong> by the template. */
export const JOBS_HEADLINE = {
  lead: "We are looking for people with varied backgrounds, skills and points of view who help us see clearly, test assumptions and create work that",
  highlight: "changes lives",
};

export const JOBS_INTRO: string[] = [
  "Placeholder paragraph describing how and where the team works. It runs to about two lines at the desktop width and introduces the list of values that follows below.",
  "If the following values speak to you, you may be a great fit:",
];

export const JOB_VALUES: JobValue[] = [
  {
    label: "Transparency",
    text: "Placeholder sentence describing why clear communication with partners, clients and colleagues matters at every step of a project. A second placeholder sentence notes that nobody involved should be left guessing about where things stand.",
  },
  {
    label: "Inclusiveness",
    text: "Placeholder sentence describing how a range of perspectives leads to better stories, products and solutions for the people they serve. A second placeholder sentence notes that equitable solutions come from including every stakeholder in the process, and a third rounds the item out to about three lines at the desktop width.",
  },
  {
    label: "Playfulness",
    text: "Placeholder sentence describing how taking the work seriously still leaves room for good humour, curiosity and surprise. A second placeholder sentence notes that the best ideas tend to arrive after stepping away from the desk for a while. A third placeholder sentence describes bringing that same energy to the campaigns and products made for clients, and a fourth rounds the item out to about four lines at the desktop width.",
  },
  {
    label: "Efficacy",
    text: "Placeholder sentence describing how outcomes are judged by how well they solve the client's actual problem. A second placeholder sentence notes that when a solution does not fix the problem, the work goes back to the drawing board until it does.",
  },
];

export const JOBS_OUTRO =
  "Placeholder equal-opportunity statement. This closing paragraph runs to roughly four lines at the desktop width. It notes that candidates from all backgrounds are encouraged to apply, that applicants are evaluated solely on their qualifications to perform the work required, and that building an inclusive organisation is treated as a priority rather than an afterthought. A final placeholder sentence pads the paragraph to the length of the original text so that the job listing below starts at the same vertical position.";

export const JOB_LISTINGS: JobListing[] = [
  {
    slug: "project-success-manager",
    href: "/jobs/project-success-manager",
    title: "Project Success Manager",
    skills: [
      "Agile",
      "Kanban",
      "Presentations",
      "Quality Assurance",
      "Roadmapping",
      "Budget Reporting",
      "Leadership",
    ],
    excerpt:
      "Placeholder description for this role. In this position you would coordinate several concurrent projects with clients and cross-functional teams, plan resourcing that informs roadmaps and timelines, and keep every workstream moving toward its deliverables. You would guide the people around you, contribute to the creative process, and make sure clients have a positive, consultative experience from kickoff to launch. This copy runs to about five lines at the desktop width so the card matches the original height.",
  },
  {
    slug: "graphic-motion-designer",
    href: "/jobs/graphic-motion-designer",
    title: "Graphic & Motion Designer",
    skills: [
      "Figma",
      "Prototyping",
      "Image Editing",
      "Video",
      "Motion Graphics",
      "Illustration",
      "Infographics",
      "Iconography",
      "Logos",
      "Animation",
      "Moodboards",
    ],
    excerpt:
      "Placeholder description for this role. In this position you would work with clients and cross-functional teams to understand their challenges and goals, then develop moodboards, storyboards, illustrations and other designed elements that tell stories through infographics, iconography, animation and video. You would provide a creative, consultative experience throughout each project, bring out the best in the people you collaborate with, and move work efficiently toward final deliverables while keeping every asset consistent with the brand. This copy runs to about six lines at the desktop width so the card matches the original height.",
  },
];
