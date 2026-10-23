"use client";

import { useEffect, useRef } from "react";
import "@/styles/approach.css";
import { APPROACH_DESCRIPTION, APPROACH_STEPS, APPROACH_TITLE } from "@/lib/data/approach-steps";

/**
 * Placeholder for the live site's 193-frame "explore_bird" PNG sequence. A single frame is
 * drawn and walked across the canvas as the section scrolls.
 */
const FRAME_SRC = "/placeholders/chick.svg";
const FRAME_COUNT = 1;

/** Fraction of the canvas width the chick travels between progress 0 and 1. */
const WALK_DISTANCE = 0.25;
/** Vertical bob amplitude in CSS px, and tilt amplitude in degrees. */
const BOB_PX = 6;
const TILT_DEG = 4;

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/**
 * Port of the theme's cover-fit `drawImage` helper: scales the image to cover the target box,
 * cropping around the (offsetX, offsetY) anchor (0.5/0.5 = centred).
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  offsetX = 0.5,
  offsetY = 0.5,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const ratio = Math.min(w / iw, h / ih);
  let nw = iw * ratio;
  let nh = ih * ratio;
  let ar = 1;
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
  nw *= ar;
  nh *= ar;
  let cw = iw / (nw / w);
  let ch = ih / (nh / h);
  let cx = (iw - cw) * offsetX;
  let cy = (ih - ch) * offsetY;
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

export default function Approach() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = animationRef.current;
    const canvas = canvasRef.current;
    if (!section || !sticky || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let progress = 0;
    let rafId = 0;
    let disposed = false;
    // Scroll distance over which the animation plays (theme: sectionHeight - innerHeight / 1.5).
    let range = section.offsetHeight - window.innerHeight / 1.5;

    const img = new Image();
    img.decoding = "async";

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!img.complete || !img.naturalWidth || w === 0 || h === 0) return;

      // Walk derived from scroll progress: slide across the canvas, bob and tilt.
      const dx = (progress - 0.5) * WALK_DISTANCE * w;
      const phase = progress * 40;
      const dy = Math.sin(phase) * BOB_PX;
      const tilt = Math.cos(phase) * TILT_DEG * (Math.PI / 180);

      ctx.save();
      ctx.translate(w / 2 + dx, h / 2 + dy);
      ctx.rotate(tilt);
      ctx.translate(-w / 2, -h / 2);
      drawImageCover(ctx, img, 0, 0, w, h, 0.5, 0.5);
      ctx.restore();
    };

    const scheduleDraw = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        if (!disposed) draw();
      });
    };

    // Backing store follows the CSS size x devicePixelRatio.
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      draw();
    };

    // Theme: `.our-approach-animation { top: (innerHeight - canvasHeight) / 2 }` (inline style;
    // the <=999px CSS overrides it with !important).
    const updateStickyTop = () => {
      sticky.style.top = `${(window.innerHeight - canvas.clientHeight) / 2}px`;
    };

    const updateProgress = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offset = window.scrollY - sectionTop;
      progress = range > 0 ? clamp01(offset / range) : offset > 0 ? 1 : 0;
    };

    const onScroll = () => {
      updateProgress();
      scheduleDraw();
    };

    const onResize = () => {
      range = section.offsetHeight - window.innerHeight / 1.5;
      updateStickyTop();
      resizeCanvas();
      onScroll();
    };

    const observer = new ResizeObserver(() => {
      resizeCanvas();
      updateStickyTop();
    });
    observer.observe(canvas);

    img.onload = () => {
      if (!disposed) draw();
    };
    img.src = FRAME_SRC;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      img.onload = null;
    };
  }, []);

  return (
    <div className="module our-approach full-width" ref={sectionRef}>
      <div className="background">
        <div className="background-image" />
        <div className="background-color" />
      </div>
      <div className="container">
        <h2 className="title module-title" id="approach">
          {APPROACH_TITLE}
        </h2>
        <div className="our-approach-description module-description wysiwyg-content">
          {APPROACH_DESCRIPTION}
        </div>
        <div className="our-approach-content">
          <div
            className="our-approach-animation"
            ref={animationRef}
            data-config={JSON.stringify({ first_slide_url: FRAME_SRC, count: FRAME_COUNT })}
          >
            <div className="inner-container">
              <canvas ref={canvasRef} aria-hidden="true" />
            </div>
          </div>
          <div className="steps">
            {APPROACH_STEPS.map((step) => (
              <div className="step" key={step.number}>
                <h3 data-number={step.number} className={step.align === "left" ? "text-start" : undefined}>
                  {step.title}
                </h3>
                <div className="description">
                  <p>{step.description}</p>
                </div>
                <div className="tags">
                  {step.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
