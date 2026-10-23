import type { Metadata } from "next";
import { ArchetypeResult } from "@/components/templates/ArchetypeResult";

export const metadata: Metadata = { title: "Innovator" };

/** /innovator — archetype quiz result screen (no site chrome). */
export default function InnovatorPage() {
  return <ArchetypeResult slug="innovator" />;
}
