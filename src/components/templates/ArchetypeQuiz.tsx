"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SliderArrowIcon } from "@/components/icons";
import {
  ARCHETYPE_ORDER,
  ARCHETYPES,
  QUIZ_INTRO,
  QUIZ_QUESTIONS,
  scoreQuiz,
  type ArchetypeSlug,
  type QuizQuestion,
} from "@/lib/data/archetypes";
import { LOGO_ORANGE, LOGO_WHITE, SITE_NAME } from "@/lib/site";
import "@/styles/quiz.css";

export interface ArchetypeQuizProps {
  questions?: QuizQuestion[];
  headline?: string;
}

/**
 * Full-screen Brand Archetype quiz (/archetypes): intro slide, one slide per question and a
 * redirect to the matching result page (/creator, /leader, …). Renders without the site
 * header/footer. The DOM and class names mirror the original Flickity-driven module
 * (docs/research/html/archetypes-quiz-main.html); the slider logic is plain React — slides are
 * stacked, the current one carries `.is-selected` and the others fade out (opacity 0.5s).
 */
export function ArchetypeQuiz({ questions = QUIZ_QUESTIONS, headline = QUIZ_INTRO.headline }: ArchetypeQuizProps) {
  const router = useRouter();
  const count = questions.length;

  /** 0 = intro slide, 1…count = question slides. */
  const [index, setIndex] = useState(0);
  /** Index of the chosen answer per question. */
  const [answers, setAnswers] = useState<Array<number | null>>(() => Array.from({ length: count }, () => null));
  const [submitting, setSubmitting] = useState(false);

  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const focusOnChange = useRef(false);

  // Like Flickity, focus the slide we navigated to (this also draws the slide's focus frame).
  useEffect(() => {
    if (!focusOnChange.current) return;
    focusOnChange.current = false;
    slideRefs.current[index]?.focus({ preventScroll: true });
  }, [index]);

  const goTo = (next: number) => {
    focusOnChange.current = true;
    setIndex(Math.min(Math.max(next, 0), count));
  };

  const choose = (question: number, answer: number) => {
    setAnswers((prev) => prev.map((value, i) => (i === question ? answer : value)));
  };

  const advance = (question: number) => {
    if (answers[question] === null) return;
    if (question + 1 < count) {
      goTo(question + 2);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    const chosen: ArchetypeSlug[] = [];
    questions.forEach((q, i) => {
      const a = answers[i];
      if (a !== null && q.answers[a]) chosen.push(q.answers[a].archetype);
    });
    router.push(`/${scoreQuiz(chosen)}`);
  };

  const progress = `${(index / (count + 1)) * 100}vw`;

  return (
    <main id="main-content" className="body-container-wrapper">
      <div className="container-fluid body-container body-container--quiz">
        <div className="row-fluid-wrapper row-depth-1 row-number-1 dnd_area-row-0-force-full-width-section dnd-section">
          <div className="row-fluid">
            <div className="span12 widget-span widget-type-cell dnd-column">
              <div className="module quiz-slider" aria-busy={submitting || undefined}>
                <div className="slides flickity-enabled">
                  <div className="flickity-viewport">
                    <div className="flickity-slider">
                      {/* Intro */}
                      <div
                        ref={(el) => {
                          slideRefs.current[0] = el;
                        }}
                        className={index === 0 ? "slide main-container is-selected" : "slide main-container"}
                        tabIndex={-1}
                        aria-hidden={index !== 0 || undefined}
                        inert={index !== 0}
                      >
                        <div className="module-quiz-intro">
                          <div className="logo-container">
                            <Link href="/" aria-label={`${SITE_NAME} home`}>
                              <img src={LOGO_WHITE} alt="" width={124} height={114} />
                              <span className="site-name">{SITE_NAME}</span>
                            </Link>
                          </div>
                          <div className="bottom-container">
                            <div className="title-container">
                              <p>
                                <span>{headline}</span>
                              </p>
                            </div>
                            <div className="cta-button">
                              <button type="button" className="cta-next-btn start" onClick={() => goTo(1)}>
                                {QUIZ_INTRO.cta}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Questions */}
                      {questions.map((question, q) => {
                        const n = q + 1;
                        const selected = index === n;
                        const chosen = answers[q];
                        const image = ARCHETYPES[ARCHETYPE_ORDER[q % ARCHETYPE_ORDER.length]].image;
                        const labelId = `question-${n}-label`;
                        return (
                          <div
                            key={labelId}
                            ref={(el) => {
                              slideRefs.current[n] = el;
                            }}
                            id={`slide-${n}`}
                            className={selected ? "slide questions-slider is-selected" : "slide questions-slider"}
                            tabIndex={-1}
                            aria-hidden={!selected || undefined}
                            inert={!selected}
                            style={{ "--scene": `url("${image}")` } as CSSProperties}
                          >
                            <div className="image-container-mobile">
                              <div className="image-mobile">
                                <img src={image} alt="" width={1080} height={1449} loading={selected ? "eager" : "lazy"} />
                              </div>
                              <div className="image-tablet">
                                <img src={image} alt="" width={1080} height={1449} loading="lazy" />
                              </div>
                            </div>
                            <div className="outer-container-mobile">
                              <div className="question-number-mobile">
                                <p>{n}</p>
                              </div>
                              <div className="question-container" tabIndex={-1}>
                                <div className="que-header">
                                  <div className="question-number">
                                    <p>{n}</p>
                                  </div>
                                  <div className="question-label" id={labelId}>
                                    {question.label}
                                  </div>
                                </div>
                                <div className="inner-container">
                                  <div className="answers-container" role="radiogroup" aria-labelledby={labelId}>
                                    {question.answers.map((answer, a) => {
                                      const checked = chosen === a;
                                      return (
                                        <button
                                          key={`${labelId}-${a}`}
                                          type="button"
                                          role="radio"
                                          aria-checked={checked}
                                          className={checked ? "answers-radio selected" : "answers-radio"}
                                          data-property={`question_${n}`}
                                          data-type="radio"
                                          data-value={`${answer.archetype}_q${n}`}
                                          onClick={() => choose(q, a)}
                                        >
                                          <div className="pseudo-radio" aria-hidden="true" />
                                          <div className="answer-label">{answer.text}</div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="site-logo">
                              <Link href="/" aria-label={`${SITE_NAME} home`}>
                                <img src={LOGO_ORANGE} alt="" width={124} height={114} />
                              </Link>
                            </div>
                            <div className="prev-next-buttons">
                              <button
                                type="button"
                                className="cta-button flickity-button flickity-prev-next-button previous"
                                aria-label="Previous question"
                                aria-disabled={q === 0 || undefined}
                                onClick={() => {
                                  if (q > 0) goTo(n - 1);
                                }}
                              >
                                <SliderArrowIcon direction="prev" className="cta-prev-btn flickity-button-icon" />
                              </button>
                              <button
                                type="button"
                                className={`cta-button flickity-button flickity-prev-next-button next index-${n}`}
                                aria-label={q + 1 < count ? "Next question" : "See my result"}
                                disabled={chosen === null || submitting}
                                onClick={() => advance(q)}
                              >
                                <SliderArrowIcon direction="next" className="cta-next-btn flickity-button-icon" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-label="Quiz progress"
                  aria-valuemin={0}
                  aria-valuemax={count}
                  aria-valuenow={index}
                  style={{ width: progress }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ArchetypeQuiz;
