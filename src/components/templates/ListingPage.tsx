"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CardList } from "@/components/cards/CardList";
import type { CaseStudyCard, PostCard } from "@/types/content";
import "@/styles/listing.css";

export type ListingVariant = "blog" | "case-studies" | "resources";

export interface FilterOption {
  label: string;
  /** Tag slug used in `?tags=` and matched against the slugified item tags */
  slug: string;
}

export interface FilterGroup {
  title: string;
  options: FilterOption[];
}

/** A card plus the tag labels the sidebar filters match against. */
export type ListingItem = (PostCard | CaseStudyCard) & { tags: string[] };

export interface ListingPageProps {
  variant: ListingVariant;
  /** Hero headline (blog only). Wrap the opening words in `<strong>` for the orange highlight. */
  headline?: ReactNode;
  filterGroups: FilterGroup[];
  /** The full collection; the template filters, searches and paginates it client-side */
  items: ListingItem[];
  /** Cards revealed per "Load More" (the live listings show 10) */
  pageSize?: number;
}

/**
 * Row pattern of the live listings: three cards (third wide), four cards, three cards with the
 * first one wide (`flip`), repeating. One page of 10 is exactly one cycle.
 */
const ROW_SIZES = [3, 4, 3] as const;

const URL_PARAM = "tags";

function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseSlugs(value: string | null): Set<string> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean),
  );
}

/**
 * Splits the visible cards into rows following `ROW_SIZES` and marks the card that CardList needs
 * to see as `wide`: the last card of a three-up row, the first card of a flipped one. A four-up
 * row left with only three cards becomes a flipped three-up row, as the theme's JS does.
 */
function chunkRows<T extends { wide?: boolean }>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let start = 0, step = 0; start < items.length; step++) {
    const size = ROW_SIZES[step % ROW_SIZES.length];
    const kind = step % ROW_SIZES.length; // 0: last wide, 1: four-up, 2: first wide
    const row = items.slice(start, start + size).map((card) => ({ ...card, wide: false }));
    if (kind === 0 && row.length === 3) row[row.length - 1].wide = true;
    else if (kind === 2 && row.length > 1) row[0].wide = true;
    else if (kind === 1 && row.length === 3) row[0].wide = true;
    rows.push(row);
    start += size;
  }
  return rows;
}

/** Three sliders with knobs (the theme's 28px orange filter icon) */
function SlidersIcon() {
  return (
    <svg className="filters-toggle-icon" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <g stroke="#ff4e00" strokeWidth="2.5" strokeLinecap="round" fill="none">
        <path d="M2 5.5h24M2 14h24M2 22.5h24" />
      </g>
      <g fill="#ff4e00">
        <circle cx="18" cy="5.5" r="2.75" />
        <circle cx="8" cy="14" r="2.75" />
        <circle cx="15" cy="22.5" r="2.75" />
      </g>
    </svg>
  );
}

/** Magnifier (the theme's 28px orange search icon) */
function MagnifierIcon() {
  return (
    <svg className="search-icon" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
      <circle cx="12" cy="11" r="7.75" stroke="#ff4e00" strokeWidth="3.5" fill="none" />
      <path d="M17.5 16.5 24 24" stroke="#ff4e00" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Listing page template used by /blog, /case-studies and /resources. Markup and class names
 * mirror the original HubSpot module so `src/styles/listing.css` and `card-list.css` apply
 * unchanged; the card rows are rendered by `CardList`.
 *
 * Must be rendered inside a `<Suspense>` boundary (it reads `useSearchParams`).
 */
export function ListingPage({ variant, headline, filterGroups, items, pageSize = 10 }: ListingPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const idBase = useId();

  const urlTags = searchParams.get(URL_PARAM) ?? "";
  const [selected, setSelected] = useState<Set<string>>(() => parseSlugs(urlTags));
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  /** Last `?tags=` value this component wrote, so its own `router.replace` is not re-applied. */
  const lastWritten = useRef(urlTags);

  // A URL change made elsewhere (e.g. a card's tag link) replaces the selection.
  useEffect(() => {
    if (urlTags === lastWritten.current) return;
    lastWritten.current = urlTags;
    setSelected(parseSlugs(urlTags));
    setPage(1);
  }, [urlTags]);

  const writeUrl = (slugs: Set<string>) => {
    const value = Array.from(slugs).join(",");
    lastWritten.current = value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(URL_PARAM, value);
    else params.delete(URL_PARAM);
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  const toggleFilter = (slug: string, checked: boolean) => {
    const next = new Set(selected);
    if (checked) next.add(slug);
    else next.delete(slug);
    setSelected(next);
    setPage(1);
    writeUrl(next);
  };

  const clearFilters = () => {
    const next = new Set<string>();
    setSelected(next);
    setQuery("");
    setPage(1);
    writeUrl(next);
  };

  const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const slugs = Array.from(selected);
    return items.filter((item) => {
      if (needle && !item.title.toLowerCase().includes(needle)) return false;
      if (slugs.length === 0) return true;
      const itemSlugs = item.tags.map(tagSlug);
      return slugs.every((slug) => itemSlugs.includes(slug));
    });
  }, [items, query, selected]);

  const visible = useMemo(() => filtered.slice(0, page * pageSize), [filtered, page, pageSize]);
  const hasMore = visible.length < filtered.length;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  // Original behaviour: the hidden Load More sentinel triggers the next page when scrolled into view.
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setPage((current) => current + 1);
    }, { rootMargin: "200px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, visible.length]);
  const rows = useMemo(() => chunkRows(visible), [visible]);

  return (
    <div className={`body-container body-container--blog-index body-container--custom-blog-index ${variant}`}>
      {headline && (
        <div className="blog-header">
          <div className="blog-header__inner">
            <div className="hero-no-animation container blog-hero-module">
              <h1>{headline}</h1>
            </div>
          </div>
        </div>
      )}
      <div className="content-wrapper container">
        <section
          className={hasMore ? "blog-index" : "blog-index no-more-posts"}
          data-posts-per-page={pageSize}
          data-total-posts={filtered.length}
        >
          <div className="module card-list-module-container">
            <div className="card-list-filters-search">
              <div className="search-filters">
                <div className="filters-toggle" onClick={() => setShowFilters((open) => !open)}>
                  <div className="filters-toggle-button">
                    <SlidersIcon />
                    <span data-show-filters={showFilters ? "true" : "false"}>
                      {showFilters ? "Hide Filters" : "Show Filters"}
                    </span>
                  </div>
                </div>
                <div className="search-input-container">
                  <MagnifierIcon />
                  <form className="search-form" role="search" onSubmit={onSearchSubmit}>
                    <input type="submit" value="" aria-label="Search" />
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search"
                      aria-label="Search"
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setPage(1);
                      }}
                    />
                  </form>
                </div>
              </div>
            </div>

            <div className={showFilters ? "filters-and-cards-wrapper show-filters" : "filters-and-cards-wrapper"}>
              <div className="card-list-search-filters" aria-hidden={!showFilters}>
                <form method="get" onSubmit={(event) => event.preventDefault()}>
                  {filterGroups.map((group, groupIndex) => (
                    <div key={group.title}>
                      <h2 className="title">{group.title}</h2>
                      <ul className="filters">
                        {group.options.map((option, optionIndex) => {
                          const id = `${idBase}-${groupIndex}-${optionIndex}`;
                          return (
                            <li key={option.slug}>
                              <label className="checkbox-container">
                                <input
                                  type="checkbox"
                                  id={id}
                                  name={id}
                                  value={option.label}
                                  data-tag-slug={option.slug}
                                  checked={selected.has(option.slug)}
                                  onChange={(event) => toggleFilter(option.slug, event.target.checked)}
                                  tabIndex={showFilters ? undefined : -1}
                                />
                                <span className="checkmark" />
                              </label>{" "}
                              <label htmlFor={id}>{option.label}</label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                  <button type="button" className="clear-filters" onClick={clearFilters} tabIndex={showFilters ? undefined : -1}>
                    Clear Filters
                  </button>
                </form>
              </div>

              {filtered.length === 0 ? (
                <div className="card-list-container">
                  <div className="no-results-container show">
                    <h2>No results found</h2>
                  </div>
                </div>
              ) : variant === "case-studies" ? (
                <CardList variant="case-study" rows={rows as CaseStudyCard[][]} />
              ) : (
                <CardList variant="post" rows={rows as PostCard[][]} />
              )}
            </div>
          </div>

          <div ref={loadMoreRef} className={hasMore ? "load-more-button enabled" : "load-more-button no-more-posts"}>
            {hasMore && (
              <button type="button" className="hs-button" onClick={() => setPage((current) => current + 1)}>
                Load More
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
