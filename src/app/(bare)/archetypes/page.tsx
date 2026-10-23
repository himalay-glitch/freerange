import type { Metadata } from "next";
import { ArchetypeQuiz } from "@/components/templates/ArchetypeQuiz";

export const metadata: Metadata = { title: "Archetype Quiz" };

/** /archetypes — full-screen brand archetype quiz (no site chrome). */
export default function ArchetypesPage() {
  return <ArchetypeQuiz />;
}
