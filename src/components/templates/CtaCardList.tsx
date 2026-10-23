"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent, type MouseEvent } from "react";
import type { ProductCard } from "@/types/content";

/** theme-main.js `ctaCardList`: the hovered item expands 300 ms after the pointer enters it. */
const HOVER_DELAY_MS = 300;
/** Expansion is disabled at the theme's xsmall/small breakpoints (< 62.5em). */
const EXPAND_QUERY = "(min-width: 62.5em)";

/**
 * Hover-expanding product cards (`.cta-card-list`). Port of the theme's jQuery plugin:
 * mouseover on an item starts a 300 ms timer; if the item is still hovered when it fires the item
 * gets `.expanded`, its siblings `.collapsed` and the list `.has-item-expanded`; mouseleave on the
 * list clears everything. Below 1000px nothing expands (the cards stack on small screens via CSS).
 * Focus within an item expands it immediately so the "Learn more" link is reachable by keyboard.
 */
export default function CtaCardList({ items }: { items: ProductCard[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const pending = useRef<{ index: number; timer: number } | null>(null);

  const clearPending = () => {
    if (pending.current) {
      window.clearTimeout(pending.current.timer);
      pending.current = null;
    }
  };

  const canExpand = () => window.matchMedia(EXPAND_QUERY).matches;

  useEffect(() => {
    // Theme: the plugin re-reads the breakpoint on resize; collapse when dropping below "large".
    const query = window.matchMedia(EXPAND_QUERY);
    const onChange = () => {
      if (!query.matches) {
        clearPending();
        setExpanded(null);
      }
    };
    query.addEventListener("change", onChange);
    return () => {
      query.removeEventListener("change", onChange);
      clearPending();
    };
  }, []);

  const onItemMouseOver = (index: number) => (event: MouseEvent<HTMLDivElement>) => {
    if (!canExpand() || expanded === index) return;
    // A timer is already running for this item: let it fire (mouseover bubbles from every child).
    if (pending.current?.index === index) return;
    clearPending();
    const item = event.currentTarget;
    pending.current = {
      index,
      timer: window.setTimeout(() => {
        pending.current = null;
        if (item.matches(":hover")) setExpanded(index);
      }, HOVER_DELAY_MS),
    };
  };

  const onItemFocus = (index: number) => () => {
    if (!canExpand()) return;
    clearPending();
    setExpanded(index);
  };

  const reset = () => {
    clearPending();
    setExpanded(null);
  };

  const onListBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) reset();
  };

  const listClass = `cta-card-list items-${items.length}${expanded === null ? "" : " has-item-expanded"}`;

  return (
    <div className={listClass} onMouseLeave={reset} onBlur={onListBlur}>
      {items.map((item, index) => {
        const state = expanded === null ? "" : expanded === index ? " expanded" : " collapsed";
        return (
          <div
            className={`cta-card-list-item${state}`}
            key={item.title}
            tabIndex={0}
            onMouseOver={onItemMouseOver(index)}
            onFocus={onItemFocus(index)}
          >
            <img src={item.image} alt="" />
            <div className="card-content">
              <h4 className="card-title">{item.title}</h4>
            </div>
            <div className="card-expanded-content">
              <h4 className="card-title">{item.title}</h4>
              <p className="description">{item.description}</p>
              <Link href={item.cta.href} className="cta">
                {item.cta.label}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
