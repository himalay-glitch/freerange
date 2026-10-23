import type { Metadata } from "next";

import { Hero } from "@/components/home/Hero";

export const metadata: Metadata = { title: "Hero preview" };

/**
 * Standalone preview of the homepage hero. The top padding stands in for the fixed
 * site header; the tall placeholder below lets the scroll-pausing be tested.
 */
export default function HeroPreviewPage() {
  return (
    <main style={{ paddingTop: 120 }}>
      <Hero />
      <div style={{ height: 1500 }} aria-hidden="true" />
    </main>
  );
}
