import LegalPage from "@/components/templates/LegalPage";

/** Isolated preview of the legal / rich-text template (182px = height of the fixed site header). */
export default function LegalPreviewPage() {
  return (
    <div style={{ paddingTop: 182 }}>
      <LegalPage title="Privacy Policy" lastUpdated="September 09, 2021" />
    </div>
  );
}
