import type { ReactNode } from "react";
import Link from "next/link";

interface RelatedPostsProps {
  /** "Related Posts" / "Related Projects" */
  title: string;
  /** The card grid, injected by the page. */
  children?: ReactNode;
}

/**
 * Full-width related posts band under the article:
 * section.blog-related-posts > .content-wrapper.container > h2.title + .blog-related-posts__list
 */
export function RelatedPosts({ title, children }: RelatedPostsProps) {
  return (
    <section className="blog-related-posts">
      <div className="content-wrapper container">
        <h2 className="title">{title}</h2>
        <div className="blog-related-posts__list">{children}</div>
      </div>
    </section>
  );
}

interface RelatedPostCardProps {
  href: string;
  title: string;
  image: string;
  /** Optional logo centred over the image (case studies). */
  logo?: string;
}

/**
 * The theme's native related-post tile (`.blog-related-posts__post`): a 390px image with the
 * title pinned to the bottom. Used by the preview routes until the card-list grid is wired in.
 */
export function RelatedPostCard({ href, title, image, logo }: RelatedPostCardProps) {
  return (
    <div className="blog-related-posts__post">
      <Link href={href} className="blog-related-posts__post-image-wrapper">
        <img className="blog-related-posts__image" src={image} alt="" />
        {logo ? <img className="blog-related-posts__logo" src={logo} alt="" /> : null}
      </Link>
      <div className="blog-related-posts__content">
        <h3>
          <Link href={href}>{title}</Link>
        </h3>
      </div>
    </div>
  );
}
