import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllEntries, getEntry, getBodyHtml, getRelated, templateFor, type ContentEntry } from "@/lib/content";
import { placeholderImage, relatedRow, toCaseStudyCard, toPostCard } from "@/lib/cards";
import { CardList } from "@/components/cards/CardList";
import { BlogPostTemplate } from "@/components/templates/BlogPostTemplate";
import { CaseStudyTemplate } from "@/components/templates/CaseStudyTemplate";
import { ResourceTemplate } from "@/components/templates/ResourceTemplate";
import { JobTemplate } from "@/components/templates/JobTemplate";
import RdLabPage from "@/components/templates/RdLabPage";
import { ListingPage } from "@/components/templates/ListingPage";
import { FILTER_GROUPS, listingItems } from "@/lib/listing-data";
import { Suspense } from "react";
import { getCollection } from "@/lib/content";
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
    case "blog-post":
      return (
        <BlogPostTemplate
          entry={entry}
          bodyHtml={bodyHtml}
          image={placeholderImage(entry.path, "card")}
          author="Free Range Team"
          related={<CardList variant="post" rows={relatedRow(getRelated(entry, 4).map((e) => toPostCard(e)))} />}
        />
      );
    case "case-study": {
      const card = toCaseStudyCard(entry);
      return (
        <CaseStudyTemplate
          entry={entry}
          bodyHtml={bodyHtml}
          image={card.image}
          logo={card.logo}
          client={card.client}
          services={["Storytelling", "Design"]}
          industries={["Nonprofits"]}
          causes={["Education"]}
          related={<CardList variant="case-study" rows={relatedRow(getRelated(entry, 4).map((e) => toCaseStudyCard(e)))} />}
        />
      );
    }
    case "resource":
      return (
        <ResourceTemplate
          entry={entry}
          bodyHtml={bodyHtml}
          image={placeholderImage(entry.path, "card")}
          related={<CardList variant="post" rows={relatedRow(getRelated(entry, 4).map((e) => toPostCard(e)))} />}
        />
      );
    case "job":
      return <JobTemplate entry={entry} bodyHtml={bodyHtml} />;
    case "blog-listing":
      return (
        <Suspense fallback={<main id="main-content" className="body-container-wrapper" />}>
          <ListingPage
            variant="blog"
            headline={<><strong>We imagine</strong> what comes next and bring new ideas to life, combining product thinking with the craft of creative storytelling.</>}
            filterGroups={FILTER_GROUPS.blog}
            items={listingItems("blog")}
          />
        </Suspense>
      );
    case "case-studies-listing":
      return (
        <Suspense fallback={<main id="main-content" className="body-container-wrapper" />}>
          <ListingPage variant="case-studies" filterGroups={FILTER_GROUPS["case-studies"]} items={listingItems("case-studies")} />
        </Suspense>
      );
    case "resources-listing":
      return (
        <Suspense fallback={<main id="main-content" className="body-container-wrapper" />}>
          <ListingPage variant="resources" filterGroups={FILTER_GROUPS.resources} items={listingItems("resources")} />
        </Suspense>
      );
    case "rd-lab": {
      const featured = getCollection("case-study").slice(0, 3).map((e, i) => ({ ...toCaseStudyCard(e), wide: i === 2 }));
      return <RdLabPage featured={<CardList variant="case-study" rows={[featured]} />} />;
    }
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
