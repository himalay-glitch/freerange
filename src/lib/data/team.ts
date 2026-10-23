/** Team member shown in the About page grid (hover reveals name + role). */
export interface TeamMember {
  name: string;
  role: string;
  /** Portrait, cropped to the egg-shaped mask by CSS (square-ish source works best) */
  image: string;
}

const NAMES = [
  "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
];

const ROLES = [
  "Lead Engineer",
  "Business Development",
  "Managing Director",
  "Director of Technology",
  "Content Strategist",
  "Project Success Manager",
  "Lead Product Designer",
  "WordPress Engineer",
  "Go-To-Market Lead",
  "Front-End Engineer",
  "Full Stack Engineer",
  "QA Engineer",
];

/** 12 placeholder members (4 x 3 at desktop), cycling the seven placeholder headshots. */
export const TEAM_MEMBERS: TeamMember[] = ROLES.map((role, i) => ({
  name: `Team Member ${NAMES[i]}`,
  role,
  image: `/placeholders/headshot-${(i % 7) + 1}.svg`,
}));
