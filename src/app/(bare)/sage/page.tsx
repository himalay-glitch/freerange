import type { Metadata } from "next";
import { ArchetypeResult } from "@/components/templates/ArchetypeResult";

export const metadata: Metadata = { title: "Sage" };

/** /sage — archetype quiz result screen (no site chrome). */
export default function SagePage() {
  return <ArchetypeResult slug="sage" />;
}
