import Services from "@/components/home/Services";

/** Standalone preview of the homepage Services section (150px top padding stands in for the header). */
export default function ServicesPreviewPage() {
  return (
    <main className="container" style={{ paddingTop: 150 }}>
      <Services />
    </main>
  );
}
