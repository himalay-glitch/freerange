import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingPage } from "@/components/templates/ListingPage";
import { FILTER_GROUPS, makeDemoItems } from "@/lib/data/listing-demo";

export const metadata: Metadata = {
  title: "Blog listing preview — Free Range",
};

/** Isolated preview of the /blog listing: hero headline, filters, 24 demo posts (182px stands in for the header). */
export default function ListingBlogPreviewPage() {
  return (
    <main id="main-content" className="body-container-wrapper" style={{ paddingTop: 182 }}>
      <Suspense fallback={null}>
        <ListingPage
          variant="blog"
          headline={
            <>
              <strong>We imagine</strong> what&rsquo;s next and bring new ideas to life through product thinking and
              creative storytelling.
            </>
          }
          filterGroups={FILTER_GROUPS.blog}
          items={makeDemoItems("blog", 24)}
        />
      </Suspense>
    </main>
  );
}
