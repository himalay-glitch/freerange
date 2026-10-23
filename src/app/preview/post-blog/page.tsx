import type { Metadata } from "next";
import type { ContentEntry } from "@/lib/content";
import { BlogPostTemplate } from "@/components/templates/BlogPostTemplate";
import { RelatedPostCard } from "@/components/templates/RelatedPosts";

export const metadata: Metadata = { title: "Preview: blog post" };

const entry: ContentEntry = {
  path: "/blog/sample-post",
  url: "https://example.com/blog/sample-post",
  type: "blog",
  bodyClass: "body-wrapper hs-blog-post",
  title: "A Sample Blog Post Title Long Enough to Wrap in the Sidebar",
  description: "Placeholder description for the blog post preview.",
  published: "2021-04-16",
  tags: ["Storytelling", "Articles"],
  wordCount: 0,
  modules: [],
};

const related = [1, 2, 3, 4].map((n) => (
  <RelatedPostCard key={n} href="/blog" title={`Related post placeholder ${n}`} image={`/placeholders/card-${n + 4}.svg`} />
));

export default function Page() {
  return (
    <div style={{ paddingTop: 182 }}>
      <BlogPostTemplate
        entry={entry}
        bodyHtml={null}
        author="Jane Placeholder"
        intro="This italic intro paragraph stands in for the editor’s note that some posts open with."
        related={related}
      />
    </div>
  );
}
