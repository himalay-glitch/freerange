import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllEntries, getEntry, getBodyHtml, templateFor, type ContentEntry } from "@/lib/content";
import { PageShell, Section, Spacer } from "@/components/site/PageShell";
import AboutPage from "@/components/templates/AboutPage";
import JobsListingPage from "@/components/templates/JobsListingPage";
import LegalPage from "@/components/templates/LegalPage";

/** Paths that have their own route files (home, contact, podcast) or render without site chrome (quiz/results). */
const EXPLICIT = new Set(["/", "/contact-us", "/podcast", "/archetypes", "/creator", "/leader", "/entertainer", "/guardian", "/innovator", "/sage"]);


export function generateStaticParams() {
  return getAllEntries()
    .filter((e) => !EXPLICIT.has(e.path))
    .map((e) => ({ slug: e.path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry("/" + slug.join("/"));
  return { title: entry?.title || "Free Range", description: entry?.description };
}

/** Temporary stand-in used until a template's builder lands; keeps every route building. */
function PendingTemplate({ entry, template }: { entry: ContentEntry; template: string }) {
  return (
    <PageShell>
      <Section n={1}><Spacer height={60} /></Section>
      <Section n={3}>
        <h2 className="title">{entry.title}</h2>
        <p>{entry.description || "Template pending."}</p>
        <p style={{ fontSize: 16, color: "#494a52" }}>
          <em>{template} template — body content pending import.</em>
        </p>
      </Section>
      <Section n={5}><Spacer height={60} /></Section>
    </PageShell>
  );
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = "/" + slug.join("/");
  const entry = getEntry(path);
  if (!entry || EXPLICIT.has(path)) notFound();
  const template = templateFor(entry);
  const bodyHtml = getBodyHtml(entry);
  switch (template) {
    case "about":
      return <AboutPage />;
    case "jobs-listing":
      return <JobsListingPage />;
    case "legal":
      return <LegalPage title={entry.title} bodyHtml={bodyHtml ?? undefined} />;
    default:
      return <PendingTemplate entry={entry} template={template} />;
  }
}
