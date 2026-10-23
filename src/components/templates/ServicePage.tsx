import Link from "next/link";
import "@/styles/service-page.css";
import type { ServiceCard, ServiceIcon, ServicePageData } from "@/lib/data/services-pages";
import { FaqAccordion } from "./FaqAccordion";

/* ----------------------------------------------------------------------------
   Inline SVG icons (own drawings, 24px line icons rendered white in the 55px slate box)
---------------------------------------------------------------------------- */

const ICON_ATTRS = {
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "none",
  stroke: "#fff",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

function CardIcon({ icon }: { icon: ServiceIcon }) {
  switch (icon) {
    case "window":
      return (
        <svg {...ICON_ATTRS}>
          <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
          <path d="M2.5 9.5h19" />
          <circle cx="6" cy="7" r="0.6" fill="#fff" />
          <circle cx="9" cy="7" r="0.6" fill="#fff" />
        </svg>
      );
    case "screens":
      return (
        <svg {...ICON_ATTRS}>
          <rect x="2.5" y="4.5" width="14" height="10" rx="1.5" />
          <path d="M7 19h5M9.5 14.5V19" />
          <rect x="15.5" y="10.5" width="6" height="9.5" rx="1.5" />
          <path d="M18.5 17.5h.01" />
        </svg>
      );
    case "gear":
      return (
        <svg {...ICON_ATTRS} strokeWidth={1.8}>
          <path d="M19.42 10.36 22.05 10.23v3.54l-2.63-.13-1.01 2.44 1.95 1.77-2.51 2.51-1.77-1.95-2.44 1.01.13 2.63h-3.54l.13-2.63-2.44-1.01-1.77 1.95-2.51-2.51 1.95-1.77-1.01-2.44-2.63.13v-3.54l2.63.13 1.01-2.44-1.95-1.77 2.51-2.51 1.77 1.95 2.44-1.01-.13-2.63h3.54l-.13 2.63 2.44 1.01 1.77-1.95 2.51 2.51-1.95 1.77Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "bulb":
      return (
        <svg {...ICON_ATTRS}>
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6M10 22h4" />
        </svg>
      );
    case "pen":
      return (
        <svg {...ICON_ATTRS}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case "chart":
      return (
        <svg {...ICON_ATTRS}>
          <path d="M3 3v18h18" />
          <path d="M7 15l4-5 3 3 6-7" />
          <path d="M16 6h4v4" />
        </svg>
      );
  }
}

/** 16px blue egg bullet (the theme uses an egg glyph for list items). */
function EggBullet() {
  return (
    <svg className="blue-dot-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path fill="#308bf5" d="M8 1.5C5.4 1.5 3 5.6 3 9.2a5 5 0 0 0 10 0C13 5.6 10.6 1.5 8 1.5Z" />
    </svg>
  );
}

/** Low-poly bird placeholder for the background decorator (thin grey mesh, 717×484 like the original). */
function DecoratorBird() {
  const tri = [
    "520,110 590,95 610,150",
    "520,110 610,150 560,190",
    "520,110 560,190 500,170",
    "590,95 640,130 610,150",
    "540,95 560,60 580,95",
    "560,60 590,70 600,95",
    "610,150 665,160 615,175",
    "500,170 560,190 470,230",
    "470,230 560,190 520,250",
    "300,220 470,230 420,330",
    "300,220 420,330 280,330",
    "280,330 420,330 360,390",
    "420,330 540,320 470,390",
    "420,330 470,390 360,390",
    "540,320 520,250 420,330",
    "300,220 240,170 200,250",
    "300,220 200,250 280,330",
    "240,170 140,70 170,150",
    "240,170 170,150 100,140",
    "240,170 100,140 130,200",
    "240,170 130,200 200,250",
    "330,240 470,240 400,320",
    "330,240 400,320 320,300",
  ];
  return (
    <svg viewBox="0 0 717 484" width="717" height="484" aria-hidden="true" focusable="false" fill="none" stroke="#9aa3ad" strokeWidth="1.2" strokeLinejoin="round">
      {tri.map((points) => (
        <polygon key={points} points={points} />
      ))}
      <circle cx="575" cy="130" r="4" />
      <path d="M350 390l-5 65M345 455l-25 15M345 455l20 15M450 390l5 65M455 455l-25 15M455 455l20 15" />
    </svg>
  );
}

/* ----------------------------------------------------------------------------
   Sub-service card
---------------------------------------------------------------------------- */

function SubserviceCard({ card, icon }: { card: Omit<ServiceCard, "icon">; icon: ServiceIcon }) {
  return (
    <div className="subservice-card">
      <div className="card-icon-wrapper">
        <CardIcon icon={icon} />
      </div>
      <h3 className="card-title">{card.title}</h3>
      <div className="card-description">
        <p>{card.description}</p>
      </div>
      <ul className="sub-list">
        {card.items.map((item) => (
          <li className="sub-list-item" key={item}>
            <EggBullet />
            <span className="item-text">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------------------------------------------------------
   Template
---------------------------------------------------------------------------- */

export function ServicePage({ data }: { data: ServicePageData }) {
  const { title, intro, cards, rdCard, rd, faqs, cta } = data;

  return (
    <main id="main-content" className="body-container-wrapper service-page">
      <div className="container">
        <div className="container-fluid body-container body-container--default">
          <div className="row-fluid-wrapper">
            <div className="row-fluid">
              <div className="span12 widget-span widget-type-cell" data-widget-type="cell" data-x="0" data-w="12">
                {/* 1. Page header */}
                <section className="row-fluid-wrapper row-depth-1 dnd-section service-header-row">
                  <div className="row-fluid">
                    <div className="span12 widget-span widget-type-cell dnd-column" data-w="12">
                      <div className="span12 widget-span widget-type-custom_widget dnd-module">
                        <div className="service-header-module widget-type-section_header">
                          <div className="page-header section-header">
                            <h1>{title}</h1>
                            <p className="secondary-header">
                              <span className="section-subheader">{intro}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="span12 widget-span widget-type-custom_widget dnd-module service-flex-center">
                        <div className="service-header-cta">
                          <Link className="hs-button" href="/contact-us">
                            Book A Consultation
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Background decorator (zero-height row) */}
                <div className="row-fluid-wrapper row-depth-1 dnd-section service-decorator-row">
                  <div className="row-fluid">
                    <div className="span12 widget-span widget-type-cell dnd-column" data-w="12">
                      <div className="span12 widget-span widget-type-custom_widget dnd-module">
                        <div className="bg-section-decorator" aria-hidden="true">
                          <DecoratorBird />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Sub-service cards */}
                <section className="row-fluid-wrapper row-depth-1 dnd-section service-cards-row" aria-label="Services">
                  <div className="row-fluid">
                    <div className="span12 widget-span widget-type-cell dnd-column" data-w="12">
                      <div className="span12 widget-span widget-type-custom_widget dnd-module">
                        <div className="subservices-grid">
                          {cards.map((card) => (
                            <SubserviceCard card={card} icon={card.icon} key={card.title} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. R&D Lab split */}
                <section className="row-fluid-wrapper row-depth-1 dnd-section service-rd-row" aria-label="R&D Lab">
                  <div className="row-fluid">
                    <div
                      className="span7 widget-span widget-type-cell dnd-column service-rd-card-column"
                      data-widget-type="cell"
                      data-x="0"
                      data-w="7"
                    >
                      <div className="span12 widget-span widget-type-custom_widget dnd-module service-rd-spacer-module">
                        <div className="service-rd-spacer" aria-hidden="true">
                          <div className="service-rd-spacer-line">{" "}</div>
                        </div>
                      </div>
                      <div className="span12 widget-span widget-type-custom_widget dnd-module">
                        <div className="subservices-grid">
                          <SubserviceCard card={rdCard} icon={rdCard.icon ?? "bulb"} />
                        </div>
                      </div>
                    </div>
                    <div
                      className="span5 widget-span widget-type-cell dnd-column service-rd-text-column"
                      data-widget-type="cell"
                      data-x="7"
                      data-w="5"
                    >
                      <div className="span12 widget-span widget-type-custom_widget dnd-module service-rich-text service-rd-text-module">
                        <h2>
                          {rd.heading} <strong>{rd.highlight}</strong>
                        </h2>
                        {rd.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      <div className="span12 widget-span widget-type-custom_widget dnd-module service-flex-start">
                        <div className="service-rd-cta">
                          <Link className="hs-button" href={rd.cta.href}>
                            {rd.cta.label}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. FAQ */}
                <section className="row-fluid-wrapper row-depth-1 dnd-section service-faq-row" aria-label="Frequently asked questions">
                  <div className="row-fluid">
                    <div className="span12 widget-span widget-type-cell dnd-column" data-w="12">
                      <div className="span12 widget-span widget-type-custom_widget dnd-module">
                        <div className="faq-split-container">
                          <div className="faq-intro-column">
                            <h2 className="faq-main-title">Frequently Asked Questions</h2>
                            <div className="faq-description">
                              <span>{" "}</span>
                            </div>
                          </div>
                          <FaqAccordion items={faqs} />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 5. CTA band (full width) */}
                <section className="row-fluid-wrapper row-depth-1 dnd-section service-cta-band" aria-label="Book a consultation">
                  <div className="row-fluid">
                    <div className="span12 widget-span widget-type-cell dnd-column" data-widget-type="cell" data-x="0" data-w="12">
                      <div className="span12 widget-span widget-type-custom_widget dnd-module service-rich-text service-cta-text">
                        <h2>{cta.heading}</h2>
                        <p>{cta.text}</p>
                      </div>
                      <div className="span12 widget-span widget-type-custom_widget dnd-module service-flex-center">
                        <div>
                          <Link className="hs-button" href={cta.href}>
                            {cta.label}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ServicePage;
