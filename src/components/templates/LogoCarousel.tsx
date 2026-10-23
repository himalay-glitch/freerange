import type { ReactNode } from "react";
import type { TechBadge } from "@/types/content";

export type CarouselDirection = "left-to-right" | "right-to-left";

interface LogoCarouselProps {
  badges: TechBadge[];
  /** Direction the logos travel (the original module's `carousel_direction`). */
  direction: CarouselDirection;
  label?: string;
}

/**
 * Auto-scrolling logo marquee (`.module.logo-carousel`). Same DOM/class names as the original
 * Splide-driven module (`fixedWidth/fixedHeight: 156`, `type: loop`, `autoScroll ±0.5`), but the
 * motion is a CSS keyframe: the track holds the slide list twice and translates by -50% per
 * cycle, reversed for the left-to-right row and paused on hover (see src/styles/rdlab.css).
 */
export default function LogoCarousel({ badges, direction, label = "Logo Carousel" }: LogoCarouselProps) {
  // Two copies of the slides make the -50% translate loop seamless; the second copy is decorative.
  const slides = [...badges, ...badges];

  return (
    <div className="module logo-carousel" data-direction={direction}>
      <section className="splide" aria-label={label}>
        <div className="splide__track">
          <ul className="splide__list slides-container">
            {slides.map((badge, index) => {
              const clone = index >= badges.length;
              return (
                <li className="splide__slide slide-item" key={`${badge.label}-${index}`} aria-hidden={clone || undefined}>
                  <div className="slide-content">
                    <TechBadgeIcon badge={badge} decorative={clone} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

const CENTRE = 29.5;

/** Original placeholder "tech badge": a brand-coloured shape with a short label, 59x59 like the live logos. */
export function TechBadgeIcon({ badge, decorative = false }: { badge: TechBadge; decorative?: boolean }) {
  const { label, shape, background, color } = badge;

  let outline: ReactNode;
  switch (shape) {
    case "circle":
      outline = <circle cx={CENTRE} cy={CENTRE} r={CENTRE} fill={background} />;
      break;
    case "hexagon":
      outline = <polygon points="29.5,0.5 55,15 55,44 29.5,58.5 4,44 4,15" fill={background} />;
      break;
    case "diamond":
      outline = <rect x="10" y="10" width="39" height="39" rx="6" fill={background} transform={`rotate(45 ${CENTRE} ${CENTRE})`} />;
      break;
    case "pill":
      outline = <rect x="0" y="10" width="59" height="39" rx="19.5" fill={background} />;
      break;
    default:
      outline = <rect width="59" height="59" rx="12" fill={background} />;
  }

  return (
    <svg
      viewBox="0 0 59 59"
      width="59"
      height="59"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `${label} badge`}
      aria-hidden={decorative || undefined}
    >
      {outline}
      <text
        x={CENTRE}
        y={CENTRE + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={label.length > 2 ? 17 : 22}
        fontWeight="700"
        fill={color}
        style={{ fontFamily: 'var(--font-work-sans), "Work Sans", sans-serif', letterSpacing: "-0.5px" }}
      >
        {label}
      </text>
    </svg>
  );
}
