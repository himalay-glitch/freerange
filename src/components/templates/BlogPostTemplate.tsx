import { PostLayout, PostBody, formatPostDate, type PostTemplateProps } from "./PostLayout";
import { RelatedPosts } from "./RelatedPosts";
import { ShareLinks } from "./ShareLinks";

export interface BlogPostTemplateProps extends PostTemplateProps {
  /** Byline shown under the title in the sidebar band. */
  author?: string;
  /** Pre-formatted date ("Apr 16, 2021"); falls back to `entry.published`. */
  date?: string;
  /** Optional italic intro paragraph rendered above the body. */
  intro?: string;
}

/** Default blog post: featured image, sticky sidebar (title band, byline, share) and the body column. */
export function BlogPostTemplate({
  entry,
  bodyHtml,
  image = "/placeholders/card-1.svg",
  related,
  author = "Free Range",
  date,
  intro,
}: BlogPostTemplateProps) {
  const dateLabel = date ?? formatPostDate(entry.published);

  return (
    <PostLayout
      variant="default-blog-post"
      articleClassName="blog-post default-blog-post"
      after={<RelatedPosts title="Related Posts">{related}</RelatedPosts>}
    >
      <div className="custom-post-template-featured-image default-blog-post-featured-image">
        <img className="featured-image full-width" src={image} alt="" />
      </div>

      <div className="blog-post__body row">
        <div className="custom-post-template-sidebar default-blog-post-sidebar col-4">
          <div className="custom-post-template-title default-blog-post-title">
            <h1>{entry.title}</h1>
            <div className="autor-and-date">
              <span className="author">{author}</span>
              {dateLabel ? <span className="date">{dateLabel}</span> : null}
            </div>
          </div>
          <div className="custom-post-template-info default-blog-post-info">
            <table>
              <tbody>
                <tr>
                  <td>Share</td>
                  <td className="social-sharing-links">
                    <ShareLinks url={entry.url} title={entry.title} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="custom-post-template-body default-blog-post-body col-8">
          {intro ? (
            <p>
              <em>{intro}</em>
            </p>
          ) : null}
          <PostBody bodyHtml={bodyHtml} />
        </div>
      </div>
    </PostLayout>
  );
}
