/**
 * Canvas "shapeshifter" morph engine for the homepage hero.
 *
 * A dependency-free TypeScript port of the behaviour of the original theme's
 * Shapeshifter class (theme-main.js): every polygon keeps a current and a target
 * set of points plus a current/target colour and opacity, and `loop()` lerps each
 * of them a little closer to its target every animation frame.
 *
 * Fidelity notes (all taken from the original source):
 * - The shape is scaled by canvas WIDTH only: `scale = canvasWidth * opts.scale / viewBoxWidth`,
 *   then centred in the canvas when `center` is true.
 * - Surplus polygons (`hide()`) collapse onto their own first vertex; polygons that
 *   are newly needed grow out of their own first vertex.
 * - Every polygon is stroked (0.3px) as well as filled; the stroke hides the
 *   anti-aliasing seams between adjacent triangles. In `strokeOnly` mode the fill
 *   stays fully transparent and the colour never changes.
 * - The original sets `hideInitialAnimation` but never reads it; here it is honoured:
 *   when true the first shape is drawn fully formed instead of growing in.
 */

export interface HeroShape {
  name: string;
  text: string;
  /** Width/height of the coordinate space the polygon points live in. */
  viewBox: [number, number];
  polygons: { points: [number, number][]; fill: string }[];
}

export interface ShapeshifterOptions {
  transformSpeed: { x: number; y: number };
  hideSpeed: { x: number; y: number };
  opacitySpeed: number;
  colorSpeed: number;
  /** Fraction of the canvas width the shape's viewBox width is scaled to. */
  scale: number;
  center: boolean;
  strokeOnly?: boolean;
  strokeOpacity?: number;
  hideInitialAnimation?: boolean;
}

type RGB = [number, number, number];
interface Pt {
  x: number;
  y: number;
}

const STROKE_WIDTH = 0.3;
const MAX_DPR = 3;

const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;

/** Parses `#rgb`, `#rrggbb` and `rgb()/rgba()` colours; anything else becomes black. */
function parseColor(input: string): RGB {
  const value = input.trim();
  if (value[0] === "#") {
    const hex = value.slice(1);
    const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
    const n = parseInt(full.slice(0, 6), 16);
    if (!Number.isNaN(n)) return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = value.match(/rgba?\(([^)]+)\)/);
  if (m) {
    const [r = 0, g = 0, b = 0] = m[1].split(",").map((s) => parseFloat(s));
    return [r, g, b];
  }
  return [0, 0, 0];
}

const toPts = (points: [number, number][]): Pt[] => points.map(([x, y]) => ({ x, y }));

class MorphPolygon {
  points: Pt[];
  newPoints: Pt[];
  color: RGB;
  targetColor: RGB;
  opacity: number;
  targetOpacity: number;
  hiding = false;

  constructor(
    private readonly opts: ShapeshifterOptions,
    source: HeroShape["polygons"][number],
    formed: boolean,
  ) {
    this.color = parseColor(source.fill);
    this.targetColor = [...this.color] as RGB;
    this.opacity = opts.strokeOnly ? 0 : 1;
    this.targetOpacity = this.opacity;
    this.newPoints = toPts(source.points);
    const origin = this.newPoints[0] ?? { x: 0, y: 0 };
    // Original behaviour: every point starts on the polygon's first vertex and grows out.
    this.points = this.newPoints.map((p) => (formed ? { x: p.x, y: p.y } : { x: origin.x, y: origin.y }));
  }

  /** Morph toward the polygon at the same index in the next shape. */
  transform(source: HeroShape["polygons"][number]) {
    this.hiding = false;
    this.targetColor = parseColor(source.fill);
    this.targetOpacity = this.opts.strokeOnly ? 0 : 1;
    this.newPoints = toPts(source.points);
    while (this.points.length < this.newPoints.length) {
      const origin = this.points[0];
      this.points.push(origin ? { x: origin.x, y: origin.y } : { x: 0, y: 0 });
    }
  }

  /** Collapse onto the first vertex (used when the next shape has fewer polygons). */
  hide() {
    this.hiding = true;
  }

  update() {
    const { transformSpeed, hideSpeed, colorSpeed, opacitySpeed, strokeOnly } = this.opts;
    const origin = this.points[0];
    if (!origin) return;
    if (this.hiding) {
      for (const p of this.points) {
        p.x = lerp(p.x, origin.x, hideSpeed.x);
        p.y = lerp(p.y, origin.y, hideSpeed.y);
      }
    } else {
      for (let i = 0; i < this.points.length; i++) {
        const p = this.points[i];
        const target = this.newPoints[i];
        if (target) {
          p.x = lerp(p.x, target.x, transformSpeed.x);
          p.y = lerp(p.y, target.y, transformSpeed.y);
        } else {
          // Extra vertices (previous shape had more points) chase the first vertex, 4x faster.
          p.x = lerp(p.x, origin.x, 4 * transformSpeed.x);
          p.y = lerp(p.y, origin.y, 4 * transformSpeed.y);
        }
      }
    }
    if (!strokeOnly) {
      for (let i = 0; i < 3; i++) this.color[i] = lerp(this.color[i], this.targetColor[i], colorSpeed);
      this.opacity = lerp(this.opacity, this.targetOpacity, opacitySpeed);
    }
  }

  draw(ctx: CanvasRenderingContext2D, ox: number, oy: number, scale: number, strokeOpacity: number) {
    if (this.points.length < 2) return;
    ctx.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const x = ox + p.x * scale;
      const y = oy + p.y * scale;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const r = Math.round(this.color[0]);
    const g = Math.round(this.color[1]);
    const b = Math.round(this.color[2]);
    ctx.lineWidth = STROKE_WIDTH;
    ctx.strokeStyle = `rgba(${r},${g},${b},${strokeOpacity})`;
    ctx.stroke();
    if (this.opacity > 0.002) {
      ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`;
      ctx.fill();
    }
  }
}

export class Shapeshifter {
  private ctx: CanvasRenderingContext2D | null;
  private polygons: MorphPolygon[];
  private viewBox: [number, number];
  private readonly strokeOpacity: number;
  private cssWidth = 0;
  private cssHeight = 0;
  private dpr = 1;
  private scale = 1;
  private x = 0;
  private y = 0;
  private newX: number | null = null;
  private newY: number | null = null;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    shape: HeroShape,
    private readonly opts: ShapeshifterOptions,
  ) {
    this.ctx = canvas.getContext("2d");
    this.viewBox = shape.viewBox;
    this.strokeOpacity = opts.strokeOpacity ?? 1;
    this.polygons = shape.polygons.map((p) => new MorphPolygon(opts, p, Boolean(opts.hideInitialAnimation)));
    this.resize();
  }

  /**
   * Size the backing store to the rendered size of the canvas (CSS px x devicePixelRatio)
   * and re-centre the shape. Pass the size when it is already known (ResizeObserver).
   */
  resize(width?: number, height?: number) {
    const w = Math.max(1, Math.round(width ?? this.canvas.clientWidth));
    const h = Math.max(1, Math.round(height ?? this.canvas.clientHeight));
    const dpr = typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, MAX_DPR);
    if (w !== this.cssWidth || h !== this.cssHeight || dpr !== this.dpr) {
      this.cssWidth = w;
      this.cssHeight = h;
      this.dpr = dpr;
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
    }
    this.layout(true);
  }

  /** Start morphing every polygon toward `next`. */
  transform(next: HeroShape) {
    this.viewBox = next.viewBox;
    this.layout(false);
    const count = Math.max(next.polygons.length, this.polygons.length);
    for (let i = 0; i < count; i++) {
      const source = next.polygons[i];
      const polygon = this.polygons[i];
      if (!polygon) {
        const created = new MorphPolygon(this.opts, source, false);
        this.polygons.push(created);
        created.transform(source);
      } else if (source) {
        polygon.transform(source);
      } else {
        polygon.hide();
      }
    }
  }

  /** One animation frame: advance every lerp and redraw. Call from requestAnimationFrame. */
  loop() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.cssWidth, this.cssHeight);
    if (this.newX !== null) this.x = lerp(this.x, this.newX, this.opts.transformSpeed.x);
    if (this.newY !== null) this.y = lerp(this.y, this.newY, this.opts.transformSpeed.y);
    for (const polygon of this.polygons) {
      polygon.update();
      polygon.draw(ctx, this.x, this.y, this.scale, this.strokeOpacity);
    }
  }

  destroy() {
    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    this.ctx = null;
    this.polygons = [];
  }

  private layout(immediate: boolean) {
    // Original: scale = canvas.width / (viewBoxWidth / opts.scale)
    this.scale = (this.cssWidth * this.opts.scale) / this.viewBox[0];
    const targetX = this.opts.center ? this.cssWidth / 2 - (this.viewBox[0] * this.scale) / 2 : 0;
    const targetY = this.opts.center ? this.cssHeight / 2 - (this.viewBox[1] * this.scale) / 2 : 0;
    if (immediate) {
      this.x = targetX;
      this.y = targetY;
      this.newX = null;
      this.newY = null;
    } else {
      this.newX = targetX;
      this.newY = targetY;
    }
  }
}
