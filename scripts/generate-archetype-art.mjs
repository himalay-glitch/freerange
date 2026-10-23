/**
 * Generates the ORIGINAL low-poly placeholder figures used by the archetype quiz and
 * result pages (public/placeholders/archetype-<slug>.svg). The live illustrations are
 * not reproduced; these are procedural, deterministic stand-ins in the brand palette.
 *
 *   node scripts/generate-archetype-art.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "placeholders");
const W = 1080;
const H = 1449;

/** Figure palettes: [skirt, torso, sleeves, accent]. Skin tone is shared. */
const ARCHETYPES = {
  creator: { seed: 11, skirt: "#e9d7bd", torso: "#d9a441", sleeves: "#f1e4cf", accent: "#ff4e00", hat: "beret" },
  leader: { seed: 23, skirt: "#1f3d6b", torso: "#308bf5", sleeves: "#2a5a9c", accent: "#f2c135", hat: "crown" },
  entertainer: { seed: 37, skirt: "#ff4e00", torso: "#ff7a3a", sleeves: "#ffb08a", accent: "#308bf5", hat: "tophat" },
  guardian: { seed: 41, skirt: "#2e6b3a", torso: "#56a65f", sleeves: "#3f8a4c", accent: "#f2c135", hat: "hood" },
  innovator: { seed: 53, skirt: "#425f80", torso: "#6ec1d6", sleeves: "#8fd2e2", accent: "#ff4e00", hat: "goggles" },
  sage: { seed: 67, skirt: "#032049", torso: "#425f80", sleeves: "#7f94b3", accent: "#f2c135", hat: "cone" },
};
const SKIN = "#f1e3d1";

/* ---------- helpers ---------- */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}
/** Lighten (k > 0) or darken (k < 0) towards white/black. */
function shade(hex, k) {
  const rgb = hexToRgb(hex);
  const target = k > 0 ? 255 : 0;
  const t = Math.abs(k);
  return rgbToHex(rgb.map((v) => v + (target - v) * t));
}

const lerp = (a, b, t) => a + (b - a) * t;
const bilerp = (p0, p1, p2, p3, u, v) => [
  lerp(lerp(p0[0], p1[0], u), lerp(p3[0], p2[0], u), v),
  lerp(lerp(p0[1], p1[1], u), lerp(p3[1], p2[1], u), v),
];

class Builder {
  constructor(seed) {
    this.rand = mulberry32(seed);
    this.polys = [];
  }
  tri(a, b, c, color) {
    this.poly([a, b, c], color);
  }
  /** Fill and a hairline stroke in the same colour hide anti-aliasing seams between facets. */
  poly(points, color) {
    const pts = points.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join(" ");
    this.polys.push(`<polygon points="${pts}" fill="${color}" stroke="${color}"/>`);
  }
  /** Faceted colour: base lighting from top-left plus random variation. */
  facet(base, u, v, amount = 0.16) {
    const light = (0.5 - u) * 0.18 + (0.5 - v) * 0.12;
    const noise = (this.rand() - 0.5) * 2 * amount;
    return shade(base, Math.max(-0.45, Math.min(0.45, light + noise)));
  }
  /** Quad (p0 top-left, p1 top-right, p2 bottom-right, p3 bottom-left) split into a jittered triangle grid. */
  quad(p0, p1, p2, p3, nx, ny, color, jitter = 10) {
    const grid = [];
    for (let j = 0; j <= ny; j++) {
      const row = [];
      for (let i = 0; i <= nx; i++) {
        const p = bilerp(p0, p1, p2, p3, i / nx, j / ny);
        if (i > 0 && i < nx && j > 0 && j < ny) {
          p[0] += (this.rand() - 0.5) * 2 * jitter;
          p[1] += (this.rand() - 0.5) * 2 * jitter;
        }
        row.push(p);
      }
      grid.push(row);
    }
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        const a = grid[j][i], b = grid[j][i + 1], c = grid[j + 1][i + 1], d = grid[j + 1][i];
        const u = (i + 0.5) / nx, v = (j + 0.5) / ny;
        if (this.rand() < 0.5) {
          this.tri(a, b, c, this.facet(color, u, v));
          this.tri(a, c, d, this.facet(color, u, v));
        } else {
          this.tri(a, b, d, this.facet(color, u, v));
          this.tri(b, c, d, this.facet(color, u, v));
        }
      }
    }
  }
  /** Disc split into jittered rings of triangles. */
  disc(cx, cy, r, rings, segs, color, jitter = 8) {
    const ringPts = [[[cx, cy]]];
    for (let k = 1; k <= rings; k++) {
      const row = [];
      const rr = (r * k) / rings;
      for (let s = 0; s < segs; s++) {
        const a = (s / segs) * Math.PI * 2 + (k % 2 ? Math.PI / segs : 0);
        let x = cx + Math.cos(a) * rr;
        let y = cy + Math.sin(a) * rr;
        if (k < rings) {
          x += (this.rand() - 0.5) * 2 * jitter;
          y += (this.rand() - 0.5) * 2 * jitter;
        }
        row.push([x, y]);
      }
      ringPts.push(row);
    }
    for (let k = 1; k <= rings; k++) {
      const inner = ringPts[k - 1], outer = ringPts[k];
      for (let s = 0; s < segs; s++) {
        const o1 = outer[s], o2 = outer[(s + 1) % segs];
        const u = 0.5 + (Math.cos((s / segs) * Math.PI * 2) * k) / rings / 2;
        const v = 0.5 + (Math.sin((s / segs) * Math.PI * 2) * k) / rings / 2;
        if (k === 1) {
          this.tri(inner[0], o1, o2, this.facet(color, u, v, 0.1));
        } else {
          const i1 = inner[s], i2 = inner[(s + 1) % segs];
          this.tri(i1, o1, o2, this.facet(color, u, v, 0.1));
          this.tri(i1, o2, i2, this.facet(color, u, v, 0.1));
        }
      }
    }
  }
  /** Small isometric cube (floating ornament). */
  cube(cx, cy, s, color) {
    const h = s * 0.5;
    const top = [[cx, cy - s], [cx + s * 0.87, cy - h], [cx, cy], [cx - s * 0.87, cy - h]];
    const left = [[cx - s * 0.87, cy - h], [cx, cy], [cx, cy + s], [cx - s * 0.87, cy + h]];
    const right = [[cx, cy], [cx + s * 0.87, cy - h], [cx + s * 0.87, cy + h], [cx, cy + s]];
    this.poly(top, shade(color, 0.25));
    this.poly(left, shade(color, -0.1));
    this.poly(right, shade(color, -0.3));
  }
}

function hat(b, kind, accent, torso) {
  const cx = 540, top = 250;
  switch (kind) {
    case "beret":
      b.quad([cx - 190, top + 70], [cx + 130, top + 20], [cx + 150, top + 95], [cx - 170, top + 125], 6, 2, accent, 6);
      b.disc(cx + 40, top + 12, 24, 2, 8, shade(accent, -0.2), 2);
      break;
    case "crown":
      b.poly([[cx - 120, top + 100], [cx - 120, top + 10], [cx - 60, top + 60], [cx, top - 10], [cx + 60, top + 60], [cx + 120, top + 10], [cx + 120, top + 100]], accent);
      b.quad([cx - 120, top + 70], [cx + 120, top + 70], [cx + 120, top + 110], [cx - 120, top + 110], 5, 1, shade(accent, -0.2), 4);
      break;
    case "tophat":
      b.quad([cx - 110, top - 120], [cx + 110, top - 120], [cx + 110, top + 80], [cx - 110, top + 80], 4, 4, torso, 8);
      b.quad([cx - 170, top + 70], [cx + 170, top + 70], [cx + 170, top + 100], [cx - 170, top + 100], 6, 1, shade(torso, -0.25), 3);
      b.quad([cx - 110, top + 40], [cx + 110, top + 40], [cx + 110, top + 70], [cx - 110, top + 70], 4, 1, accent, 3);
      break;
    case "hood":
      b.quad([cx - 210, top + 180], [cx - 60, top - 20], [cx + 60, top - 20], [cx + 210, top + 180], 6, 3, torso, 10);
      b.quad([cx - 230, top + 170], [cx - 150, top + 60], [cx - 110, top + 330], [cx - 200, top + 420], 2, 4, torso, 8);
      b.quad([cx + 150, top + 60], [cx + 230, top + 170], [cx + 200, top + 420], [cx + 110, top + 330], 2, 4, torso, 8);
      break;
    case "goggles":
      b.quad([cx - 150, top + 110], [cx + 150, top + 110], [cx + 150, top + 140], [cx - 150, top + 140], 6, 1, shade(torso, -0.3), 3);
      b.disc(cx - 70, top + 125, 48, 3, 10, accent, 3);
      b.disc(cx + 70, top + 125, 48, 3, 10, accent, 3);
      b.disc(cx - 70, top + 125, 26, 2, 8, "#ffffff", 2);
      b.disc(cx + 70, top + 125, 26, 2, 8, "#ffffff", 2);
      break;
    case "cone":
      b.quad([cx - 20, top - 170], [cx + 20, top - 170], [cx + 150, top + 100], [cx - 150, top + 100], 4, 6, torso, 8);
      b.quad([cx - 170, top + 80], [cx + 170, top + 80], [cx + 170, top + 110], [cx - 170, top + 110], 6, 1, accent, 3);
      break;
  }
}

function figure(slug, spec) {
  const b = new Builder(spec.seed);
  const cx = 540;

  // floating ornaments behind the figure
  b.cube(250, 320, 34, spec.accent);
  b.cube(830, 420, 26, spec.torso);
  b.cube(930, 1050, 30, spec.accent);
  b.cube(170, 1120, 22, spec.torso);

  // skirt / dress (wide trapezoid)
  b.quad([370, 900], [710, 900], [930, 1400], [150, 1400], 8, 9, spec.skirt, 14);
  // torso
  b.quad([400, 600], [680, 600], [710, 910], [370, 910], 6, 7, spec.torso, 10);
  // sleeves (angled outward)
  b.quad([400, 600], [480, 650], [300, 1010], [200, 960], 3, 7, spec.sleeves, 8);
  b.quad([600, 650], [680, 600], [880, 960], [780, 1010], 3, 7, spec.sleeves, 8);
  // hands
  b.disc(250, 1010, 44, 3, 9, SKIN, 3);
  b.disc(830, 1010, 44, 3, 9, SKIN, 3);
  // neck + head
  b.quad([495, 530], [585, 530], [592, 620], [488, 620], 2, 2, shade(SKIN, -0.12), 3);
  b.disc(cx, 400, 155, 7, 14, SKIN, 7);
  // eyes
  b.disc(cx - 55, 400, 14, 1, 8, "#2f2f34", 0);
  b.disc(cx + 55, 400, 14, 1, 8, "#2f2f34", 0);
  // beak / nose accent
  b.tri([cx - 16, 428], [cx + 16, 428], [cx, 462], spec.accent);
  // collar
  b.quad([450, 600], [630, 600], [600, 660], [480, 660], 3, 1, shade(spec.torso, 0.35), 4);
  // headwear
  hat(b, spec.hat, spec.accent, spec.torso);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${slug} archetype placeholder figure">`,
    `<title>${slug} archetype placeholder figure</title>`,
    `<g stroke-width=".6" stroke-linejoin="round">${b.polys.join("")}</g>`,
    `</svg>`,
  ].join("");
}

mkdirSync(OUT_DIR, { recursive: true });
for (const [slug, spec] of Object.entries(ARCHETYPES)) {
  const svg = figure(slug, spec);
  const file = join(OUT_DIR, `archetype-${slug}.svg`);
  writeFileSync(file, svg);
  console.log(`wrote ${file} (${(svg.length / 1024).toFixed(1)} KB)`);
}
