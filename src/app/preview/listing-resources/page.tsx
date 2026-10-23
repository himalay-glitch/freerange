import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingPage } from "@/components/templates/ListingPage";
import { FILTER_GROUPS, makeDemoItems } from "@/lib/data/listing-demo";

export const metadata: Metadata = {
  title: "Resources listing preview — Free Range",
};

/** Isolated preview of the /resources listing: no hero, Services + Category filters, 24 demo resources. */
export default function ListingResourcesPreviewPage() {
  return (
    <main id="main-content" className="body-container-wrapper" style={{ paddingTop: 182 }}>
      <Suspense fallback={null}>
        <ListingPage
          variant="resources"
          filterGroups={FILTER_GROUPS.resources}
          items={makeDemoItems("resources", 24)}
        />
      </Suspense>
    </main>
  );
}
