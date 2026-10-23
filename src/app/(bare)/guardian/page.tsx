import type { Metadata } from "next";
import { ArchetypeResult } from "@/components/templates/ArchetypeResult";

export const metadata: Metadata = { title: "Guardian" };

/** /guardian — archetype quiz result screen (no site chrome). */
export default function GuardianPage() {
  return <ArchetypeResult slug="guardian" />;
}
