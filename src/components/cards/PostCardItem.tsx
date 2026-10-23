"use client";
/* eslint-disable @next/next/no-img-element -- plain <img> reproduces the original card markup */

import Link from "next/link";
import { Fragment, type SVGProps } from "react";
import { FacebookIcon, LinkedInIcon, TwitterIcon } from "@/components/icons";
import type { PostCard } from "@/types/content";
import type { CardItemState } from "./CardList";

export interface PostCardItemProps extends CardItemState {
  card: PostCard;
}

/** Simple envelope glyph for the e-mail share link (the theme used a Font Awesome envelope). */
function EnvelopeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 512 512" role="img" aria-label="Share by email" {...props}>
      <path d="M64 96h384c17.7 0 32 14.3 32 32v16L256 288 32 144v-16c0-17.7 14.3-32 32-32zm-32 96 224 144 224-144v192c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V192z" />
    </svg>
  );
}

function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Blog-post / podcast card: title + tags at rest; tag links, large title, summary, button and share row when expanded. */
export function PostCardItem({
  card,
  cardKey,
  expanded,
  collapsed,
  showDescription,
  onMouseEnter,
  onMouseLeave,
}: PostCardItemProps) {
  const className = ["card-list-item", "blog-post-card", expanded && "expanded", collapsed && "collapsed"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} data-card-key={cardKey} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Link className="card-list-item-link" href={card.href}>
        <img className="card-bg" src={card.image} alt="" />
        <div className="collapsed-info">
          <h2 className="title">{card.title}</h2>
          <p className="category">{card.tags.join(", ")}</p>
        </div>
      </Link>
      <div className="card-list-item-expanded-info expanded-info">
        <p>
          {card.tags.map((tag, index) => (
            <Fragment key={tag}>
              {index > 0 && ", "}
              <Link href={`/blog?tags=${tagSlug(tag)}`} rel="tag">
                {tag}
              </Link>
            </Fragment>
          ))}
        </p>
        <div className={showDescription ? "description show" : "description"}>
          <div>
            <Link href={card.href}>
              <h2 className="title">{card.title}</h2>
            </Link>
            <p className="summary">{card.excerpt}</p>
          </div>
          <Link href={card.href}>View Post</Link>
          <div className="social-share">
            <span>Share</span>
            <span className="hs_cos_wrapper hs_cos_wrapper_widget hs_cos_wrapper_type_social_sharing">
              <a href="#">
                <FacebookIcon aria-label="Share on Facebook" />
              </a>
              {" "}
              <a href="#">
                <LinkedInIcon aria-label="Share on LinkedIn" />
              </a>
              {" "}
              <a href="#">
                <TwitterIcon aria-label="Share on Twitter" />
              </a>
              {" "}
              <a href="#">
                <EnvelopeIcon />
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
