import type { Metadata } from "next";
import { site } from "@/content/site";
import Journey from "@/components/Journey";
import { FadeIn } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Eason Gan grew up across Shanghai, Hong Kong and London and now studies at UC Berkeley. Fluent in English, Mandarin and Cantonese.",
};

export default function AboutPage() {
  return (
    <>
      <Journey />
      <section aria-labelledby="lang-title" className="container-x grid-12 gap-y-10 pb-10 pt-16">
        <FadeIn className="col-span-4 md:col-span-5">
          <h2 id="lang-title" className="text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.04em]">
            Five languages,
            <br />
            <span className="text-muted">
              three of them <span className="serif-accent text-ink">fluent.</span>
            </span>
          </h2>
        </FadeIn>
        <FadeIn delay={0.08} className="col-span-4 md:col-span-6 md:col-start-7">
          <ul className="divide-y divide-line border-y border-line">
            {site.about.languages.map((l) => (
              <li key={l.name} className="group flex items-baseline justify-between py-4">
                <span className="text-xl tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
                  {l.name}
                </span>
                <span className="flex items-center gap-3">
                  <span aria-hidden className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((k) => (
                      <span
                        key={k}
                        className={`h-1.5 w-1.5 rounded-full ${k < (l.level === "Fluent" ? 5 : 3) ? "bg-ink" : "bg-line"}`}
                      />
                    ))}
                  </span>
                  <span className="label-mono w-28 text-right">{l.level}</span>
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>
    </>
  );
}
