import { PostLayout, PostBody, type PostTemplateProps } from "./PostLayout";
import { RelatedPosts } from "./RelatedPosts";
import { ResourceDownloadForm } from "./ResourceDownloadForm";

export type ResourceTemplateProps = PostTemplateProps;

const FORM_ID = "resource-form";

/**
 * Resource (downloadable): darkened featured image with the title highlighted over it, the body on the
 * left and the sticky download form on the right, overlapping the bottom of the banner.
 */
export function ResourceTemplate({ entry, bodyHtml, image = "/placeholders/card-3.svg", related }: ResourceTemplateProps) {
  return (
    <PostLayout
      variant="resource-post"
      articleClassName="blog-post resource-post"
      after={<RelatedPosts title="Related Posts">{related}</RelatedPosts>}
    >
      <div className="custom-post-template-featured-image resource-post-featured-image">
        <img className="featured-image full-width enable-gradient" src={image} alt="" />
        <div className="custom-post-template-title resource-post-title">
          <h1>
            <span>{entry.title}</span>
          </h1>
        </div>
      </div>

      <div className="get-the-resource">
        <a href={`#${FORM_ID}`} className="hs-button">
          Get the resource
        </a>
      </div>

      <div className="blog-post__body resource-post__body row">
        <div className="custom-post-template-body resource-post-body col-8">
          <PostBody bodyHtml={bodyHtml} />
        </div>

        <div className="custom-post-template-sidebar resource-post-sidebar col-4">
          <div>
            <h2 className="title">{entry.title}</h2>
            <ResourceDownloadForm id={FORM_ID} />
          </div>
        </div>
      </div>
    </PostLayout>
  );
}
