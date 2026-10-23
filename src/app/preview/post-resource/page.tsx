import type { Metadata } from "next";
import type { ContentEntry } from "@/lib/content";
import { ResourceTemplate } from "@/components/templates/ResourceTemplate";
import { RelatedPostCard } from "@/components/templates/RelatedPosts";

export const metadata: Metadata = { title: "Preview: resource" };

const entry: ContentEntry = {
  path: "/resources/sample-resource",
  url: "https://example.com/resources/sample-resource",
  type: "resource",
  bodyClass: "body-wrapper hs-blog-post",
  title: "Sample Resource: A Placeholder Workshop",
  description: "Placeholder description for the resource preview.",
  published: null,
  tags: ["Workshops", "Downloads"],
  wordCount: 0,
  modules: [],
};

const related = [1, 2, 3, 4].map((n) => (
  <RelatedPostCard key={n} href="/resources" title={`Related resource placeholder ${n}`} image={`/placeholders/card-${n + 4}.svg`} />
));

export default function Page() {
  return (
    <div style={{ paddingTop: 182 }}>
      <ResourceTemplate entry={entry} bodyHtml={null} related={related} />
    </div>
  );
}
