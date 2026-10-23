import type { Metadata } from "next";
import { PodcastSection } from "@/components/home/PodcastSection";
import { WorkSection } from "@/components/home/WorkSection";

export const metadata: Metadata = {
  title: "Cards preview",
};

/** Isolated preview of the card-list module: the "Work" grid followed by the podcast row. */
export default function CardsPreviewPage() {
  return (
    <main className="container" style={{ paddingTop: 150 }}>
      <WorkSection />
      <PodcastSection />
    </main>
  );
}
