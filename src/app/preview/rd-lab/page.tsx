import RdLabPage from "@/components/templates/RdLabPage";

/**
 * Isolated preview of the R&D Lab page template. The 182px top padding stands in for the fixed
 * header (banner + nav) so section offsets match the live page (hero banner at y = 198).
 * No `featured` grid is passed, so the case-study slot renders its placeholder box.
 */
export default function RdLabPreviewPage() {
  return (
    <main id="main-content" className="body-container-wrapper" style={{ paddingTop: 182 }}>
      <RdLabPage />
    </main>
  );
}
