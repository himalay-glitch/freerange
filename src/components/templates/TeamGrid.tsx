import type { TeamMember } from "@/lib/data/team";

/**
 * About page team grid: 4 x 3 egg-shaped portraits at desktop (3 per row <= 999px, a single
 * 320px/240px column <= 767px). Hovering a member fades in the navy overlay with name + role.
 * Styles: src/styles/about.css (imported by AboutPage).
 */
export default function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="team-grid">
      <div className="team-members-container">
        {members.map((member) => (
          <div className="team-member" key={member.name}>
            {/* eslint-disable-next-line @next/next/no-img-element -- plain <img>, cropped by the mask */}
            <img className="team-member__photo" src={member.image} alt="" loading="lazy" />
            <div className="overlay">
              <h3>{member.name}</h3>
              <h4>{member.role}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
