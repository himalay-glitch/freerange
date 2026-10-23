import { PostLayout, PostBody, type PostTemplateProps } from "./PostLayout";
import { JobApplyForm } from "./JobApplyForm";

export type JobTemplateProps = Omit<PostTemplateProps, "image" | "related">;

/**
 * Job post: no featured image; highlighted title, full-width body and the centred 700px "Apply" form.
 * The original job page has no related-posts band.
 */
export function JobTemplate({ entry, bodyHtml }: JobTemplateProps) {
  return (
    <PostLayout variant="job-post" articleClassName="blog-post">
      <h1 className="job-post-title">
        <span>{entry.title}</span>
      </h1>
      <div className="blog-post__body">
        <PostBody bodyHtml={bodyHtml} variant="job" />
        <div className="job-form">
          <h2 className="title">Apply</h2>
          <JobApplyForm />
        </div>
      </div>
    </PostLayout>
  );
}
