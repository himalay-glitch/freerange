import { Fragment } from "react";
import Link from "next/link";
import { PostLayout, type PostTemplateProps } from "./PostLayout";
import { RelatedPosts } from "./RelatedPosts";
import { ShareLinks } from "./ShareLinks";
import { CaseStudyNav } from "./CaseStudyNav";

export interface CaseStudyTemplateProps extends PostTemplateProps {
  /** Client name shown in the sidebar title band. */
  client: string;
  services: string[];
  industries: string[];
  causes: string[];
  /** White client logo laid over the top-left of the featured image. */
  logo?: string;
}

const STEPS = [
  { id: "understand", number: "1", label: "Understand", alignRight: false, image: "/placeholders/square-1.svg" },
  { id: "explore", number: "2", label: "Explore", alignRight: true, image: "/placeholders/square-2.svg" },
  { id: "create", number: "3", label: "Create", alignRight: false, image: "/placeholders/square-3.svg" },
  { id: "launch", number: "4", label: "Launch", alignRight: true, image: "/placeholders/square-4.svg" },
];

const STEP_COPY: Record<string, string[]> = {
  understand: [
    "Placeholder copy for the research phase. It describes how the team gathered context, ran workshops and framed the problem before any design work started.",
    "A second paragraph keeps the measure visible so the heading rule, the paragraph spacing and the image below can be checked against the reference.",
  ],
  explore: [
    "Placeholder copy for the exploration phase, covering the directions that were tried, the ideas that were kept and the ones that were set aside.",
    "Right-aligned step headings alternate with left-aligned ones, as in the original layout.",
  ],
  create: [
    "Placeholder copy for the build phase: identity, website, content and the supporting assets that bring the strategy to life.",
    "Images in this column scale to the 781px measure and keep their aspect ratio.",
  ],
  launch: [
    "Placeholder copy for the launch phase, summarising the outcome and the ongoing relationship with the client.",
  ],
};

function tagSlug(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function TagList({ values }: { values: string[] }) {
  return (
    <>
      {values.map((value, index) => (
        <Fragment key={value}>
          {index > 0 ? ", " : null}
          <Link href={`/case-studies?tag=${tagSlug(value)}`}>{value}</Link>
        </Fragment>
      ))}
    </>
  );
}

/**
 * Case study: featured image with client logo, sticky sidebar (client, services/industries/causes/share
 * table, section navigation) and the body with the Overview title and four numbered step sections.
 */
export function CaseStudyTemplate({
  entry,
  bodyHtml,
  image = "/placeholders/card-2.svg",
  related,
  client,
  services,
  industries,
  causes,
  logo = "/placeholders/client-logo-1.svg",
}: CaseStudyTemplateProps) {
  return (
    <PostLayout
      variant="case-study-post"
      articleClassName="blog-post case-study-post"
      after={<RelatedPosts title="Related Projects">{related}</RelatedPosts>}
    >
      <div className="custom-post-template-featured-image case-study-post-featured-image">
        <img className="featured-image full-width" src={image} alt="" />
        <div className="case-study-post-logo">
          <img src={logo} alt={client} />
        </div>
      </div>

      <div className="blog-post__body case-study-post__body row">
        <div className="custom-post-template-sidebar case-study-post-sidebar col-4">
          <div className="custom-post-template-title case-study-title">
            <h1>{client}</h1>
          </div>
          <div className="custom-post-template-info case-study-info">
            <table>
              <tbody>
                <tr>
                  <td>Services</td>
                  <td>
                    <TagList values={services} />
                  </td>
                </tr>
                <tr>
                  <td>Industries</td>
                  <td className="disable-links">
                    <TagList values={industries} />
                  </td>
                </tr>
                <tr>
                  <td>Causes</td>
                  <td>
                    <TagList values={causes} />
                  </td>
                </tr>
                <tr>
                  <td>Share</td>
                  <td className="social-sharing-links">
                    <ShareLinks url={entry.url} title={entry.title} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <CaseStudyNav />
        </div>

        <div className="custom-post-template-body case-study-post-body col-8">
          <h2 className="title" id="overview">
            Overview
          </h2>
          {bodyHtml ? (
            <div className="post-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
          ) : (
            <div className="post-body post-body--placeholder">
              <h2>{entry.title}</h2>
              <p>
                {entry.description ||
                  "Placeholder overview copy. It introduces the client, the challenge they brought to the studio and the shape of the engagement, before the four step sections below walk through the work."}
              </p>
              <p>
                A second overview paragraph keeps the column rhythm honest until the exported case study body is
                imported into the content folder.
              </p>
              {STEPS.map((step) => (
                <Fragment key={step.id}>
                  <div className="mt-5">
                    <div id={step.id}>
                      <h4
                        className={`module custom-heading${step.alignRight ? " align-right" : ""}`}
                        data-number={step.number}
                      >
                        {step.label}
                      </h4>
                    </div>
                  </div>
                  {STEP_COPY[step.id].map((text) => (
                    <p key={text.slice(0, 24)}>{text}</p>
                  ))}
                  <p>
                    <img src={step.image} alt="" width={781} />
                  </p>
                </Fragment>
              ))}
              <p className="post-body-pending">Body content pending import</p>
            </div>
          )}
        </div>
      </div>
    </PostLayout>
  );
}
