import type { Metadata } from "next";
import { ArchetypeResult } from "@/components/templates/ArchetypeResult";

export const metadata: Metadata = { title: "Entertainer" };

/** /entertainer — archetype quiz result screen (no site chrome). */
export default function EntertainerPage() {
  return <ArchetypeResult slug="entertainer" />;
}
