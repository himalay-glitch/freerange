import type { Metadata } from "next";
import type { ContentEntry } from "@/lib/content";
import { CaseStudyTemplate } from "@/components/templates/CaseStudyTemplate";
import { RelatedPostCard } from "@/components/templates/RelatedPosts";

export const metadata: Metadata = { title: "Preview: case study" };

const entry: ContentEntry = {
  path: "/case-studies/sample-client",
  url: "https://example.com/case-studies/sample-client",
  type: "case-study",
  bodyClass: "body-wrapper hs-blog-post",
  title: "Positioning a Placeholder Brand for Growth",
  description:
    "Placeholder overview copy for the case study preview. It introduces the client, the challenge and the shape of the engagement before the four step sections walk through the work.",
  published: null,
  tags: ["Storytelling", "Design"],
  wordCount: 0,
  modules: [],
};

const related = [1, 2, 3, 4].map((n) => (
  <RelatedPostCard
    key={n}
    href="/case-studies"
    title={`Related project placeholder ${n}`}
    image={`/placeholders/card-${n + 4}.svg`}
    logo={`/placeholders/client-logo-${n + 1}.svg`}
  />
));

export default function Page() {
  return (
    <div style={{ paddingTop: 182 }}>
      <CaseStudyTemplate
        entry={entry}
        bodyHtml={null}
        client="Sample Client"
        services={["Storytelling", "Design", "Workshops", "Product Innovation"]}
        industries={["Ventures", "Nonprofits + Social", "SMBs"]}
        causes={["Healthcare"]}
        related={related}
      />
    </div>
  );
}
