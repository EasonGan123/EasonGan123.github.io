// Target-position generators. Each returns points relative to the
// anchor element's top-left corner, in CSS pixels.
import { LAT_TOP, MAP_H } from "@/lib/geo";

export type ScenePoints = { pts: Float32Array; size: number };

// Deterministic PRNG so scenes are stable between rebuilds.
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rnd: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Pick n points from candidates (flat xy array); repeat with jitter if short. */
function fill(cands: number[], n: number, jitter: number, seed: number): Float32Array {
  const rnd = mulberry32(seed);
  const count = cands.length / 2;
  const out = new Float32Array(n * 2);
  if (count === 0) return out;
  const order = shuffle(
    Array.from({ length: count }, (_, i) => i),
    rnd,
  );
  for (let i = 0; i < n; i++) {
    const k = order[i % count];
    const extra = i >= count ? jitter : 0;
    out[i * 2] = cands[k * 2] + (rnd() - 0.5) * extra;
    out[i * 2 + 1] = cands[k * 2 + 1] + (rnd() - 0.5) * extra;
  }
  return out;
}

/**
 * Rasterizes the element's text (each child span with its own computed
 * font) to an offscreen canvas and samples the inked pixels.
 */
export function textScene(el: HTMLElement, n: number, seed = 1): ScenePoints {
  const rect = el.getBoundingClientRect();
  const w = Math.max(1, Math.ceil(rect.width));
  const h = Math.max(1, Math.ceil(rect.height));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { pts: new Float32Array(n * 2), size: 2 };

  ctx.fillStyle = "#000";
  ctx.textBaseline = "alphabetic";

  const words = el.querySelectorAll<HTMLElement>("[data-word]");
  const targets = words.length ? Array.from(words) : [el];
  for (const word of targets) {
    const cs = getComputedStyle(word);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    // Approximate the CSS letter-spacing on canvas when supported.
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing;
    // Use client rects so wrapped words land on their own line.
    const range = document.createRange();
    range.selectNodeContents(word);
    const rects = range.getClientRects();
    const r = rects[0] ?? word.getBoundingClientRect();
    // Exact DOM baseline: a zero-size inline-block sits on it.
    const probe = document.createElement("span");
    probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline;";
    // Appended (not prepended): a leading probe can stay on the previous line at a wrap.
    word.appendChild(probe);
    const baseline = probe.getBoundingClientRect().top - rect.top;
    probe.remove();
    let text = word.textContent ?? "";
    if (cs.textTransform === "uppercase") text = text.toUpperCase();
    ctx.fillText(text, r.left - rect.left, baseline);
  }

  const data = ctx.getImageData(0, 0, w, h).data;
  // Choose a sampling step that yields roughly 1.6x n candidates.
  let inked = 0;
  for (let i = 3; i < data.length; i += 16) if (data[i] > 128) inked++;
  inked *= 4;
  const step = Math.max(1, Math.sqrt(inked / (n * 1.6)));
  const cands: number[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const idx = ((y | 0) * w + (x | 0)) * 4 + 3;
      if (data[idx] > 128) cands.push(x, y);
    }
  }
  const spacing = Math.sqrt(inked / n);
  return { pts: fill(cands, n, step * 0.8, seed), size: Math.min(3.2, Math.max(1.3, spacing * 0.95)) };
}

/** Dotted world map. dots is a flat [lon, lat, ...] array. */
export function mapScene(el: HTMLElement, dots: number[], n: number, seed = 2): ScenePoints {
  const rect = el.getBoundingClientRect();
  const sx = rect.width / 360;
  const sy = rect.height / MAP_H;
  const cands: number[] = [];
  for (let i = 0; i < dots.length; i += 2) {
    cands.push((dots[i] + 180) * sx, (LAT_TOP - dots[i + 1]) * sy);
  }
  const spacing = 1.5 * sx;
  return { pts: fill(cands, n, spacing * 0.35, seed), size: Math.min(3, Math.max(1.1, spacing * 0.5)) };
}

/** Dense uniform grid filling the element. */
export function gridScene(el: HTMLElement, n: number, seed = 3): ScenePoints {
  const rect = el.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const cols = Math.max(1, Math.round(Math.sqrt((n * w) / h)));
  // Only complete rows; leftover particles double up on existing cells.
  const rows = Math.max(1, Math.floor(n / cols));
  const dx = w / cols;
  const dy = h / rows;
  const cands: number[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) cands.push(c * dx + dx / 2, r * dy + dy / 2);
  }
  return { pts: fill(cands, n, 0, seed), size: Math.min(3, Math.max(1.2, Math.min(dx, dy) * 0.42)) };
}

/**
 * Fills every [data-fill] descendant's box with an even dot lattice,
 * dots shared out by area. Used for the experience timeline bars.
 */
export function fillScene(el: HTMLElement, n: number, seed = 4): ScenePoints {
  const rect = el.getBoundingClientRect();
  const boxes = Array.from(el.querySelectorAll<HTMLElement>("[data-fill]")).map((b) => b.getBoundingClientRect());
  const area = boxes.reduce((a, b) => a + b.width * b.height, 0);
  if (!boxes.length || area <= 0) return gridScene(el, n, seed);
  const s = Math.sqrt(area / n);
  const cands: number[] = [];
  for (const b of boxes) {
    const cols = Math.max(1, Math.round(b.width / s));
    const rows = Math.max(1, Math.round(b.height / s));
    const dx = b.width / cols;
    const dy = b.height / rows;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) cands.push(b.left - rect.left + c * dx + dx / 2, b.top - rect.top + r * dy + dy / 2);
  }
  return { pts: fill(cands, n, s * 0.3, seed), size: Math.min(3, Math.max(1.2, s * 0.5)) };
}
