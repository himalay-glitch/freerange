import type { ReactNode } from "react";
import type { ContentEntry } from "@/lib/content";
import "@/styles/post-templates.css";

/**
 * Shared frame for the post detail templates (blog post, case study, resource, job).
 *
 * Reproduces the original DOM:
 *   main.body-container-wrapper
 *     > .body-container.body-container--blog-post.body-container--custom-post-template.body-container--<variant>
 *       > .content-wrapper.container > article.blog-post.<variant>
 *       > (related posts section)
 */
export type PostVariant = "default-blog-post" | "case-study-post" | "resource-post" | "job-post";

/** Props every post template accepts. Body HTML is supplied by the page (no file reads in components). */
export interface PostTemplateProps {
  entry: ContentEntry;
  bodyHtml: string | null;
  /** Featured image URL; a placeholder from /placeholders is used when omitted. */
  image?: string;
  /** Slot for the related-posts card grid, injected by the page. */
  related?: ReactNode;
}

interface PostLayoutProps {
  variant: PostVariant;
  /** Class list for the <article>; the job template uses a bare `blog-post`. */
  articleClassName: string;
  children: ReactNode;
  /** Rendered after the content wrapper, inside `.body-container` (the related-posts section). */
  after?: ReactNode;
}

export function PostLayout({ variant, articleClassName, children, after }: PostLayoutProps) {
  return (
    <main id="main-content" className="body-container-wrapper">
      <div
        className={`body-container body-container--blog-post body-container--custom-post-template body-container--${variant}`}
      >
        <div className="content-wrapper container">
          <article className={articleClassName}>{children}</article>
        </div>
        {after}
      </div>
    </main>
  );
}

/** Renders owner-supplied rich text, or the placeholder body when none has been imported yet. */
export function PostBody({ bodyHtml, variant }: { bodyHtml: string | null; variant?: "job" }) {
  if (bodyHtml) {
    return <div className="post-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
  }
  return <PlaceholderBody variant={variant} />;
}

const PLACEHOLDER_PARAGRAPHS = [
  "This paragraph stands in for the article body. It runs long enough to show the measure, the 19px/28px body setting and the 32px paragraph spacing that the imported copy will inherit once it is dropped into the content folder.",
  "A second paragraph keeps the column rhythm honest. Headings, lists, links and images in the exported HTML pick up the same rules as this placeholder, so the page can be judged before any real content arrives.",
  "The third paragraph closes the section. Nothing here is drawn from the original site; it exists only so the layout, the sticky sidebar and the related-posts band can be reviewed in context.",
];

/**
 * Neutral placeholder used while the body export is missing: a section heading, three paragraphs,
 * a three-item list and a muted "pending import" note. Job posts use the original's h4 section labels.
 */
export function PlaceholderBody({ variant }: { variant?: "job" }) {
  const heading =
    variant === "job" ? (
      <h3 style={{ fontSize: 24, lineHeight: "32px", fontWeight: 400, color: "#308bf5" }}>Section heading</h3>
    ) : (
      <h3>Section heading</h3>
    );
  return (
    <div className="post-body post-body--placeholder">
      {heading}
      {PLACEHOLDER_PARAGRAPHS.map((text) => (
        <p key={text.slice(0, 24)}>{text}</p>
      ))}
      <ul>
        <li>First placeholder list item</li>
        <li>Second placeholder list item</li>
        <li>Third placeholder list item</li>
      </ul>
      <p className="post-body-pending">Body content pending import</p>
    </div>
  );
}

/** "Apr 16, 2021" from an ISO date; returns the input untouched when it is not parseable. */
export function formatPostDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
