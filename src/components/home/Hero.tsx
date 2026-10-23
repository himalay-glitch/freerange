"use client";

import "@/styles/hero.css";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { ChevronRightIcon, InfoIcon } from "@/components/icons";
import { HERO_SHAPES, type HeroShape } from "./hero-shapes";
import { Shapeshifter, type ShapeshifterOptions } from "./shapeshifter";

/** Engine options, verbatim from the original frHero() call. */
const FG_OPTIONS: ShapeshifterOptions = {
  transformSpeed: { x: 0.07, y: 0.07 },
  hideSpeed: { x: 0.07, y: 0.07 },
  opacitySpeed: 0.03,
  colorSpeed: 0.03,
  scale: 0.8,
  center: true,
  strokeOnly: false,
  hideInitialAnimation: true,
};
const BG_OPTIONS: ShapeshifterOptions = {
  transformSpeed: { x: 0.04, y: 0.04 },
  hideSpeed: { x: 0.04, y: 0.04 },
  opacitySpeed: 0.03,
  colorSpeed: 0.03,
  scale: 0.9,
  center: true,
  strokeOnly: true,
  strokeOpacity: 0.4,
};

/** parallax.js 3.1.0 defaults with the theme's friction override. */
const PARALLAX = {
  friction: 0.075,
  /** scalarX/scalarY = 10 (% of the scene size per unit of input) */
  scalar: 0.1,
  calibrationDelay: 500,
};
/** data-depth of each parallax layer. */
const DEPTH = { hidden: 0.1, bg: 0.7, fg: 0.1 };

const SHOWN_DELAY = 1500; // .typewriter-container gains .shown
const FIRST_CAPTION_DELAY = 300; // ...then the first caption starts typing
const CAPTION_DELAY = 1500; // after a click, before the new caption types
const TYPE_DELAY = 4; // ms per character (TypewriterJS `delay: 4`, i.e. one character per frame)
const TOOLTIP_DELAY = 150;
const TOUCH_CLICK_GUARD = 700; // ignore the click a browser synthesises after a handled touch
/** The theme's "xsmall" breakpoint (`#sizer`): below 480px captions are set instantly. */
const XSMALL_QUERY = "(max-width: 29.9375em)";

export interface HeroProps {
  shapes?: HeroShape[];
}

export function Hero({ shapes = HERO_SHAPES }: HeroProps) {
  const moduleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenLayerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const fgLayerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement>(null);
  const captionBoxRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const tabNameRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const heroModule = moduleRef.current;
    const container = containerRef.current;
    const hiddenLayer = hiddenLayerRef.current;
    const tooltip = tooltipRef.current;
    const bgLayer = bgLayerRef.current;
    const fgLayer = fgLayerRef.current;
    const bgCanvas = bgCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    const captionBox = captionBoxRef.current;
    const typed = typedRef.current;
    const tabName = tabNameRef.current;
    if (
      !heroModule || !container || !hiddenLayer || !tooltip || !bgLayer || !fgLayer ||
      !bgCanvas || !fgCanvas || !captionBox || !typed || !tabName || shapes.length === 0
    ) {
      return;
    }

    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
      return id;
    };
    const cancel = (id: number) => {
      window.clearTimeout(id);
      timers.delete(id);
    };
    const isXsmall = () => window.matchMedia(XSMALL_QUERY).matches;

    /* ---------- canvases ---------- */
    const fg = new Shapeshifter(fgCanvas, shapes[0], FG_OPTIONS);
    const bg = new Shapeshifter(bgCanvas, shapes[0], BG_OPTIONS);
    const fgInner = fgCanvas.parentElement;
    const bgInner = bgCanvas.parentElement;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (entry.target === fgInner) fg.resize(width, height);
        else if (entry.target === bgInner) bg.resize(width, height);
      }
    });
    if (fgInner) resizeObserver.observe(fgInner);
    if (bgInner) resizeObserver.observe(bgInner);

    /* ---------- typewriter ---------- */
    let typingFrame = 0;
    let captionTimer = 0;
    const stopTyping = () => {
      cancelAnimationFrame(typingFrame);
      typingFrame = 0;
    };
    const typeCaption = (text: string) => {
      stopTyping();
      typed.textContent = "";
      let count = 0;
      let last = 0;
      const step = (now: number) => {
        if (now - last >= TYPE_DELAY) {
          count += 1;
          typed.textContent = text.slice(0, count);
          last = now;
        }
        typingFrame = count < text.length ? requestAnimationFrame(step) : 0;
      };
      typingFrame = requestAnimationFrame(step);
    };
    /** Clear the caption now, then type (or, on xsmall screens, set) the caption for shape `i`. */
    const showCaption = (i: number, delay: number) => {
      stopTyping();
      cancel(captionTimer);
      typed.textContent = "";
      tabName.textContent = shapes[i].name.toLowerCase();
      if (isXsmall()) typed.textContent = shapes[i].text;
      else captionTimer = later(() => typeCaption(shapes[i].text), delay);
    };

    /* ---------- shape cycling ---------- */
    let index = 0;
    let lastTouchAdvance = -Infinity;
    const advance = () => {
      index = (index + 1) % shapes.length;
      fg.transform(shapes[index]);
      bg.transform(shapes[index]);
      hiddenLayer.setAttribute("hero-animation-current-index", String(index));
      showCaption(index, CAPTION_DELAY);
    };
    const isPolygon = (target: EventTarget | null) =>
      target instanceof Element && target.tagName.toLowerCase() === "polygon";
    const onClick = (event: MouseEvent) => {
      if (!isPolygon(event.target)) return;
      if (performance.now() - lastTouchAdvance < TOUCH_CLICK_GUARD) return;
      advance();
    };
    let touchStartX = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartX = event.changedTouches[0]?.screenX ?? 0;
    };
    const onTouchEnd = (event: TouchEvent) => {
      // Original: a touch that moved right steps back two, then "clicks" (net: one back).
      const endX = event.changedTouches[0]?.screenX ?? touchStartX;
      if (endX > touchStartX) index = index === 0 ? shapes.length - 2 : index - 2;
      lastTouchAdvance = performance.now();
      advance();
    };

    /* ---------- hover tooltip ---------- */
    let tooltipTimer = 0;
    const onMouseOver = (event: MouseEvent) => {
      if (isPolygon(event.target)) hiddenLayer.classList.add("show-interaction-tooltip");
    };
    const onMouseOut = (event: MouseEvent) => {
      if (isPolygon(event.target)) hiddenLayer.classList.remove("show-interaction-tooltip");
    };

    /* ---------- mouse parallax ---------- */
    let inputX = 0;
    let inputY = 0;
    let calibrationY = 0;
    let velocityX = 0;
    let velocityY = 0;
    const layers: [HTMLElement, number][] = [
      [hiddenLayer, DEPTH.hidden],
      [bgLayer, DEPTH.bg],
      [fgLayer, DEPTH.fg],
    ];
    const stepParallax = () => {
      const motionX = inputX * container.clientWidth * PARALLAX.scalar;
      const motionY = (inputY - calibrationY) * container.clientHeight * PARALLAX.scalar;
      velocityX += (motionX - velocityX) * PARALLAX.friction;
      velocityY += (motionY - velocityY) * PARALLAX.friction;
      for (const [layer, depth] of layers) {
        // invertX/invertY (parallax.js defaults): layers move away from the pointer
        layer.style.transform = `translate3d(${(-velocityX * depth).toFixed(1)}px, ${(-velocityY * depth).toFixed(1)}px, 0)`;
      }
    };
    // parallax.js calibrates the vertical axis (calibrateY: true) 500ms after start and after resizes.
    let calibrationTimer = 0;
    const calibrate = () => {
      cancel(calibrationTimer);
      calibrationTimer = later(() => {
        calibrationY = inputY;
      }, PARALLAX.calibrationDelay);
    };
    calibrate();

    const onMouseMove = (event: MouseEvent) => {
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;
      if (halfWidth && halfHeight) {
        inputX = (event.clientX - halfWidth) / halfWidth;
        inputY = (event.clientY - halfHeight) / halfHeight;
      }
      const rect = container.getBoundingClientRect();
      tooltip.style.left = `${event.clientX - rect.left + 20}px`;
      tooltip.style.top = `${event.clientY - rect.top + 20}px`;
      const hovering = hiddenLayer.classList.contains("show-interaction-tooltip");
      const visible = tooltip.classList.contains("add-opacity");
      if (hovering && !visible && !tooltipTimer) {
        tooltipTimer = later(() => {
          tooltipTimer = 0;
          if (hiddenLayer.classList.contains("show-interaction-tooltip")) tooltip.classList.add("add-opacity");
        }, TOOLTIP_DELAY);
      }
      if (!hovering && visible) tooltip.classList.remove("add-opacity");
    };

    /* ---------- animation loop: only while the hero is on screen ---------- */
    let frame = 0;
    let running = false;
    const tick = () => {
      if (!running) return;
      fg.loop();
      bg.loop();
      stepParallax();
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };
    const intersection = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 },
    );
    intersection.observe(heroModule);

    /* ---------- initial caption ---------- */
    later(() => {
      captionBox.classList.add("shown");
      showCaption(0, FIRST_CAPTION_DELAY);
    }, SHOWN_DELAY);

    const onCaptionClick = () => captionBox.classList.toggle("is--open");

    hiddenLayer.addEventListener("click", onClick);
    hiddenLayer.addEventListener("mouseover", onMouseOver);
    hiddenLayer.addEventListener("mouseout", onMouseOut);
    hiddenLayer.addEventListener("touchstart", onTouchStart, { passive: true });
    hiddenLayer.addEventListener("touchend", onTouchEnd);
    captionBox.addEventListener("click", onCaptionClick);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", calibrate);

    return () => {
      hiddenLayer.removeEventListener("click", onClick);
      hiddenLayer.removeEventListener("mouseover", onMouseOver);
      hiddenLayer.removeEventListener("mouseout", onMouseOut);
      hiddenLayer.removeEventListener("touchstart", onTouchStart);
      hiddenLayer.removeEventListener("touchend", onTouchEnd);
      captionBox.removeEventListener("click", onCaptionClick);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", calibrate);
      for (const id of timers) window.clearTimeout(id);
      timers.clear();
      stopTyping();
      stop();
      intersection.disconnect();
      resizeObserver.disconnect();
      fg.destroy();
      bg.destroy();
      hiddenLayer.classList.remove("show-interaction-tooltip");
      tooltip.classList.remove("add-opacity");
      captionBox.classList.remove("shown", "is--open");
      for (const [layer] of layers) layer.style.transform = "";
    };
  }, [shapes]);

  return (
    <div className="module main-hero full-width" ref={moduleRef}>
      <div id="hero-wrapper">
        <div className="container">
          <div id="hero-container" ref={containerRef}>
            <div
              className="hidden-layer parallax-scene"
              hero-animation-current-index="0"
              data-depth={DEPTH.hidden}
              ref={hiddenLayerRef}
            >
              {shapes.map((shape, i) => (
                <svg
                  key={shape.name}
                  hero-animation-index={i}
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width={`${shape.viewBox[0]}px`}
                  height={`${shape.viewBox[1]}px`}
                  viewBox={`0 0 ${shape.viewBox[0]} ${shape.viewBox[1]}`}
                  xmlSpace="preserve"
                  aria-hidden="true"
                >
                  {shape.polygons.map((polygon, j) => (
                    <polygon
                      key={j}
                      fill={polygon.fill}
                      points={polygon.points.map(([x, y]) => `${x},${y}`).join(" ")}
                    />
                  ))}
                </svg>
              ))}
            </div>
            <div id="cursor-tooltip" ref={tooltipRef}>
              Click to see more
            </div>
            <div className="layer-bg parallax-scene" data-depth={DEPTH.bg} ref={bgLayerRef}>
              <div className="inner">
                <canvas ref={bgCanvasRef} width={1656} height={1118} aria-hidden="true" />
              </div>
            </div>
            <div className="layer-fg parallax-scene" data-depth={DEPTH.fg} ref={fgLayerRef}>
              <div className="inner">
                <canvas ref={fgCanvasRef} width={1240} height={700} aria-hidden="true" />
              </div>
            </div>
            <div className="typewriter-container" ref={captionBoxRef}>
              <div className="mobile-info-tab">
                <span className="info-icon">
                  <InfoIcon />
                </span>
                <span className="tab-heading">
                  Why the <b ref={tabNameRef}>{shapes[0]?.name.toLowerCase()}</b>?
                </span>
                <span className="chevron-icon">
                  <ChevronRightIcon preserveAspectRatio="xMidYMid slice" />
                </span>
              </div>
              <div className="text-wrapper">
                <p id="typewriter">
                  <span className="Typewriter__wrapper" ref={typedRef} />
                  <span className="Typewriter__cursor">|</span>
                </p>
              </div>
            </div>
          </div>
          <div id="hero-text">
            <h1>
              <strong>Expanding what&apos;s possible</strong> through bold ideas, inspiring stories, and product
              innovation.
            </h1>
            <p>
              <Link href="/contact-us" className="cta_button hs-button free-consultation">
                Get a Free Consultation
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
