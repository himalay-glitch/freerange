import type { Metadata } from "next";
import { PageShell, Section, Spacer } from "@/components/site/PageShell";
import { LetsTalk } from "@/components/home/LetsTalk";

export const metadata: Metadata = { title: "Contact Us" };

/** /contact-us — a 54px spacer (hidden on mobile) followed by the consultation form module titled "Contact Us". */
export default function ContactPage() {
  return (
    <PageShell>
      <Section n={1}><Spacer height={54} className="hide-on-mobile" /></Section>
      <Section n={3}><LetsTalk title="Contact Us" /></Section>
    </PageShell>
  );
}
