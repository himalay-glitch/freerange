import type { Metadata } from "next";
import type { ContentEntry } from "@/lib/content";
import { JobTemplate } from "@/components/templates/JobTemplate";

export const metadata: Metadata = { title: "Preview: job" };

const entry: ContentEntry = {
  path: "/jobs/sample-role",
  url: "https://example.com/jobs/sample-role",
  type: "job",
  bodyClass: "body-wrapper hs-blog-post",
  title: "Sample Role Title",
  description: "Placeholder description for the job preview.",
  published: null,
  tags: [],
  wordCount: 0,
  modules: [],
};

export default function Page() {
  return (
    <div style={{ paddingTop: 182 }}>
      <JobTemplate entry={entry} bodyHtml={null} />
    </div>
  );
}
