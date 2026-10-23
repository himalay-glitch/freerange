import type { Metadata } from "next";
import { PageShell, Section } from "@/components/site/PageShell";
import { CardList } from "@/components/cards/CardList";
import { PODCAST_ROWS } from "@/lib/data/podcast-cards";

export const metadata: Metadata = { title: "The Free Ranger Podcast" };

/** /podcast — custom heading, short description and the podcast card row with a "View More Resources" button. */
export default function PodcastPage() {
  return (
    <PageShell>
      <Section n={1}>
        <h2 className="module custom-heading" style={{ color: "#4a4a4a", borderBottomWidth: 2, borderBottomColor: "#ff4e00", letterSpacing: "-0.5px" }}>
          The Free Ranger Podcast
        </h2>
        <p>Conversations about storytelling, innovation and doing good work.</p>
      </Section>
      <Section n={3}>
        <CardList variant="post" rows={PODCAST_ROWS} viewMore={{ label: "View More Resources", href: "/resources" }} />
      </Section>
    </PageShell>
  );
}
