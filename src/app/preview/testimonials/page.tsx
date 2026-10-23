import { Testimonials } from "@/components/home/Testimonials";

/** Isolated preview of the homepage Testimonials slider (150px top padding stands in for the header). */
export default function TestimonialsPreviewPage() {
  return (
    <main className="container" style={{ paddingTop: 150 }}>
      <Testimonials />
    </main>
  );
}
