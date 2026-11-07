import type { Metadata } from "next";
import { site } from "@/content/site";
import PageHeader from "@/components/PageHeader";
import Timeline from "@/components/Timeline";
import { FadeIn } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Experience",
  description: "Eason Gan's roles since 2023: Pickup Games, HandsOnExams, Tourvista, Pickup For Good and Fine and Rare. UC Berkeley Haas and Data Science.",
};

export default function ExperiencePage() {
  const edu = site.about.education[0];
  return (
    <>
      <PageHeader
        index="02"
        label="Experience"
        title="Experience"
        intro={site.pages.experience}
      />
      <Timeline />
      <section aria-label="Education and skills" className="container-x grid-12 gap-y-12 pb-10 pt-6">
        <FadeIn className="col-span-4 md:col-span-6">
          <h2 className="label-mono">Education</h2>
          <p className="mt-5 text-2xl font-medium tracking-[-0.03em] md:text-3xl">{edu.school}</p>
          <p className="mt-2 max-w-[44ch] text-muted">{edu.detail}</p>
          <p className="mt-4 inline-flex rounded-full border border-line px-3 py-1.5 font-mono text-xs text-ink">{edu.meta}</p>
          {site.about.education.slice(1).map((e) => (
            <div key={e.school} className="mt-8">
              <p className="text-lg font-medium tracking-[-0.02em]">{e.school}</p>
              <p className="text-muted">{e.detail}</p>
            </div>
          ))}
        </FadeIn>
        <FadeIn delay={0.08} className="col-span-4 md:col-span-5 md:col-start-8">
          <h2 className="label-mono">Toolkit</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {site.skills.map((s) => (
              <li key={s} className="rounded-full border border-line px-4 py-2 text-[15px] transition-colors hover:border-ink">
                {s}
              </li>
            ))}
          </ul>
        </FadeIn>
      </section>
    </>
  );
}
