"use client";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site, type Project } from "@/content/site";
import { EASE, useFinePointer } from "@/lib/motion";
import Scramble from "./Scramble";

const projects = site.projects as readonly Project[];
const GROUPS: Project["group"][] = ["Ventures", "Community", "Consulting"];
const DENSITY: Record<string, number> = { "pickup-games": 7, handsonexams: 9, tourvista: 12, "fine-and-rare": 16, "pickup-for-good": 11 };

/** Abstract preview: dot density hints at each project's scale. */
function DotPreview({ p }: { p: Project }) {
  const d = DENSITY[p.id] ?? 12;
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1.4px)", backgroundSize: `${d}px ${d}px` }}
      />
      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent opacity-90"
        style={{ transform: `scale(${0.4 + (1 - d / 22) * 0.8})` }}
      />
    </>
  );
}

/** Hover card. Real product media when we have it, the dot card otherwise. */
export function Preview({ p, active = false }: { p: Project; active?: boolean }) {
  const m = p.media;
  if (!m) {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-ink text-bg">
        <DotPreview p={p} />
        <div className="relative flex h-full flex-col justify-between p-5">
          <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
            {p.index} · {p.category}
          </span>
          <div>
            <p className="display text-5xl">{p.resultValue}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider opacity-70">{p.resultLabel}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-ink text-bg shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {m.kind === "video" ? (
          <PreviewVideo src={m.src} poster={m.poster} active={active} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
        )}
        {p.link && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-md">
            {p.link.label.split("/")[0]} ↗
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-4 px-4 py-3">
        <p className="display text-3xl leading-none">{p.resultValue}</p>
        <p className="max-w-[60%] text-right font-mono text-[10px] uppercase leading-snug tracking-wider opacity-70">
          {p.product?.tagline ?? p.resultLabel}
        </p>
      </div>
    </div>
  );
}

function PreviewVideo({ src, poster, active }: { src: string; poster?: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
  }, [active]);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />;
}

function Row({ p, onHover }: { p: Project; onHover: (id: string | null) => void }) {
  const [hover, setHover] = useState(false);
  return (
    <li className="border-b border-line">
      <div
        onPointerEnter={() => {
          setHover(true);
          onHover(p.id);
        }}
        onPointerLeave={() => {
          setHover(false);
          onHover(null);
        }}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="group relative isolate grid grid-cols-[auto_1fr] items-baseline gap-x-4 py-6 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:grid-cols-12 md:gap-x-6 md:py-8 md:hover:py-11"
      >
        <span aria-hidden className="absolute inset-0 -z-10 -mx-3 rounded-lg bg-surface opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 md:-mx-5" />
        <span className="display text-[clamp(2rem,4.4vw,4rem)] text-muted transition-colors duration-300 group-hover:text-ink md:col-span-2">
          {p.index}
        </span>
        <span className="md:col-span-5">
          {/* Stretched link: the whole row opens the project page. */}
          <Link
            href={`/projects/${p.id}`}
            data-cursor="view"
            className="block text-[clamp(1.6rem,3.2vw,3rem)] font-medium leading-none tracking-[-0.04em] after:absolute after:inset-0 after:content-['']"
          >
            {p.name}
          </Link>
          <span className="label-mono mt-2 block normal-case tracking-normal">
            {p.role} · {p.period}
          </span>
          {(p.link || p.socials) && (
            <span className="mt-3 flex flex-wrap gap-2">
              {[...(p.link ? [p.link] : []), ...(p.socials ?? [])].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-[11px] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-bg"
                >
                  {l.label} <span aria-hidden>↗</span>
                </a>
              ))}
            </span>
          )}
        </span>
        <span className="col-span-2 mt-4 md:col-span-5 md:mt-0 md:text-right">
          <span className="display block text-[clamp(1.8rem,3vw,2.75rem)] leading-none">
            <Scramble text={p.resultValue} play={hover} />
          </span>
          <span className="mt-2 block text-sm text-muted">{p.oneLiner}</span>
        </span>
      </div>
    </li>
  );
}

export default function ProjectList() {
  const [hovered, setHovered] = useState<string | null>(null);
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  return (
    <div
      className="container-x pb-10"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
    >
      {GROUPS.map((g) => {
        const items = projects.filter((p) => p.group === g);
        if (!items.length) return null;
        return (
          <section key={g} aria-labelledby={`g-${g}`} className="mt-14 first:mt-0">
            <h2 id={`g-${g}`} className="label-mono flex items-center justify-between border-b border-line pb-3">
              <span>{g}</span>
              <span>{String(items.length).padStart(2, "0")}</span>
            </h2>
            <ul>
              {items.map((p) => (
                <Row key={p.id} p={p} onHover={setHovered} />
              ))}
            </ul>
          </section>
        );
      })}

      {fine && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 h-[240px] w-[340px]"
          style={{ x: sx, y: sy, translateX: 52, translateY: "-50%" }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {projects.map((p) => (
            <motion.div key={p.id} className="absolute inset-0" animate={{ opacity: hovered === p.id ? 1 : 0 }} transition={{ duration: 0.25 }}>
              <Preview p={p} active={hovered === p.id} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
