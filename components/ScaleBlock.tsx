"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { Rich } from "@/lib/rich";

/** Sticky moment: the dots collapse into a grid while the counter runs. */
export default function ScaleBlock() {
  const section = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = section.current;
    const el = counter.current;
    if (!root || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const state = { v: 0 };
    const render = () => (el.textContent = Math.round(state.v).toLocaleString("en-US"));
    render();
    const ctx = gsap.context(() => {
      gsap.to(state, {
        v: site.scale.count,
        ease: "power2.out",
        onUpdate: render,
        scrollTrigger: { trigger: root, start: "top 40%", end: "45% center", scrub: 0.5 },
      });
    }, root);
    return () => {
      ctx.revert();
      el.textContent = site.scale.count.toLocaleString("en-US");
    };
  }, []);

  return (
    <section ref={section} aria-labelledby="scale-title" className="relative h-[220vh]">
      <div data-scene-driver className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-8 pt-24 md:pb-10">
        <div className="container-x flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 id="scale-title" className="display text-[clamp(4rem,13vw,12rem)] tabular-nums">
            <span ref={counter}>{site.scale.count.toLocaleString("en-US")}</span>
          </h2>
          <p className="max-w-[30ch] text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-tight tracking-[-0.03em] md:pb-4 md:text-right">
            <Rich text={site.scale.caption} />
          </p>
        </div>
        <div className="container-x relative mt-6 flex-1 md:mt-10">
          <div data-scene="grid" data-scene-alpha="0.75" className="relative h-full w-full">
            <div
              data-fallback
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{ backgroundImage: "radial-gradient(var(--ink) 1px, transparent 1.5px)", backgroundSize: "10px 10px" }}
            />
          </div>
        </div>
        <div className="container-x mt-4 flex flex-col gap-1 md:flex-row md:justify-between">
          <p className="label-mono">1 dot = 1 player, scaled</p>
          <p className="label-mono">{site.scale.sub}</p>
        </div>
      </div>
    </section>
  );
}
