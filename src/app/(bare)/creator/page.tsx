import type { Metadata } from "next";
import { ArchetypeResult } from "@/components/templates/ArchetypeResult";

export const metadata: Metadata = { title: "Creator" };

/** /creator — archetype quiz result screen (no site chrome). */
export default function CreatorPage() {
  return <ArchetypeResult slug="creator" />;
}
