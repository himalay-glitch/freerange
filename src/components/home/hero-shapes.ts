/**
 * Six ORIGINAL, procedurally generated low-poly shapes for the homepage hero.
 *
 * Each shape is a set of simple silhouettes (a leaf, a mountain range, a fish, a
 * star, a sailboat, a pine tree) that are Delaunay-triangulated into 150-250
 * triangles and shaded from a small warm palette. Generation is deterministic
 * (seeded PRNG), so the server and the client render identical markup.
 *
 * Coordinate space: 717 x 484.2, the same viewBox the original hero artwork used.
 */
import type { HeroShape } from "./shapeshifter";

export type { HeroShape };

type Pt = [number, number];
type Tri = [number, number, number];

interface PartDef {
  /** Closed outline (last point connects back to the first). */
  outline: Pt[];
  /** Colour ramp, dark to light. */
  ramp: string[];
  /** Target vertex spacing in px; smaller = more triangles. */
  spacing: number;
  /** Direction toward the light source, components in [-1, 1]. */
  light: Pt;
  /** Colour randomness in ramp steps (default 0.9). */
  jitter?: number;
}

interface ShapeDef {
  name: string;
  text: string;
  seed: number;
  parts: PartDef[];
}

export const HERO_VIEWBOX: [number, number] = [717, 484.2];

/* ---------- palette ---------- */
const ORANGE = "#ff4e00";
const TANGERINE = "#ff7a3d";
const AMBER = "#f2a01c";
const YELLOW = "#f2c135";
const RUST = "#be5b4e";
const EMBER = "#e0582a";
const BROWN = "#aa6d30";
const BARK = "#7a4a22";
const CHARCOAL = "#2f2f34";
const GRAPHITE = "#3b4a5c";
const SLATE = "#425f80";
const STEEL = "#5f7fa6";
const SKY = "#8aa6c8";
const MIST = "#b5cbe3";
const CLOUD = "#e9eef5";
const BLUE = "#308bf5";
const PINE = "#1f5c36";
const MOSS = "#245f3a";
const FOREST = "#2f7d4a";
const GREEN = "#3f9a5a";
const LEAF = "#5aa964";
const SPRING = "#79c06b";
const LIME = "#9bd36a";
const CREAM = "#f6e7c1";

/* ---------- seeded PRNG (mulberry32) ---------- */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- geometry helpers ---------- */
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function bounds(points: Pt[]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

function inside([px, py]: Pt, poly: Pt[]): boolean {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function distanceToOutline([px, py]: Pt, poly: Pt[]): number {
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[j];
    const [bx, by] = poly[i];
    const vx = bx - ax;
    const vy = by - ay;
    const l2 = vx * vx + vy * vy;
    const t = l2 ? clamp(((px - ax) * vx + (py - ay) * vy) / l2, 0, 1) : 0;
    const d = Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
    if (d < best) best = d;
  }
  return best;
}

/** Points along the outline, roughly `spacing` apart (every corner is kept). */
function resampleOutline(poly: Pt[], spacing: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const steps = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / spacing));
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}

/** Jittered hexagonal grid of interior points, kept clear of the outline. */
function interiorPoints(poly: Pt[], spacing: number, rng: () => number): Pt[] {
  const { minX, minY, maxX, maxY } = bounds(poly);
  const out: Pt[] = [];
  const rowHeight = spacing * 0.866;
  let row = 0;
  for (let y = minY + spacing * 0.5; y < maxY; y += rowHeight, row++) {
    const offset = row % 2 ? spacing / 2 : 0;
    for (let x = minX + offset; x < maxX; x += spacing) {
      const p: Pt = [x + (rng() - 0.5) * spacing * 0.5, y + (rng() - 0.5) * spacing * 0.5];
      if (inside(p, poly) && distanceToOutline(p, poly) > spacing * 0.4) out.push(p);
    }
  }
  return out;
}

interface CircumTri {
  a: number;
  b: number;
  c: number;
  x: number;
  y: number;
  r2: number;
}

function circumTriangle(pts: Pt[], a: number, b: number, c: number): CircumTri | null {
  const [ax, ay] = pts[a];
  const [bx, by] = pts[b];
  const [cx, cy] = pts[c];
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(d) < 1e-12) return null;
  const a2 = ax * ax + ay * ay;
  const b2 = bx * bx + by * by;
  const c2 = cx * cx + cy * cy;
  const x = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d;
  const y = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d;
  return { a, b, c, x, y, r2: (ax - x) ** 2 + (ay - y) ** 2 };
}

/** Bowyer-Watson Delaunay triangulation. Fine for a few hundred points. */
function delaunay(points: Pt[]): Tri[] {
  const n = points.length;
  if (n < 3) return [];
  const { minX, minY, maxX, maxY } = bounds(points);
  const span = Math.max(maxX - minX, maxY - minY) || 1;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const pts: Pt[] = points.concat([
    [midX - 20 * span, midY - span],
    [midX, midY + 20 * span],
    [midX + 20 * span, midY - span],
  ]);
  const seed = circumTriangle(pts, n, n + 1, n + 2);
  let tris: CircumTri[] = seed ? [seed] : [];
  for (let i = 0; i < n; i++) {
    const [px, py] = pts[i];
    const bad: CircumTri[] = [];
    const keep: CircumTri[] = [];
    for (const t of tris) ((px - t.x) ** 2 + (py - t.y) ** 2 < t.r2 ? bad : keep).push(t);
    const edgeCount = new Map<number, number>();
    const edges: [number, number][] = [];
    for (const t of bad) {
      for (const [u, v] of [
        [t.a, t.b],
        [t.b, t.c],
        [t.c, t.a],
      ] as [number, number][]) {
        const key = u < v ? u * 65536 + v : v * 65536 + u;
        const count = (edgeCount.get(key) ?? 0) + 1;
        edgeCount.set(key, count);
        if (count === 1) edges.push([u, v]);
      }
    }
    tris = keep;
    for (const [u, v] of edges) {
      const key = u < v ? u * 65536 + v : v * 65536 + u;
      if (edgeCount.get(key) !== 1) continue;
      const t = circumTriangle(pts, u, v, i);
      if (t) tris.push(t);
    }
  }
  return tris.filter((t) => t.a < n && t.b < n && t.c < n).map((t) => [t.a, t.b, t.c]);
}

/** Lens/leaf outline between two points; `halfWidth(t)` is the half-thickness along the axis. */
function lensOutline(a: Pt, b: Pt, halfWidth: (t: number) => number, segments = 22): Pt[] {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const upper: Pt[] = [];
  const lower: Pt[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const w = halfWidth(t);
    const px = a[0] + dx * t;
    const py = a[1] + dy * t;
    upper.push([px + nx * w, py + ny * w]);
    lower.push([px - nx * w, py - ny * w]);
  }
  const ring = upper.concat(lower.reverse());
  // drop consecutive duplicates (zero-width ends)
  return ring.filter((p, i) => {
    const q = ring[(i + 1) % ring.length];
    return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.01;
  });
}

function regularPolygon(cx: number, cy: number, r: number, sides: number, rotation = 0): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < sides; i++) {
    const a = rotation + (i / sides) * Math.PI * 2;
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return out;
}

const round1 = (v: number) => Math.round(v * 10) / 10;

/* ---------- builder ---------- */
function buildPart(def: PartDef, rng: () => number): HeroShape["polygons"] {
  const pts = resampleOutline(def.outline, def.spacing).concat(interiorPoints(def.outline, def.spacing, rng));
  const { minX, minY, maxX, maxY } = bounds(def.outline);
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const steps = def.ramp.length - 1;
  const jitter = def.jitter ?? 0.9;
  const out: HeroShape["polygons"] = [];
  for (const [a, b, c] of delaunay(pts)) {
    const A = pts[a];
    const B = pts[b];
    const C = pts[c];
    const cx = (A[0] + B[0] + C[0]) / 3;
    const cy = (A[1] + B[1] + C[1]) / 3;
    if (!inside([cx, cy], def.outline)) continue;
    const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
    if (area < 4) continue;
    const nx = ((cx - minX) / w) * 2 - 1;
    const ny = ((cy - minY) / h) * 2 - 1;
    const shade = 0.5 + 0.5 * (nx * def.light[0] + ny * def.light[1]);
    const index = clamp(Math.round(shade * steps + (rng() * 2 - 1) * jitter), 0, steps);
    out.push({
      points: [A, B, C].map(([x, y]) => [round1(x), round1(y)] as [number, number]),
      fill: def.ramp[index],
    });
  }
  return out;
}

function centroidX(p: HeroShape["polygons"][number]) {
  return p.points.reduce((s, [x]) => s + x, 0) / p.points.length;
}
function centroidY(p: HeroShape["polygons"][number]) {
  return p.points.reduce((s, [, y]) => s + y, 0) / p.points.length;
}

function buildShape(def: ShapeDef): HeroShape {
  const rng = mulberry32(def.seed);
  const polygons = def.parts.flatMap((part) => buildPart(part, rng));
  // Left-to-right order: polygon i of one shape morphs into polygon i of the next,
  // and the hover highlight ripples through the following siblings.
  polygons.sort((p, q) => centroidX(p) - centroidX(q) || centroidY(p) - centroidY(q));
  return { name: def.name, text: def.text, viewBox: HERO_VIEWBOX, polygons };
}

/* ---------- silhouettes ---------- */

// Shape One: a leaf, split along the midrib so the two halves catch the light differently.
const leafBase: Pt = [216, 432];
const leafTip: Pt = [546, 54];
const leafWidth = (t: number) => 96 * Math.pow(Math.sin(Math.PI * t), 0.8);
const leafRing = lensOutline(leafBase, leafTip, leafWidth, 24);
const leafUpper = leafRing.slice(0, 25); // base -> upper edge -> tip
const leafLower: Pt[] = [leafBase, ...leafRing.slice(25).reverse(), leafTip]; // base -> lower edge -> tip
const stemDir: Pt = [-0.66, 0.75];
const stemPerp: Pt = [0.75, 0.66];
const stemEnd: Pt = [leafBase[0] + stemDir[0] * 56, leafBase[1] + stemDir[1] * 56];
const leafStem: Pt[] = [
  [leafBase[0] + stemPerp[0] * 7, leafBase[1] + stemPerp[1] * 7],
  [leafBase[0] - stemPerp[0] * 7, leafBase[1] - stemPerp[1] * 7],
  [stemEnd[0] - stemPerp[0] * 5, stemEnd[1] - stemPerp[1] * 5],
  [stemEnd[0] + stemPerp[0] * 5, stemEnd[1] + stemPerp[1] * 5],
];

// Shape Three: a fish. The fins share the body's exact outline so nothing overlaps.
const fishNose: Pt = [178, 252];
const fishTail: Pt = [515, 252];
const fishHalf = (t: number) => 104 * Math.pow(Math.sin(Math.PI * t), 0.7);
const fishTop = (t: number): Pt => [fishNose[0] + (fishTail[0] - fishNose[0]) * t, fishNose[1] - fishHalf(t)];
const fishBottom = (t: number): Pt => [fishNose[0] + (fishTail[0] - fishNose[0]) * t, fishNose[1] + fishHalf(t)];

// Shape Four: a five-point star made of five kites that meet at the centre.
const starCentre: Pt = [360, 252];
const starOuter = 215;
const starInner = 92;
const starPoint = (deg: number, r: number): Pt => [
  starCentre[0] + Math.cos((deg * Math.PI) / 180) * r,
  starCentre[1] + Math.sin((deg * Math.PI) / 180) * r,
];
const starArms: Pt[][] = [0, 1, 2, 3, 4].map((k) => {
  const angle = -90 + 72 * k;
  return [starCentre, starPoint(angle - 36, starInner), starPoint(angle, starOuter), starPoint(angle + 36, starInner)];
});

const SHAPE_DEFS: ShapeDef[] = [
  {
    name: "Shape One",
    seed: 101,
    text:
      "Shape One is where the story starts: a single leaf, split down the middle so the light falls differently on each side. Click anywhere on the illustration and watch every facet travel to its place in the next shape.",
    parts: [
      { outline: leafUpper, ramp: [FOREST, GREEN, LEAF, SPRING, LIME], spacing: 31, light: [-0.5, -0.8] },
      { outline: leafLower, ramp: [MOSS, FOREST, GREEN, LEAF, YELLOW], spacing: 31, light: [0.4, 0.7] },
      { outline: leafStem, ramp: [BARK, BROWN], spacing: 30, light: [-0.5, -0.5], jitter: 0.5 },
    ],
  },
  {
    name: "Shape Two",
    seed: 202,
    text:
      "Shape Two is about scale: two ridges, one sun and a lot of sky to grow into. We like projects with a summit worth the climb, and a team that notices how the light changes on the way up.",
    parts: [
      {
        // back ridge, cut out behind the front ridge so the two never overlap
        outline: [
          [118, 440], [190, 255], [262, 335], [372, 118], [468, 262], [548, 196], [624, 440],
          [600, 440], [518, 352], [432, 246], [330, 380], [250, 340], [150, 440],
        ],
        ramp: [SLATE, STEEL, SKY, MIST, CLOUD],
        spacing: 33,
        light: [-0.3, -0.9],
      },
      {
        outline: [[150, 440], [250, 340], [330, 380], [432, 246], [518, 352], [600, 440]],
        ramp: [CHARCOAL, GRAPHITE, SLATE, STEEL, BLUE],
        spacing: 33,
        light: [0.4, -0.8],
      },
      { outline: regularPolygon(590, 92, 44, 12, -Math.PI / 2), ramp: [ORANGE, TANGERINE, YELLOW, CREAM], spacing: 26, light: [-0.5, -0.7] },
    ],
  },
  {
    name: "Shape Three",
    seed: 303,
    text:
      "Shape Three moves fast and turns on a fin. Quick, bright and curious, it is a reminder that good ideas rarely sit still, so the work has to be ready to change direction along with them.",
    parts: [
      { outline: lensOutline(fishNose, fishTail, fishHalf, 26), ramp: [RUST, EMBER, ORANGE, TANGERINE, "#ffa26b", YELLOW], spacing: 31, light: [-0.4, -0.85] },
      { outline: [[512, 252], [618, 148], [598, 252], [618, 356]], ramp: [BROWN, RUST, EMBER, ORANGE], spacing: 27, light: [0.5, -0.6] },
      { outline: [fishTop(0.33), [344, 90], [396, 98], fishTop(0.58), fishTop(0.52), fishTop(0.46), fishTop(0.4)], ramp: [RUST, ORANGE, YELLOW], spacing: 24, light: [-0.3, -0.9] },
      { outline: [fishBottom(0.3), [296, 392], fishBottom(0.45), fishBottom(0.4), fishBottom(0.35)], ramp: [BROWN, RUST, ORANGE], spacing: 22, light: [-0.6, 0.6] },
    ],
  },
  {
    name: "Shape Four",
    seed: 404,
    text:
      "Shape Four is a classic for a reason: five points, one centre, instantly recognisable from across the room. The strongest brands work the same way, simple enough to remember and bold enough to notice.",
    parts: starArms.map((outline, k) => ({
      outline,
      ramp: k % 2 ? [EMBER, TANGERINE, YELLOW, CREAM] : [RUST, ORANGE, AMBER, YELLOW],
      spacing: 29,
      light: [Math.cos(((-90 + 72 * k - 60) * Math.PI) / 180), Math.sin(((-90 + 72 * k - 60) * Math.PI) / 180)] as Pt,
    })),
  },
  {
    name: "Shape Five",
    seed: 505,
    text:
      "Shape Five sets out with the wind behind it and a clear horizon ahead. Momentum is a strategy when you know where you are going, and the best voyages begin with a well-trimmed plan.",
    parts: [
      { outline: [[146, 398], [596, 398], [548, 462], [192, 462]], ramp: [CHARCOAL, GRAPHITE, SLATE, STEEL], spacing: 34, light: [-0.4, -0.9] },
      { outline: [[372, 52], [455, 150], [540, 268], [606, 382], [372, 382]], ramp: [RUST, ORANGE, TANGERINE, YELLOW], spacing: 32, light: [-0.6, -0.7] },
      { outline: [[354, 100], [354, 382], [165, 382], [230, 265], [300, 165]], ramp: [BROWN, YELLOW, CREAM, CLOUD], spacing: 31, light: [0.6, -0.6] },
      { outline: [[360, 40], [368, 40], [368, 398], [360, 398]], ramp: [CHARCOAL, SLATE], spacing: 400, light: [0, -1], jitter: 0.3 },
      { outline: [[368, 40], [424, 58], [368, 76]], ramp: [ORANGE, YELLOW], spacing: 30, light: [-1, 0], jitter: 0.4 },
    ],
  },
  {
    name: "Shape Six",
    seed: 606,
    text:
      "Shape Six grows slowly, one layer at a time, and lasts for decades. Great products are built the same way: a solid trunk, honest iterations and plenty of room for the next ring.",
    parts: [
      { outline: [[360, 28], [262, 186], [458, 186]], ramp: [FOREST, GREEN, LEAF, SPRING, LIME], spacing: 32, light: [-0.6, -0.7] },
      { outline: [[312, 186], [408, 186], [518, 318], [202, 318]], ramp: [MOSS, FOREST, GREEN, LEAF, SPRING], spacing: 33, light: [-0.5, -0.8] },
      { outline: [[268, 318], [452, 318], [572, 428], [148, 428]], ramp: [PINE, MOSS, FOREST, GREEN, LEAF], spacing: 34, light: [-0.4, -0.9] },
      { outline: [[332, 428], [388, 428], [388, 484], [332, 484]], ramp: [BARK, BROWN, RUST], spacing: 24, light: [-0.8, -0.2] },
    ],
  },
];

export const HERO_SHAPES: HeroShape[] = SHAPE_DEFS.map(buildShape);
