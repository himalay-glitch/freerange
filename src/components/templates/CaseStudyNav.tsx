"use client";

import { useEffect, useState, type ChangeEvent } from "react";

export interface CaseStudyNavItem {
  /** id of the section the link scrolls to */
  id: string;
  label: string;
}

export const CASE_STUDY_NAV_ITEMS: CaseStudyNavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "understand", label: "1. Understand" },
  { id: "explore", label: "2. Explore" },
  { id: "create", label: "3. Create" },
  { id: "launch", label: "4. Launch" },
];

/**
 * Sidebar section navigation for case studies: a link list on desktop and a <select> on small
 * screens. The active item follows the section currently under the top of the viewport
 * (IntersectionObserver over the section anchors).
 */
export function CaseStudyNav({ items = CASE_STUDY_NAV_ITEMS }: { items?: CaseStudyNavItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = items.map((item) => item.id);
    const targets = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;

    // A section is current once its anchor has risen above the 40% line of the viewport. The observer's
    // band (header offset → 40%) fires whenever an anchor crosses that line; the active item is then
    // recomputed from the live positions so fast scrolls and the initial callback resolve correctly.
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= line) current = target.id;
      }
      setActive(current);
    };
    const observer = new IntersectionObserver(update, { rootMargin: "-120px 0px -60% 0px", threshold: 0 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const id = event.target.value.replace(/^#/, "");
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="case-study-navigation">
      <ul>
        {items.map((item) => (
          <li key={item.id} className={active === item.id ? "active" : undefined}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ul>
      <select aria-label="Jump to section" value={active ? `#${active}` : `#${items[0]?.id ?? ""}`} onChange={handleSelect}>
        {items.map((item) => (
          <option key={item.id} value={`#${item.id}`}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
