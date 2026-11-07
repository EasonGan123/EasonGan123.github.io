"use client";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: "0px 0px -10% 0px" },
  transition: { duration: 1.6, ease: EASE, delay },
});

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Line drawings that draw themselves in, then move subtly on hover. */
export default function InterestGlyph({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 160 100" className="h-full w-full overflow-visible" aria-hidden>
      {kind === "Soccer" && (
        <g className="origin-center transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-box:fill-box] group-hover:rotate-[72deg]">
          <motion.circle cx="80" cy="50" r="38" {...stroke} {...draw()} />
          <motion.path d="M80 34 L95 45 L89 63 L71 63 L65 45 Z" {...stroke} {...draw(0.3)} />
          <motion.path d="M80 34 V12 M95 45 L116 38 M89 63 L102 81 M71 63 L58 81 M65 45 L44 38" {...stroke} {...draw(0.5)} />
        </g>
      )}
      {kind === "Muay Thai" && (
        <g>
          {[14, 26, 38].map((r, i) => (
            <motion.circle
              key={r}
              cx="80"
              cy="50"
              r={r}
              {...stroke}
              {...draw(i * 0.2)}
              className="origin-center transition-transform duration-500 [transform-box:fill-box] group-hover:scale-110"
              style={{ transitionDelay: `${i * 60}ms` }}
            />
          ))}
          <motion.circle cx="80" cy="50" r="3" fill="var(--accent)" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.9, type: "spring" }} />
        </g>
      )}
      {kind === "Surfing" && (
        <g className="transition-transform duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-6">
          <motion.path d="M-10 60 C 10 40, 30 40, 50 60 S 90 80, 110 60 S 150 40, 170 60 S 210 80, 230 60" {...stroke} {...draw()} />
          <motion.path d="M-10 74 C 10 58, 30 58, 50 74 S 90 90, 110 74 S 150 58, 170 74" {...stroke} strokeOpacity={0.45} {...draw(0.25)} />
          <motion.path d="M50 60 C 56 36, 76 26, 96 34 C 82 34, 72 44, 70 56" {...stroke} {...draw(0.6)} />
        </g>
      )}
      {kind === "Hiking" && (
        <g>
          <motion.path d="M4 88 L30 60 L44 70 L64 34 L78 48 L96 22 L116 52 L130 44 L156 88" {...stroke} {...draw()} />
          <motion.path d="M4 88 H156" {...stroke} strokeOpacity={0.35} {...draw(0.2)} />
          <circle cx="96" cy="22" r="3" fill="var(--accent)" className="transition-transform duration-500 group-hover:-translate-y-1.5" />
        </g>
      )}
    </svg>
  );
}
