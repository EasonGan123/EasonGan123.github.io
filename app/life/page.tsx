import type { Metadata } from "next";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";
import InterestGlyph from "@/components/InterestGlyph";
import { FadeIn } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Life",
  description: "Off the clock: soccer (Inter Milan Academy), Muay Thai, surfing and hiking Hong Kong's Dragon's Back and Lion Rock.",
};

export default function LifePage() {
  return (
    <>
      <PageHeader index="04" label="Life" title="Off the" serifTail="clock." intro={site.pages.life} />
      <section aria-label="Interests" className="container-x pb-10">
        <ul className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
          {site.interests.map((it, i) => (
            <li key={it.name} className="border-b border-r border-line">
              <FadeIn delay={(i % 2) * 0.08} className="group relative flex aspect-[4/3] flex-col justify-between p-6 md:aspect-[16/10] md:p-8">
                <div className="flex items-baseline justify-between">
                  <span className="label-mono">{String(i + 1).padStart(2, "0")}</span>
                  {it.note && <span className="serif-accent text-lg text-muted md:text-xl">{it.note}</span>}
                </div>
                <div className="mx-auto h-[38%] w-[52%] text-ink">
                  <InterestGlyph kind={it.name} />
                </div>
                <h2 className="text-[clamp(2rem,4.4vw,4rem)] font-medium leading-none tracking-[-0.045em] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                  {it.name}
                </h2>
              </FadeIn>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
