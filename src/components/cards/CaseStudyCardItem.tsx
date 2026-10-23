"use client";
/* eslint-disable @next/next/no-img-element -- plain <img> reproduces the original card markup */

import Link from "next/link";
import type { CaseStudyCard } from "@/types/content";
import type { CardItemState } from "./CardList";

export interface CaseStudyCardItemProps extends CardItemState {
  card: CaseStudyCard;
}

/** Work / case-study card: client logo + impact statement at rest, logo + title + summary + button when expanded. */
export function CaseStudyCardItem({
  card,
  cardKey,
  expanded,
  collapsed,
  showDescription,
  onMouseEnter,
  onMouseLeave,
}: CaseStudyCardItemProps) {
  const className = ["card-list-item", expanded && "expanded", collapsed && "collapsed"].filter(Boolean).join(" ");

  return (
    <div className={className} data-card-key={cardKey} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Link className="card-list-item-link" href={card.href}>
        <img className="card-bg" src={card.image} alt="" />
        <div className="collapsed-info">
          {card.logo && (
            <div className="logo">
              <img src={card.logo} alt={card.client} title={card.client} />
            </div>
          )}
          <p className="category impact-statement">{card.title}</p>
        </div>
      </Link>
      <div className="card-list-item-expanded-info expanded-info">
        {card.logo && <img src={card.logo} alt={card.client} title={card.client} />}
        <p>{card.title}</p>
        <div className={showDescription ? "description show" : "description"}>
          <div>
            <p className="summary">{card.description}</p>
          </div>
          <Link href={card.href}>View Case Study</Link>
        </div>
      </div>
    </div>
  );
}
