"use client";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useRef, useState } from "react";
import { site } from "@/content/site";
import { useReducedMotion } from "@/lib/motion";
import InterestGlyph from "./InterestGlyph";

type Frame = (typeof site.life.frames)[number];

/**
 * A contact sheet that runs sideways as you scroll down.
 * Desktop: the section pins and vertical scroll drives the strip.
 * Mobile / reduced motion: a native swipeable row with snap points.
 */
export default function LifeReel() {
  const frames = site.life.frames;
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  // Slide the strip by its overflow width, measured in px at runtime.
  const x = useTransform(p, (v) => {
    const el = track.current;
    if (!el) return 0;
    return -v * Math.max(0, el.scrollWidth - window.innerWidth);
  });
  const bar = useTransform(p, (v) => `${v * 100}%`);
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => setActive(Math.min(frames.length - 1, Math.round(v * (frames.length - 1)))));

  const header = (
    <div className="container-x flex items-end justify-between gap-6">
      <div>
        <p className="label-mono">Contact sheet</p>
        <p className="mt-3 max-w-[30ch] text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-tight tracking-[-0.03em]">
          {site.life.reelTitle} <span className="serif-accent">{site.life.reelTail}</span>
        </p>
      </div>
      <p className="display hidden text-[clamp(2.5rem,5vw,4.5rem)] tabular-nums md:block" aria-hidden>
        {String(active + 1).padStart(2, "0")}
        <span className="text-muted">/{String(frames.length).padStart(2, "0")}</span>
      </p>
    </div>
  );

  if (reduced) {
    return (
      <section aria-label="Photos" className="py-16">
        {header}
        <Strip frames={frames} className="mt-10 snap-x snap-mandatory overflow-x-auto pb-6" />
      </section>
    );
  }

  return (
    <>
      {/* Mobile: swipe */}
      <section aria-label="Photos" className="py-16 md:hidden">
        {header}
        <Strip frames={frames} className="mt-10 snap-x snap-mandatory overflow-x-auto pb-6 [scrollbar-width:none]" />
      </section>

      {/* Desktop: pinned, scroll driven */}
      <section ref={wrap} aria-label="Photos" className="relative hidden md:block" style={{ height: `${frames.length * 55 + 60}vh` }}>
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
          {header}
          <motion.div ref={track} style={{ x }} className="mt-12 flex w-max items-center gap-[clamp(1.5rem,3vw,3rem)] px-[var(--gutter)] will-change-transform">
            {frames.map((f, i) => (
              <FrameCard key={f.caption} f={f} i={i} progress={p} total={frames.length} />
            ))}
            <EndCard />
          </motion.div>
          <div className="container-x mt-12">
            <div className="relative h-px w-full bg-line">
              <motion.div className="absolute inset-y-0 left-0 bg-ink" style={{ width: bar }} />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-wider text-muted">
              <span>Scroll</span>
              <span>{frames[active].place}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Strip({ frames, className }: { frames: readonly Frame[]; className: string }) {
  return (
    <div className={className}>
      <ul className="flex w-max gap-5 px-[var(--gutter)]">
        {frames.map((f, i) => (
          <li key={f.caption} className="snap-center">
            <Photo f={f} i={i} total={frames.length} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FrameCard({ f, i, progress, total }: { f: Frame; i: number; progress: MotionValue<number>; total: number }) {
  // Each frame peaks (flat, full size) when the strip reaches it, tilting either side.
  const at = total > 1 ? i / (total - 1) : 0;
  const d = useTransform(progress, (v) => v - at);
  const rotate = useTransform(d, [-0.5, 0, 0.5], [i % 2 ? 5 : -5, 0, i % 2 ? -4 : 4]);
  const y = useTransform(d, [-0.5, 0, 0.5], [i % 2 ? 40 : -30, 0, i % 2 ? -30 : 40]);
  const imgX = useTransform(d, [-0.5, 0.5], ["8%", "-8%"]);
  return (
    <motion.div style={{ rotate, y }} className="shrink-0">
      <Photo f={f} i={i} total={total} imgX={imgX} />
    </motion.div>
  );
}

const SIZE: Record<string, string> = {
  portrait: "h-[min(56svh,520px)] aspect-[3/4]",
  landscape: "h-[min(44svh,400px)] aspect-[4/3]",
  square: "h-[min(48svh,440px)] aspect-square",
};

function Photo({ f, i, total, imgX }: { f: Frame; i: number; total: number; imgX?: MotionValue<string> }) {
  return (
    <figure className="group w-max">
      <div className={`relative overflow-hidden rounded-lg bg-surface ${SIZE[f.shape] ?? SIZE.square} max-md:h-[52svh]`}>
        {f.src ? (
          <motion.img
            src={f.src}
            alt={f.alt}
            loading="lazy"
            style={{ objectPosition: f.position, ...(imgX ? { x: imgX, scale: 1.18 } : {}) }}
            className="absolute inset-0 h-full w-full object-cover grayscale-[35%] transition-[filter] duration-700 group-hover:grayscale-0"
          />
        ) : (
          <Placeholder f={f} />
        )}
        {/* Film sprocket edges */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-3 pt-2 font-mono text-[9px] uppercase tracking-wider text-white mix-blend-difference">
          <span>{String(i + 1).padStart(2, "0")}A</span>
          <span>{f.coords}</span>
        </div>
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-6">
        <span className="text-[15px] font-medium tracking-[-0.02em]">{f.caption}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          {f.place} · {String(i + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  );
}

/** Stand-in until real photos land. Same frame, hatched, with the line glyph. */
function Placeholder({ f }: { f: Frame }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-ink">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, currentColor 0 1px, transparent 1px 10px)" }}
      />
      <div className="relative h-[28%] w-[55%]">
        <InterestGlyph kind={f.interest} />
      </div>
      <span className="relative font-mono text-[10px] uppercase tracking-wider text-muted">Photo coming soon</span>
    </div>
  );
}

function EndCard() {
  return (
    <div className="flex h-[min(44svh,400px)] w-[min(28vw,360px)] shrink-0 flex-col justify-end border-l border-line pl-8">
      <p className="label-mono">End of roll</p>
      <p className="mt-3 text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-tight tracking-[-0.03em]">
        Same discipline, <span className="serif-accent">on the clock.</span>
      </p>
    </div>
  );
}
