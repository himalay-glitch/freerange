"use client";

import { useId, useState } from "react";
import type { ServiceFaq } from "@/lib/data/services-pages";

/**
 * FAQ accordion column of the service page.
 * Mirrors the theme script: clicking a header closes every other item, toggles `.active` on the clicked
 * one and swaps its icon between "+" and "−". All items start closed.
 */
export function FaqAccordion({ items }: { items: ServiceFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="faq-accordion-column">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const headerId = `${baseId}-faq-${i}-header`;
        const panelId = `${baseId}-faq-${i}-panel`;
        return (
          <div className={isOpen ? "accordion-item active" : "accordion-item"} key={headerId}>
            <button
              className="accordion-header"
              type="button"
              id={headerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span className="question-text">{item.q}</span>
              <span className="icon" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div className="accordion-content" id={panelId} role="region" aria-labelledby={headerId}>
              <div className="content-inner">
                <p>
                  <span>{item.a}</span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
