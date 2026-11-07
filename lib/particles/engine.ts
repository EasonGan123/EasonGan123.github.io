// "Every dot is a person": one persistent particle field behind every page.
//
// - Scenes are anchored to DOM elements, so shapes follow scrolling and
//   sticky sections with no extra bookkeeping.
// - The canvas outlives route changes. setScenes() swaps in the new page's
//   shapes and the dots spring from wherever they are: that IS the page
//   transition.
// - setFocus() blends in a temporary shape (homepage category hover).
// - Between scroll scenes, dots relax into a faint ambient field.
import { Renderer, Geometry, Program, Mesh } from "ogl";
import { fillScene, gridScene, mapScene, mulberry32, textScene, type ScenePoints } from "./scenes";

export type SceneKind = "text" | "map" | "grid" | "fill";
export type SceneSpec = {
  kind: SceneKind;
  /** Element the shape is drawn into. */
  shapeEl: HTMLElement;
  /** Element whose vertical center drives scroll transitions. */
  driverEl: HTMLElement;
  alpha?: number;
};

type Scene = SceneSpec & { pts: ScenePoints; ox: number; oy: number; prevOx: number; prevOy: number };

export type EngineOptions = {
  canvas: HTMLCanvasElement;
  worldDots: number[];
  reducedMotion: boolean;
  onReady?: () => void;
};

const vertex = /* glsl */ `
  attribute vec2 position;
  attribute float aRand;
  uniform vec2 uRes;
  uniform float uSize;
  uniform float uDpr;
  varying float vRand;
  void main() {
    vec2 c = position / uRes * 2.0 - 1.0;
    gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
    gl_PointSize = uSize * uDpr * (0.8 + aRand * 0.4);
    vRand = aRand;
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uAlpha;
  uniform float uAccentMix;
  varying float vRand;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float a = smoothstep(0.5, 0.32, r);
    float isAccent = step(0.996, vRand) * uAccentMix;
    vec3 col = mix(uColor, uAccent, isAccent);
    gl_FragColor = vec4(col, a * uAlpha * (0.72 + 0.28 * vRand));
  }
`;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function cssColor(name: string): [number, number, number] {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#0e0e0e";
  const hex = v.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const n = parseInt(full.slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const SCATTER_ALPHA = 0.16;

export function createEngine(opts: EngineOptions) {
  const { canvas, worldDots, reducedMotion } = opts;
  const isMobile = window.matchMedia("(max-width: 767px)").matches || navigator.hardwareConcurrency <= 4;
  const N = isMobile ? 2500 : 6000;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const renderer = new Renderer({ canvas, alpha: true, dpr, premultipliedAlpha: false, antialias: false, depth: false });
  const gl = renderer.gl;
  if (!gl) throw new Error("WebGL unavailable");
  gl.clearColor(0, 0, 0, 0);

  const rnd = mulberry32(42);
  const pos = new Float32Array(N * 2);
  const vel = new Float32Array(N * 2);
  const rand = new Float32Array(N);
  const phase = new Float32Array(N);
  const stiff = new Float32Array(N);
  const scatter = new Float32Array(N * 2);
  const scatterSeed = new Float32Array(N * 2);
  for (let i = 0; i < N; i++) {
    rand[i] = rnd();
    phase[i] = rnd() * Math.PI * 2;
    stiff[i] = 0.75 + rnd() * 0.5;
    scatterSeed[i * 2] = rnd();
    scatterSeed[i * 2 + 1] = rnd();
  }

  let W = window.innerWidth;
  let H = window.innerHeight;

  const geometry = new Geometry(gl, {
    position: { size: 2, data: pos },
    aRand: { size: 1, data: rand },
  });
  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uRes: { value: [W, H] },
      uSize: { value: 2 },
      uDpr: { value: dpr },
      uColor: { value: cssColor("--ink") },
      uAccent: { value: cssColor("--accent") },
      uAlpha: { value: 0 },
      uAccentMix: { value: 0 },
    },
  });
  const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

  // Built points are cached per element; cleared on width change.
  let cache = new WeakMap<HTMLElement, ScenePoints>();
  let specs: SceneSpec[] = [];
  let scenes: Scene[] = [];
  let seedCounter = 0;

  function points(s: SceneSpec): ScenePoints {
    const hit = cache.get(s.shapeEl);
    if (hit) return hit;
    const seed = 11 + seedCounter++;
    let p: ScenePoints;
    if (s.kind === "text") p = textScene(s.shapeEl, N, seed);
    else if (s.kind === "map") p = mapScene(s.shapeEl, worldDots, N, seed);
    else if (s.kind === "fill") p = fillScene(s.shapeEl, N, seed);
    else p = gridScene(s.shapeEl, N, seed);
    cache.set(s.shapeEl, p);
    return p;
  }

  function toScene(s: SceneSpec): Scene {
    const r = s.shapeEl.getBoundingClientRect();
    return { ...s, pts: points(s), ox: r.left, oy: r.top, prevOx: r.left, prevOy: r.top };
  }

  function build() {
    scenes = specs.filter((s) => s.shapeEl.isConnected).map(toScene);
    if (focus && focus.shapeEl.isConnected) focus = toScene(focus);
  }

  // Focus (hover) scene
  let focus: Scene | null = null;
  let focusW = 0;
  let focusTarget = 0;

  function layoutScatter() {
    for (let i = 0; i < N; i++) {
      scatter[i * 2] = scatterSeed[i * 2] * W;
      scatter[i * 2 + 1] = scatterSeed[i * 2 + 1] * H;
    }
  }

  function resize() {
    const nw = window.innerWidth;
    const nh = window.innerHeight;
    const widthChanged = nw !== W;
    W = nw;
    H = nh;
    renderer.setSize(W, H);
    program.uniforms.uRes.value = [W, H];
    layoutScatter();
    // Mobile URL bar toggles change height only; skip the expensive rebuild.
    if (widthChanged) {
      cache = new WeakMap();
      build();
    }
  }

  renderer.setSize(W, H);
  layoutScatter();
  // Dots start spread wide and drift in.
  for (let i = 0; i < N; i++) {
    const a = rnd() * Math.PI * 2;
    const d = Math.max(W, H) * (0.35 + rnd() * 0.6);
    pos[i * 2] = W / 2 + Math.cos(a) * d;
    pos[i * 2 + 1] = H / 2 + Math.sin(a) * d * 0.7;
  }

  const mouse = { x: -9999, y: -9999, active: false };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  };
  const onLeave = () => {
    mouse.active = false;
    mouse.x = mouse.y = -9999;
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 150);
  };
  window.addEventListener("resize", onResize);

  const themeObs = new MutationObserver(() => {
    program.uniforms.uColor.value = cssColor("--ink");
  });
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  let start = -1;
  let last = 0;
  let raf = 0;
  let readyFired = false;
  let running = true;
  const INTRO = reducedMotion ? 0 : 1600;

  // Scratch for per-frame base targets
  const baseT = new Float32Array(N * 2);

  function frame(now: number) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    if (start < 0) {
      start = now;
      last = now;
    }
    // rAF timestamps can precede performance.now(); never let dt go negative.
    const dt = Math.min(2.5, Math.max(0, (now - last) / 16.667));
    last = now;
    const t = (now - start) / 1000;
    const intro = INTRO ? easeOut(Math.min(1, (now - start) / INTRO)) : 1;

    for (const s of scenes) {
      const r = s.shapeEl.getBoundingClientRect();
      s.prevOx = s.ox;
      s.prevOy = s.oy;
      s.ox = r.left;
      s.oy = r.top;
    }
    if (focus) {
      const r = focus.shapeEl.getBoundingClientRect();
      focus.prevOx = focus.ox;
      focus.prevOy = focus.oy;
      focus.ox = r.left;
      focus.oy = r.top;
    }
    focusW = reducedMotion ? focusTarget : focusW + (focusTarget - focusW) * Math.min(1, (focusTarget ? 0.075 : 0.1) * dt);
    if (focusW < 0.002 && focusTarget === 0) focus = null;
    const fw = easeInOut(Math.min(1, Math.max(0, focusW)));

    // Which pair of scroll scenes are we between?
    let A: Scene | null = scenes[0] ?? null;
    let B: Scene | null = scenes[1] ?? null;
    let p = 0;
    if (scenes.length >= 2) {
      const mid = H / 2;
      let ia = 0;
      for (let i = 0; i < scenes.length - 1; i++) {
        const ra = scenes[i].driverEl.getBoundingClientRect();
        const rb = scenes[i + 1].driverEl.getBoundingClientRect();
        let ca = ra.top + ra.height / 2;
        // The first scene holds until the reader actually scrolls, even when
        // its section is shorter than the viewport.
        if (i === 0) ca = Math.max(ca, mid - window.scrollY);
        const cb = rb.top + rb.height / 2;
        const pp = (mid - ca) / Math.max(1, cb - ca);
        ia = i;
        p = Math.min(1, Math.max(0, pp));
        if (pp <= 1) break;
      }
      // The last scene may sit at the page bottom and never reach center.
      if (ia === scenes.length - 2) {
        const maxScroll = document.documentElement.scrollHeight - H;
        if (maxScroll > 0 && window.scrollY >= maxScroll - 2) p = 1;
      }
      A = scenes[ia];
      B = scenes[ia + 1];
    }

    let s1: number;
    let s2: number;
    if (!A) {
      s1 = 1;
      s2 = 0;
    } else if (!B) {
      s1 = 0;
      s2 = 0;
    } else if (reducedMotion) {
      s1 = 0;
      s2 = p >= 0.5 ? 1 : 0;
    } else {
      s1 = smooth(0.08, 0.42, p);
      s2 = smooth(0.58, 0.92, p);
    }
    const wA = A ? (1 - s1) * (1 - s2) : 0;
    const wS = A ? s1 * (1 - s2) : 1;
    const wB = B ? s2 : 0;

    let alpha = wA * (A?.alpha ?? 0.92) + wS * SCATTER_ALPHA + wB * (B?.alpha ?? 0.92);
    if (reducedMotion && B) alpha *= Math.min(1, Math.abs(p - 0.5) * 3);
    let size = wA * (A?.pts.size ?? 0) + wS * 1.6 + wB * (B?.pts.size ?? 0);
    let accent = (A?.kind === "grid" ? wA : 0) + (B?.kind === "grid" ? wB : 0);
    if (focus) {
      alpha = alpha * (1 - fw) + (focus.alpha ?? 0.92) * fw;
      size = size * (1 - fw) + focus.pts.size * fw;
      accent = accent * (1 - fw) + (focus.kind === "fill" ? fw : 0);
    }
    program.uniforms.uAlpha.value = alpha * (INTRO ? Math.min(1, (now - start) / 500) : 1);
    program.uniforms.uSize.value = size;
    program.uniforms.uAccentMix.value = accent;

    // Rigid translation from scrolling, so shapes do not lag behind content.
    let dX = (A ? wA * (A.ox - A.prevOx) : 0) + (B ? wB * (B.ox - B.prevOx) : 0);
    let dY = (A ? wA * (A.oy - A.prevOy) : 0) + (B ? wB * (B.oy - B.prevOy) : 0);
    if (focus) {
      dX = dX * (1 - fw) + (focus.ox - focus.prevOx) * fw;
      dY = dY * (1 - fw) + (focus.oy - focus.prevOy) * fw;
    }

    const tA = A?.pts.pts;
    const tB = B?.pts.pts;
    for (let i = 0; i < N; i++) {
      const ix = i * 2;
      const iy = ix + 1;
      const ph = phase[i];
      let tx = wS * (scatter[ix] + Math.sin(t * 0.21 + ph) * 18);
      let ty = wS * (scatter[iy] + Math.cos(t * 0.17 + ph * 1.3) * 18);
      if (tA && A) {
        tx += wA * (tA[ix] + A.ox);
        ty += wA * (tA[iy] + A.oy);
      }
      if (tB && B) {
        tx += wB * (tB[ix] + B.ox);
        ty += wB * (tB[iy] + B.oy);
      }
      if (focus) {
        tx = tx * (1 - fw) + (focus.pts.pts[ix] + focus.ox) * fw;
        ty = ty * (1 - fw) + (focus.pts.pts[iy] + focus.oy) * fw;
      }
      baseT[ix] = tx;
      baseT[iy] = ty;
    }

    if (reducedMotion) {
      pos.set(baseT);
    } else {
      const R = 110;
      const R2 = R * R;
      const k = 0.045 + 0.06 * intro;
      const damp = Math.pow(0.82, dt);
      const drift = isMobile ? 1.6 : 0.7;
      for (let i = 0; i < N; i++) {
        const ix = i * 2;
        const iy = ix + 1;
        const ph = phase[i];
        const tx = baseT[ix] + Math.sin(t * 0.9 + ph) * drift;
        const ty = baseT[iy] + Math.cos(t * 0.8 + ph) * drift;
        pos[ix] += dX * intro;
        pos[iy] += dY * intro;
        let vx = vel[ix] + (tx - pos[ix]) * k * stiff[i] * dt;
        let vy = vel[iy] + (ty - pos[iy]) * k * stiff[i] * dt;
        if (mouse.active) {
          const ddx = pos[ix] - mouse.x;
          const ddy = pos[iy] - mouse.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < R2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / R) * (1 - d / R) * 6 * dt;
            vx += (ddx / d) * f;
            vy += (ddy / d) * f;
          }
        }
        vx *= damp;
        vy *= damp;
        vel[ix] = vx;
        vel[iy] = vy;
        pos[ix] += vx * dt;
        pos[iy] += vy * dt;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    renderer.render({ scene: mesh });

    if (!readyFired && now - start > INTRO * 0.75) {
      readyFired = true;
      opts.onReady?.();
    }
  }
  raf = requestAnimationFrame(frame);

  return {
    setScenes(next: SceneSpec[]) {
      specs = next;
      build();
    },
    setFocus(spec: SceneSpec | null) {
      if (spec) {
        if (!focus || focus.shapeEl !== spec.shapeEl) {
          // Restart blend when switching between previews.
          if (focus) focusW = Math.min(focusW, 0.35);
          focus = toScene(spec);
        }
        focusTarget = 1;
      } else {
        focusTarget = 0;
      }
    },
    rebuild() {
      cache = new WeakMap();
      build();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      themeObs.disconnect();
      clearTimeout(resizeTimer);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
