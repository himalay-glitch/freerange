import Link from "next/link";
import "@/styles/about.css";
import { TEAM_MEMBERS, type TeamMember } from "@/lib/data/team";
import TeamGrid from "./TeamGrid";

/**
 * /about page template. Mirrors the live page's module order inside `.container`:
 * 60px spacer -> highlighted h1 -> half-video/half-copy module (video floated right) ->
 * 20px spacer -> "Our Team" custom heading -> team grid -> centred "join" rich text + CTA.
 * The HubSpot drag-and-drop wrappers are flattened; class names of the modules are kept.
 */
export default function AboutPage({ members = TEAM_MEMBERS }: { members?: TeamMember[] }) {
  return (
    <main id="main-content" className="body-container-wrapper">
      <div className="container">
        <div className="body-container body-container--default body-container--about">
          <hr className="horizontal-space" style={{ height: 60 }} />

          <div className="about-intro">
            <h1>
              <span>Helping mission-driven organizations</span>
              <br />
              promote social good.
            </h1>
          </div>

          <div className="half-video-half-wysiwyg invert">
            <div className="module-content">
              <div className="video-content oembed">
                {/* eslint-disable-next-line @next/next/no-img-element -- static thumbnail stand-in for the embed */}
                <img
                  className="video-thumbnail"
                  src="/placeholders/card-5.svg"
                  alt=""
                  width={592}
                  height={296}
                />
              </div>
              <div className="wysiwyg-content">
                <p>
                  Placeholder copy for the introduction paragraph. This block describes the
                  studio&rsquo;s purpose in three short lines of body text at the standard size.
                </p>
                <p>
                  A second placeholder paragraph fills the longer middle slot. It runs to about four
                  lines beside the video thumbnail, so the column height matches the original layout
                  at the desktop width and wraps naturally on smaller screens.
                </p>
                <p>A short closing sentence rounds out the introduction in roughly two lines.</p>
              </div>
            </div>
          </div>

          <hr className="horizontal-space" style={{ height: 20 }} />

          <h3 className="module custom-heading team-heading">Our Team</h3>

          <TeamGrid members={members} />

          <div className="join-team">
            <h2>
              <span>
                <strong>Want to join our team?</strong>
              </span>
            </h2>
            <p>
              This placeholder paragraph invites designers, strategists and engineers to get in
              touch. It runs to about two centred lines above the call-to-action button at the
              desktop width.
            </p>
            <p>
              <Link href="/jobs" className="hs-button">
                Browse Job Openings
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
