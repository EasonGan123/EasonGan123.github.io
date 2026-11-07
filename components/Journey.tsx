"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { MAP_ASPECT, MAP_H, MAP_W, project } from "@/lib/geo";
import { Rich } from "@/lib/rich";
import SectionLabel from "./SectionLabel";

const route = site.journey.route;
// Label offsets per route stop (Shanghai, Hong Kong, London, Berkeley).
const LABEL_POS = [
  "right-2 -top-5 md:right-auto md:left-2 md:-top-10",
  "right-2 top-1 md:right-auto md:left-2",
  "-left-6 -top-7 md:left-1 md:-top-12",
  "-left-1 top-2.5",
];
const markets = site.journey.expansion.markets;

/** Curved segment between two cities, bowed toward the pole. */
function arc(a: (typeof route)[number], b: (typeof route)[number]) {
  const [x1, y1] = project(a.lon, a.lat);
  const [x2, y2] = project(b.lon, b.lat);
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.min(28, dist * 0.22);
  return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
}

function pct(lon: number, lat: number) {
  const [x, y] = project(lon, lat);
  return { left: `${(x / MAP_W) * 100}%`, top: `${(y / MAP_H) * 100}%` };
}

/** Static dotted map for when WebGL is unavailable. */
function FallbackMap() {
  const [d, setD] = useState("");
  useEffect(() => {
    import("@/lib/world-dots.json").then((m) => {
      const pts = m.default as number[];
      let s = "";
      for (let i = 0; i < pts.length; i += 2) {
        const [x, y] = project(pts[i], pts[i + 1]);
        s += `M${x.toFixed(1)} ${y.toFixed(1)}h0`;
      }
      setD(s);
    });
  }, []);
  return (
    <svg data-fallback viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 h-full w-full" aria-hidden>
      <path d={d} stroke="currentColor" strokeOpacity="0.55" strokeWidth="0.75" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function Journey() {
  const section = useRef<HTMLElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const [stroke, setStroke] = useState(0.5);

  useEffect(() => {
    const el = map.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStroke((1.6 * MAP_W) / Math.max(1, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const segs = root.querySelectorAll<SVGPathElement>("[data-seg]");
    const cities = root.querySelectorAll<HTMLElement>("[data-city]");
    const mk = root.querySelectorAll<HTMLElement>("[data-market]");
    const mkLabel = root.querySelector<HTMLElement>("[data-market-label]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // Everything renders in its final state.

    const ctx = gsap.context(() => {
      gsap.set(segs, { strokeDashoffset: 1 });
      gsap.set([...cities].slice(1), { autoAlpha: 0, y: 6 });
      gsap.set([...mk, mkLabel], { autoAlpha: 0, scale: 0.4 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      tl.to({}, { duration: 0.6 }); // let the map form first
      segs.forEach((seg, i) => {
        tl.to(seg, { strokeDashoffset: 0, duration: 1 });
        tl.to(cities[i + 1], { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, "-=0.2");
      });
      tl.to([mkLabel, ...mk], { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.18, ease: "back.out(2)" }, "+=0.2");
      tl.to({}, { duration: 0.8 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={section} aria-labelledby="journey-title" className="relative h-[260vh]">
      <div data-scene-driver className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="container-x">
          <SectionLabel index="03" label="About" />
          <div className="grid-12 mt-6 gap-y-4 md:mt-8">
            <h1
              id="journey-title"
              className="col-span-4 text-[clamp(1.9rem,4.2vw,4rem)] font-medium leading-[0.98] tracking-[-0.04em] md:col-span-7"
            >
              <Rich text={site.about.heading} />
            </h1>
            <p className="col-span-4 max-w-[46ch] text-[15px] leading-relaxed text-muted md:col-span-4 md:col-start-9 md:self-end">
              {site.about.body}
            </p>
          </div>

          <div className="relative mx-auto mt-8 w-full max-w-[1280px] md:mt-12">
            <div ref={map} data-scene="map" data-scene-alpha="0.8" className="relative w-full" style={{ aspectRatio: `${MAP_ASPECT}` }}>
              <FallbackMap />
              <svg
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden
              >
                {route.slice(0, -1).map((c, i) => (
                  <path
                    key={c.name}
                    data-seg
                    d={arc(c, route[i + 1])}
                    pathLength={1}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray="1 1"
                  />
                ))}
              </svg>

              {route.map((c, i) => (
                <div key={c.name} data-city className="absolute" style={pct(c.lon, c.lat)}>
                  <span className="absolute -left-[4px] -top-[4px] h-2 w-2 rounded-full bg-accent ring-4 ring-bg" />
                  <span
                    className={`absolute whitespace-nowrap rounded-sm bg-bg/85 px-1 py-0.5 font-mono text-[10px] uppercase leading-tight tracking-wide md:text-[11px] ${LABEL_POS[i]}`}
                  >
                    <span className="text-ink">
                      {String(i + 1).padStart(2, "0")} {c.name}
                    </span>
                    <span className="hidden text-muted md:block">{c.note}</span>
                  </span>
                </div>
              ))}

              {markets.map((m) => (
                <div key={m.name} data-market className="absolute" style={pct(m.lon, m.lat)}>
                  <span className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5">
                    <span className="pulse-ring absolute inset-0 rounded-full bg-accent" />
                    <span className="absolute inset-[2px] rounded-full border border-accent bg-bg" />
                  </span>
                  <span className={`absolute hidden whitespace-nowrap rounded-sm bg-bg/85 px-1 font-mono text-[10px] uppercase text-muted md:block ${m.name === "Portugal" ? "right-3 top-0" : "left-3 -top-2"}`}>
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
            <p data-market-label className="label-mono mt-4 flex items-center gap-2 md:absolute md:bottom-2 md:left-0 md:mt-0">
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-accent" />
              {site.journey.expansion.label}: {markets.map((m) => m.name).join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Visually hidden summary of the journey for screen readers */}
      <ol className="sr-only">
        {route.map((c) => (
          <li key={c.name}>
            {c.name}: {c.note}
          </li>
        ))}
      </ol>
    </section>
  );
}
