"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { SliderArrowIcon } from "@/components/icons";
import { TESTIMONIALS } from "@/lib/data/testimonials";
import type { Testimonial } from "@/types/content";
import "@/styles/clients-slider.css";

/** Pointer travel (px) needed for a drag to count as a prev/next gesture. */
const DRAG_THRESHOLD = 50;

export interface TestimonialsProps {
  title?: string;
  description?: string;
  items?: Testimonial[];
}

/**
 * Homepage "Testimonials" slider: headshot left, quote + name + title right, blue square
 * prev/next buttons on the outer edges. Reproduces the Flickity DOM/class names of the
 * original (wrapAround + adaptiveHeight + draggable) with a plain React implementation.
 */
export function Testimonials({
  title = "Testimonials",
  description = "What our partners are saying.",
  items = TESTIMONIALS,
}: TestimonialsProps) {
  const count = items.length;
  const [index, setIndex] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number | undefined>(undefined);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  // adaptiveHeight: the viewport follows the selected slide's height (re-measured when the
  // selection, the layout or an image's size changes).
  useEffect(() => {
    const measure = () => {
      const el = slideRefs.current[index];
      if (el) setViewportHeight(el.getBoundingClientRect().height);
    };
    measure();
    const observer = new ResizeObserver(measure);
    for (const el of slideRefs.current) if (el) observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [index, count]);

  // Keyboard: left/right arrows while the slider itself has focus (as Flickity does).
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  // Pointer drag (mouse/touch/pen): the track follows the pointer; past the threshold the
  // release advances one slide, otherwise it snaps back.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (count < 2) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as Element).closest("button")) return;
    const track = sliderRef.current;
    if (!track) return;

    const startX = event.clientX;
    const startIndex = indexRef.current;
    let dx = 0;
    setIsPointerDown(true);
    track.style.transition = "none";

    const onMove = (e: globalThis.PointerEvent) => {
      dx = e.clientX - startX;
      track.style.transform = `translateX(calc(${-startIndex * 100}% + ${dx}px))`;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      setIsPointerDown(false);
      track.style.transition = "";
      track.style.transform = `translateX(${-startIndex * 100}%)`;
      if (Math.abs(dx) >= DRAG_THRESHOLD) go(dx < 0 ? 1 : -1);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <div className="module clients-slider">
      <h2 className="title module-title">{title}</h2>
      <div className="clients-slider-description module-description wysiwyg-content">{description}</div>
      <div className="slides flickity-enabled is-draggable" tabIndex={0} onKeyDown={onKeyDown} onPointerDown={onPointerDown}>
        <div className={`flickity-viewport${isPointerDown ? " is-pointer-down" : ""}`} style={{ height: viewportHeight }}>
          <div ref={sliderRef} className="flickity-slider" style={{ transform: `translateX(${-index * 100}%)` }}>
            {items.map((item, i) => {
              const selected = i === index;
              return (
                <div
                  key={`${item.name}-${i}`}
                  ref={(el) => {
                    slideRefs.current[i] = el;
                  }}
                  className={selected ? "slide is-selected" : "slide"}
                  aria-hidden={selected ? undefined : true}
                >
                  <img src={item.image} alt="" draggable={false} />
                  <div className="client-info">
                    <p className="testimonial">{item.quote}</p>
                    <p className="name">{item.name}</p>
                    <p className="title">{item.title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          className="flickity-button flickity-prev-next-button previous"
          aria-label="Previous"
          disabled={count < 2}
          onClick={() => go(-1)}
        >
          <SliderArrowIcon direction="prev" />
        </button>
        <button
          type="button"
          className="flickity-button flickity-prev-next-button next"
          aria-label="Next"
          disabled={count < 2}
          onClick={() => go(1)}
        >
          <SliderArrowIcon direction="next" />
        </button>
      </div>
    </div>
  );
}

export default Testimonials;
