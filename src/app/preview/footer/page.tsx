import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Footer preview — Free Range",
};

/** Isolated preview of the site footer below a short placeholder block. */
export default function FooterPreviewPage() {
  return (
    <>
      <main id="main-content" className="body-container-wrapper">
        <div className="container" style={{ padding: "80px 12px" }}>
          <h2 className="title">Footer preview</h2>
          <p>Placeholder page content. The site footer renders below.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
