import Link from "next/link";
import type { Project } from "@/content/site";
import { FadeIn } from "./Reveal";

type S = NonNullable<Project["showcase"]>;

const card =
  "group flex h-full flex-col justify-between gap-10 rounded-xl border border-line p-5 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-bg md:p-6";

/** Where to find it, who backed it, what we ran. */
export default function Showcase({ s }: { s: S }) {
  return (
    <section aria-label="Channels, partners and events" className="mt-16 md:mt-24">
      {/* Channels */}
      <ul className="grid gap-3 md:grid-cols-3">
        {s.channels.map((c, k) => {
          const inner = (
            <>
              <span className="flex items-center justify-between">
                <span className="label-mono transition-colors group-hover:text-bg/70">{c.kind}</span>
                <span aria-hidden className="text-xl transition-transform duration-500 group-hover:-rotate-45">
                  →
                </span>
              </span>
              <span>
                <span className="block text-[clamp(1.4rem,2.2vw,2rem)] font-medium leading-none tracking-[-0.04em]">{c.label}</span>
                <span className="mt-2 block text-sm text-muted transition-colors group-hover:text-bg/70">{c.meta}</span>
              </span>
            </>
          );
          return (
            <li key={c.href}>
              <FadeIn delay={k * 0.06} className="h-full">
              {c.internal ? (
                <Link href={c.href} className={card}>
                  {inner}
                </Link>
              ) : (
                <a href={c.href} target="_blank" rel="noopener noreferrer" className={card}>
                  {inner}
                </a>
              )}
              </FadeIn>
            </li>
          );
        })}
      </ul>

      {/* Partners */}
      <FadeIn className="mt-16 grid gap-6 border-t border-line pt-5 md:mt-20 md:grid-cols-3 md:gap-10">
        <h2 className="label-mono">Backed by</h2>
        <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-2 md:col-span-2">
          {s.partners.map((name, k) => (
            <li key={name} className="flex items-baseline gap-6">
              {k > 0 && <span aria-hidden className="h-1.5 w-1.5 -translate-y-[0.35em] rounded-full bg-accent" />}
              <span className="text-[clamp(2rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.05em]">{name}</span>
            </li>
          ))}
        </ul>
      </FadeIn>

      {/* Events */}
      <FadeIn className="mt-16 grid gap-6 border-t border-line pt-5 md:mt-20 md:grid-cols-3 md:gap-10">
        <h2 className="label-mono">Events</h2>
        <ol className="md:col-span-2">
          {s.events.map((e) => (
            <li key={e.name} className="grid gap-1 border-b border-line py-4 first:pt-0 last:border-b-0 md:grid-cols-[1fr_auto] md:gap-x-8">
              <span className="text-[19px] font-medium tracking-[-0.02em]">{e.name}</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted md:row-span-2 md:pt-1.5">{e.date}</span>
              <span className="text-muted">{e.note}</span>
            </li>
          ))}
        </ol>
      </FadeIn>
    </section>
  );
}
