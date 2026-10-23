import Link from "next/link";
import { notFound } from "next/navigation";
import { ARCHETYPES, RESULT_CTA, type ArchetypeSlug } from "@/lib/data/archetypes";
import { LOGO_ORANGE, SITE_NAME } from "@/lib/site";
import "@/styles/quiz.css";

export interface ArchetypeResultProps {
  slug: ArchetypeSlug | string;
}

/**
 * Archetype result page (/creator, /leader, /entertainer, /guardian, /innovator, /sage):
 * logo top-left, illustration on the left half, title + description + consultation CTA on the
 * right, vertically centred in the viewport. Renders without the site header/footer.
 * DOM and class names mirror docs/research/html/archetype-main.html.
 */
export function ArchetypeResult({ slug }: ArchetypeResultProps) {
  const archetype = ARCHETYPES[slug as ArchetypeSlug];
  if (!archetype) notFound();

  const alt = `${archetype.name} archetype illustration`;

  return (
    <main id="main-content" className="body-container-wrapper">
      <div className="container-fluid body-container body-container--quiz">
        <div className="row-fluid-wrapper row-depth-1 row-number-1 dnd_area-row-0-vertical-alignment dnd_area-row-0-force-full-width-section dnd-section">
          <div className="row-fluid">
            <div className="span12 widget-span widget-type-cell dnd-column">
              <div className="module quiz-results">
                <div className="result-container">
                  <div className="logo-container">
                    <Link href="/" aria-label={`${SITE_NAME} home`}>
                      <img src={LOGO_ORANGE} alt="" width={124} height={114} />
                      <span className="site-name">{SITE_NAME}</span>
                    </Link>
                  </div>
                  <div className="image-container">
                    <img src={archetype.image} alt={alt} width={1080} height={1449} loading="eager" />
                  </div>
                  <div className="image-container-tablet">
                    <img src={archetype.image} alt="" width={1080} height={1449} loading="lazy" />
                  </div>
                  <div className="image-container-mobile">
                    <img src={archetype.image} alt={alt} width={1080} height={1449} loading="eager" />
                  </div>
                  <div className="result-content">
                    <div className="result-title">
                      <span>{archetype.name}</span>
                    </div>
                    <div className="result-desc">
                      {archetype.paragraphs.map((text, i) => (
                        <p key={i}>{i === 0 ? text : <em>{text}</em>}</p>
                      ))}
                    </div>
                    <div className="result-cta">
                      <Link href={RESULT_CTA.href} className="cta-button">
                        {RESULT_CTA.label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ArchetypeResult;
