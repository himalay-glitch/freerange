import Link from "next/link";
import type { ReactNode } from "react";
import "@/styles/rdlab.css";
import CtaCardList from "@/components/templates/CtaCardList";
import LogoCarousel from "@/components/templates/LogoCarousel";
import {
  RDLAB_CTA_BAND,
  RDLAB_FEATURED_CTA,
  RDLAB_FEATURED_INTRO,
  RDLAB_FEATURED_TITLE,
  RDLAB_HERO,
  RDLAB_INDUSTRIAL,
  RDLAB_INDUSTRIAL_TITLE,
  RDLAB_INTRO,
  RDLAB_PRODUCTS,
  RDLAB_PRODUCTS_TITLE,
  RDLAB_TECH_ROW_1,
  RDLAB_TECH_ROW_2,
  RDLAB_TECH_TITLE,
} from "@/lib/data/rdlab";

interface RdLabPageProps {
  /** Case-study card grid rendered inside `.card-list-container` (a 390px placeholder box when absent). */
  featured?: ReactNode;
}

/** HubSpot drag-and-drop section: `.dnd-section > .row-fluid > .dnd-column` (zero padding on this page). */
function DndSection({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`row-fluid-wrapper dnd-section${className ? ` ${className}` : ""}`}>
      <div className="row-fluid">
        <div className="span12 widget-span widget-type-cell dnd-column">{children}</div>
      </div>
    </div>
  );
}

/** `widget-type-space` module: an empty span inside a padded wrapper. */
function Spacer({ size }: { size: 20 | 40 | 50 }) {
  return (
    <div className={`widget-type-space rdlab-spacer-${size}`}>
      <span className="hs-horizontal-spacer" />
    </div>
  );
}

/** Orange `h2.module.custom-heading` with the dark 2px rule (every heading module on the page). */
function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="module custom-heading">{children}</h2>;
}

/**
 * R&D Lab page template (/rd-lab): hero banner, highlight heading, two logo marquees, hover-expanding
 * product cards, the featured case-studies slot, the industrial-design split and the CTA band.
 * DOM and class names follow the original HubSpot page (docs/research/html/rdlab-main.html) so the
 * ported stylesheet (src/styles/rdlab.css) applies 1:1; generated ids are replaced by `rdlab-*` names.
 */
export default function RdLabPage({ featured }: RdLabPageProps) {
  return (
    <div className="container">
      <div className="container-fluid body-container body-container--default rdlab-page">
        {/* 1. Hero banner */}
        <DndSection className="rdlab-hero">
          <div className="background-image" style={{ backgroundImage: `url(${RDLAB_HERO.image})` }}>
            <div className="section--hero section section--md section--black">
              <div className="container">
                <div className="row-fluid hubstrap-row">
                  <div className="span8 hubstrap-col">
                    <h1>
                      <span>{RDLAB_HERO.title}</span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DndSection>

        {/* 2. Highlight heading */}
        <DndSection className="rdlab-intro">
          <h2>
            {RDLAB_INTRO.line}
            <br />
            <span>{RDLAB_INTRO.highlight}</span>
          </h2>
        </DndSection>

        {/* 3. Tech stack: two marquees in opposite directions */}
        <DndSection>
          <SectionHeading>{RDLAB_TECH_TITLE}</SectionHeading>
          <LogoCarousel badges={RDLAB_TECH_ROW_1} direction="left-to-right" label="Tech stack, first row" />
        </DndSection>
        <DndSection>
          <Spacer size={40} />
        </DndSection>
        <DndSection>
          <LogoCarousel badges={RDLAB_TECH_ROW_2} direction="right-to-left" label="Tech stack, second row" />
        </DndSection>
        <DndSection>
          <Spacer size={40} />
        </DndSection>

        {/* 4. In-house products */}
        <DndSection>
          <SectionHeading>{RDLAB_PRODUCTS_TITLE}</SectionHeading>
        </DndSection>
        <DndSection>
          <CtaCardList items={RDLAB_PRODUCTS} />
        </DndSection>
        <DndSection>
          <Spacer size={40} />
        </DndSection>

        {/* 5. Featured case studies */}
        <DndSection>
          <SectionHeading>{RDLAB_FEATURED_TITLE}</SectionHeading>
        </DndSection>
        <div className="row-fluid-wrapper dnd-section rdlab-featured-intro">
          <div className="row-fluid">
            <div className="span6 widget-span widget-type-cell dnd-column">
              <h3>{RDLAB_FEATURED_INTRO.line1}</h3>
              <h3>
                {RDLAB_FEATURED_INTRO.line2Prefix}
                <span>{RDLAB_FEATURED_INTRO.highlight}</span>
                {RDLAB_FEATURED_INTRO.line2Suffix}
              </h3>
            </div>
            <div className="span6 widget-span widget-type-cell dnd-column">
              <Spacer size={40} />
            </div>
          </div>
        </div>
        <DndSection>
          <div className="module card-list-module-container">
            <div className="filters-and-cards-wrapper">
              <div className="card-list-container">
                {featured ?? <div className="rdlab-featured-placeholder" aria-hidden="true" />}
              </div>
            </div>
          </div>
        </DndSection>
        <DndSection>
          <div className="rdlab-button-row">
            <Link className="hs-button" href={RDLAB_FEATURED_CTA.href}>
              {RDLAB_FEATURED_CTA.label}
            </Link>
          </div>
        </DndSection>
        <DndSection>
          <Spacer size={50} />
        </DndSection>

        {/* 6. Industrial design */}
        <DndSection>
          <SectionHeading>{RDLAB_INDUSTRIAL_TITLE}</SectionHeading>
        </DndSection>
        <DndSection>
          <div className="half-image-half-wysiwyg rdlab-industrial">
            <div className="module-content">
              <div className="image-wrapper">
                <img src={RDLAB_INDUSTRIAL.image} alt="" />
              </div>
              <div className="wysiwyg-content">
                <h2 className="rdlab-partner-mark">
                  {RDLAB_INDUSTRIAL.partner}
                  <span>.</span>
                </h2>
                <h3>{RDLAB_INDUSTRIAL.heading}</h3>
                {RDLAB_INDUSTRIAL.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
                <p>
                  {RDLAB_INDUSTRIAL.partnerSentence.before}
                  <Link href={RDLAB_INDUSTRIAL.partnerSentence.link.href}>{RDLAB_INDUSTRIAL.partnerSentence.link.label}</Link>
                  {RDLAB_INDUSTRIAL.partnerSentence.after}
                </p>
              </div>
            </div>
          </div>
        </DndSection>
        <DndSection>
          <Spacer size={20} />
        </DndSection>

        {/* 7. CTA band (full width, light-blue layer) */}
        <div className="row-fluid-wrapper dnd-section rdlab-cta-band">
          <div className="row-fluid">
            <div className="widget-span widget-type-cell dnd-column container">
              <h3>{RDLAB_CTA_BAND.heading}</h3>
              <div className="rdlab-button-row">
                <Link className="hs-button" href={RDLAB_CTA_BAND.cta.href}>
                  {RDLAB_CTA_BAND.cta.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
