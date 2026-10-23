import JobsListingPage from "@/components/templates/JobsListingPage";

/** Isolated preview of the Jobs listing template (182px = height of the fixed site header). */
export default function JobsPreviewPage() {
  return (
    <div style={{ paddingTop: 182 }}>
      <JobsListingPage />
    </div>
  );
}
