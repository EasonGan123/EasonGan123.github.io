"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { NOW, YEARS, frac, spans } from "@/lib/timeline";

/**
 * Gantt of every role since 2023. The bars are outlines in HTML; the
 * particle field fills them with dots ("fill" scene).
 */
export default function Timeline() {
  const rows = spans();
  const now = frac(NOW) * 100;
  return (
    <section data-scene-driver aria-labelledby="timeline-title" className="relative flex min-h-[90svh] flex-col justify-center py-16">
      <div className="container-x">
        <div className="flex items-baseline justify-between border-b border-line pb-3">
          <h2 id="timeline-title" className="label-mono">
            Timeline · 2023 to now
          </h2>
          <p className="label-mono hidden sm:block">
            <span className="text-accent">●</span> {rows.filter((r) => r.ongoing).length} running today
          </p>
        </div>

        <div data-scene="fill" data-scene-alpha="0.9" className="relative">
          {/* Year grid + now marker, aligned to the track column */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 right-0 md:left-[34%]">
            {YEARS.map((y) => (
              <div key={y} className="absolute inset-y-0 border-l border-line" style={{ left: `${frac(y) * 100}%` }}>
                <span className="label-mono absolute -bottom-7 left-1">{y}</span>
              </div>
            ))}
            <div className="absolute inset-y-0 border-l border-accent" style={{ left: `${now}%` }}>
              <span className="label-mono absolute -bottom-7 left-1.5 text-ink">Now</span>
            </div>
          </div>

          <ol className="relative">
            {rows.map((r, i) => (
              <li key={r.p.id} className="border-b border-line last:border-b-0">
                <Link
                  href={`/projects/${r.p.id}`}
                  className="group grid grid-cols-1 gap-y-2 py-5 md:grid-cols-[34%_1fr] md:items-center md:py-6"
                >
                  <span className="flex items-baseline gap-3 md:pr-6">
                    <span className="label-mono w-6">{r.p.index}</span>
                    <span>
                      <span className="block text-lg font-medium tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 md:text-xl">
                        {r.p.name}
                      </span>
                      <span className="label-mono block normal-case tracking-normal">
                        {r.p.role} · {r.p.period}
                      </span>
                    </span>
                  </span>
                  <span className="relative block h-7 md:h-9">
                    {/* Static box is what the dots measure; the inner layer animates. */}
                    <span data-fill className="absolute inset-y-0" style={{ left: `${r.left * 100}%`, width: `${r.width * 100}%` }}>
                      <motion.span
                        className="absolute inset-0 origin-left rounded-[3px] border border-line bg-surface/40 transition-colors duration-300 group-hover:border-ink"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.08 }}
                      />
                    </span>
                    {r.ongoing && (
                      <span
                        aria-hidden
                        className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent"
                        style={{ left: `calc(${(r.left + r.width) * 100}% - 4px)` }}
                      />
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <div className="h-8" />
      </div>
    </section>
  );
}
