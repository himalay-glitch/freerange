"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { SERVICES, SERVICES_DESCRIPTION, SERVICES_TITLE } from "@/lib/data/services";
import "@/styles/services.css";

/**
 * Homepage "Services" section: four text tabs (>= 1024px) / a <select> (<= 1023px) driving a
 * cross-fading slide (description + "Learn More" on the left, square image on the right).
 * Same DOM/class names as the original HubSpot module (Flickity structure included) so the ported
 * stylesheet applies 1:1; the fade itself is plain React state + CSS.
 */
export default function Services() {
  const [activeId, setActiveId] = useState(SERVICES[0].id);
  const [sliderHeight, setSliderHeight] = useState<number>();
  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  // Slides are absolutely positioned (so they can cross-fade in place), which takes them out of
  // flow: keep the slider exactly as tall as the active slide (608px at the 1216px desktop measure).
  useLayoutEffect(() => {
    const slide = slideRefs.current[activeId];
    if (!slide) return;
    const update = () => setSliderHeight(slide.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(slide);
    return () => observer.disconnect();
  }, [activeId]);

  const activeIndex = SERVICES.findIndex((s) => s.id === activeId);

  const onTabKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    let next = -1;
    if (event.key === "ArrowRight") next = (activeIndex + 1) % SERVICES.length;
    else if (event.key === "ArrowLeft") next = (activeIndex - 1 + SERVICES.length) % SERVICES.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = SERVICES.length - 1;
    else if (event.key === "Enter" || event.key === " ") next = activeIndex;
    if (next < 0) return;
    event.preventDefault();
    const id = SERVICES[next].id;
    setActiveId(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <div className="module our-services">
      <h2 className="title module-title" id="services">
        {SERVICES_TITLE}
      </h2>
      <div className="services-main-description module-description">{SERVICES_DESCRIPTION}</div>
      <div className="services">
        <div className="tabs" role="tablist" aria-label="Services">
          {SERVICES.map((service) => {
            const selected = service.id === activeId;
            return (
              <span
                key={service.id}
                ref={(el) => {
                  tabRefs.current[service.id] = el;
                }}
                role="tab"
                id={`services-tab-${service.id}`}
                aria-selected={selected}
                aria-controls={`services-panel-${service.id}`}
                tabIndex={selected ? 0 : -1}
                className={selected ? "active" : undefined}
                onClick={() => setActiveId(service.id)}
                onKeyDown={onTabKeyDown}
              >
                {service.label}
              </span>
            );
          })}
        </div>
        <div className="services-dropdown">
          <select aria-label="Services" value={activeId} onChange={(event) => setActiveId(event.target.value)}>
            {SERVICES.map((service) => (
              <option key={service.id} value={service.id}>
                {service.label}
              </option>
            ))}
          </select>
        </div>
        <div className="services-slider" style={sliderHeight === undefined ? undefined : { height: sliderHeight }}>
          <div className="flickity-viewport">
            <div className="flickity-slider">
              {SERVICES.map((service) => {
                const selected = service.id === activeId;
                return (
                  <div
                    key={service.id}
                    ref={(el) => {
                      slideRefs.current[service.id] = el;
                    }}
                    role="tabpanel"
                    id={`services-panel-${service.id}`}
                    aria-labelledby={`services-tab-${service.id}`}
                    inert={!selected}
                    className={`services-slider-item slide${selected ? " is-selected" : ""}`}
                  >
                    <div className="description">
                      <p>{service.description}</p>
                      <Link className="hs-button" href={service.cta.href}>
                        {service.cta.label}
                      </Link>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> per spec (square placeholder art) */}
                    <img src={service.image} alt="" width={1200} height={1200} loading={selected ? "eager" : "lazy"} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
