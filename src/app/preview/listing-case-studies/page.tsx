import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingPage } from "@/components/templates/ListingPage";
import { FILTER_GROUPS, makeDemoItems } from "@/lib/data/listing-demo";

export const metadata: Metadata = {
  title: "Case studies listing preview — Free Range",
};

/** Isolated preview of the /case-studies listing: no hero, three filter groups, 24 demo case studies. */
export default function ListingCaseStudiesPreviewPage() {
  return (
    <main id="main-content" className="body-container-wrapper" style={{ paddingTop: 182 }}>
      <Suspense fallback={null}>
        <ListingPage
          variant="case-studies"
          filterGroups={FILTER_GROUPS["case-studies"]}
          items={makeDemoItems("case-studies", 24)}
        />
      </Suspense>
    </main>
  );
}
