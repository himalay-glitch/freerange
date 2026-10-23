import { CardList } from "@/components/cards/CardList";
import { PODCAST_ROWS } from "@/lib/data/podcast-cards";

/**
 * Homepage "The Free Ranger Podcast" section. The original is three stacked modules: a
 * "custom heading" (an h4 with inline colour/border), a rich-text paragraph and the card list.
 */
export function PodcastSection() {
  return (
    <>
      <h4
        className="module custom-heading"
        style={{ color: "#4a4a4a", borderBottomWidth: 2, borderBottomColor: "#ff4e00", letterSpacing: "-0.5px" }}
      >
        The Free Ranger Podcast
      </h4>
      <p>Telling the stories that matter.</p>
      <CardList variant="post" rows={PODCAST_ROWS} viewMore={{ label: "Browse All Episodes", href: "/resources" }} />
    </>
  );
}
