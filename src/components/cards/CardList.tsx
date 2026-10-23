"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { CaseStudyCard, PostCard } from "@/types/content";
import { CaseStudyCardItem } from "./CaseStudyCardItem";
import { PostCardItem } from "./PostCardItem";
import "@/styles/card-list.css";

/**
 * Delay before a hovered card expands. The theme's `cardList` plugin waits this long and only
 * expands if the pointer is still over the card, so quick sweeps across a row do nothing.
 */
const HOVER_DELAY_MS = 100;
/** Below this width the theme's "xsmall/small" breakpoints apply: cards stack and never expand. */
const HOVER_MIN_WIDTH = 1000;

export interface ViewMoreLink {
  label: string;
  href: string;
}

/** Hover state + handlers handed to each card item by the list. */
export interface CardItemState {
  /** Rendered as `data-card-key` on the item so the shared hover handlers know which card fired */
  cardKey: string;
  expanded: boolean;
  collapsed: boolean;
  /** `.description.show`: the summary/button block fades in slightly after the card expands */
  showDescription: boolean;
  onMouseEnter: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (event: MouseEvent<HTMLDivElement>) => void;
}

interface CommonProps {
  /** Section title rendered as the module's orange-underlined `h2.title` */
  title?: string;
  /** Rich text under the title (inline highlights allowed) */
  description?: ReactNode;
  /** "See All …" button rendered in the absolutely positioned `.view-more` row */
  viewMore?: ViewMoreLink;
}

export type CardListProps = CommonProps &
  ({ variant: "case-study"; rows: CaseStudyCard[][] } | { variant: "post"; rows: PostCard[][] });

function hoverEnabled() {
  return typeof window !== "undefined" && window.innerWidth >= HOVER_MIN_WIDTH;
}

/** A single cancellable delayed call (the hover-intent timer), cleared on unmount. */
function useDelayedCall() {
  const timer = useRef<number | null>(null);
  const cancel = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);
  const schedule = useCallback(
    (callback: () => void, delay: number) => {
      cancel();
      timer.current = window.setTimeout(() => {
        timer.current = null;
        callback();
      }, delay);
    },
    [cancel],
  );
  useEffect(() => cancel, [cancel]);
  return { schedule, cancel };
}

/**
 * Rows of hover-expanding cards (one `.card-list` per row). Hovering a card expands it and
 * collapses its row siblings; the markup and class names mirror the original HubSpot module so
 * `src/styles/card-list.css` applies unchanged.
 */
export function CardList(props: CardListProps) {
  const { title, description, viewMore } = props;
  // Keys are `${row}:${index}`; only one card can be expanded at a time.
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [descriptionKey, setDescriptionKey] = useState<string | null>(null);
  const hoverTimer = useDelayedCall();

  const enterItem = (event: MouseEvent<HTMLDivElement>) => {
    if (!hoverEnabled()) return;
    const item = event.currentTarget;
    const key = item.dataset.cardKey;
    if (!key) return;
    hoverTimer.schedule(() => {
      if (item.matches(":hover")) {
        setExpandedKey(key);
        setDescriptionKey(key);
      }
    }, HOVER_DELAY_MS);
  };

  const leaveItem = (event: MouseEvent<HTMLDivElement>) => {
    hoverTimer.cancel();
    setDescriptionKey(null);
    // Moving into the gap between cards (relatedTarget is the .card-list) keeps the row as is;
    // moving anywhere else resets it, as the original does.
    const next = event.relatedTarget;
    if (!(next instanceof Element && next.classList.contains("card-list"))) {
      setExpandedKey(null);
    }
  };

  const leaveList = () => {
    hoverTimer.cancel();
    setExpandedKey(null);
    setDescriptionKey(null);
  };

  const renderRows = <T extends { slug: string; wide?: boolean }>(
    rows: T[][],
    renderItem: (card: T, state: CardItemState) => ReactNode,
  ) =>
    rows.map((row, rowIndex) => {
      const perRow = row.length >= 4 ? 4 : 3;
      // In a three-up row the CSS widens the last card, or the first one when the row is "flipped".
      const flip = perRow === 3 && row.length > 1 && Boolean(row[0].wide) && !row[row.length - 1].wide;
      const rowExpanded = expandedKey !== null && expandedKey.startsWith(`${rowIndex}:`);
      const className = [
        "card-list",
        `items-per-row-${perRow}`,
        flip && "flip",
        rowExpanded && "has-item-expanded",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div key={rowIndex} className={className} data-items={row.length} onMouseLeave={leaveList}>
          {row.map((card, index) => {
            const key = `${rowIndex}:${index}`;
            const expanded = expandedKey === key;
            return (
              <Fragment key={card.slug}>
                {renderItem(card, {
                  cardKey: key,
                  expanded,
                  collapsed: rowExpanded && !expanded,
                  showDescription: descriptionKey === key,
                  onMouseEnter: enterItem,
                  onMouseLeave: leaveItem,
                })}
              </Fragment>
            );
          })}
        </div>
      );
    });

  return (
    <div className={`module card-list-module-container${viewMore ? " has-view-more-button" : ""}`}>
      {title && <h2 className="title module-title">{title}</h2>}
      {description && (
        <div className="card-list-description module-description wysiwyg-content">{description}</div>
      )}
      <div className="filters-and-cards-wrapper show-filters">
        <div className="card-list-container">
          <div className="no-results-container">
            <h2>No results found</h2>
          </div>
          {props.variant === "post"
            ? renderRows(props.rows, (card, state) => <PostCardItem card={card} {...state} />)
            : renderRows(props.rows, (card, state) => <CaseStudyCardItem card={card} {...state} />)}
        </div>
      </div>
      {viewMore && (
        <div className="view-more">
          <Link href={viewMore.href} className="hs-button">
            {viewMore.label}
          </Link>
        </div>
      )}
    </div>
  );
}
