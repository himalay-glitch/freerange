import type { Metadata } from "next";
import { PageShell, Section, Spacer } from "@/components/site/PageShell";
import { Hero } from "@/components/home/Hero";
import { WorkSection } from "@/components/home/WorkSection";
import Approach from "@/components/home/Approach";
import Services from "@/components/home/Services";
import { PodcastSection } from "@/components/home/PodcastSection";
import { Testimonials } from "@/components/home/Testimonials";
import { LetsTalk } from "@/components/home/LetsTalk";

export const metadata: Metadata = { title: "Free Range" };

/** Homepage — module order and spacing mirror the original drag-and-drop layout. */
export default function Home() {
  return (
    <PageShell variant="default" className="home">
      <Section n={1}><Hero /></Section>
      <Section n={3}><WorkSection /></Section>
      <Section n={5}><Approach /></Section>
      <Section n={7}><Services /></Section>
      <Section n={9}><Spacer height={80} /></Section>
      <Section n={11}><PodcastSection /></Section>
      <Section n={16}><Spacer height={80} /></Section>
      <Section n={18}><Testimonials /></Section>
      <Section n={20}><Spacer height={80} /></Section>
      <Section n={22}><LetsTalk /></Section>
    </PageShell>
  );
}
