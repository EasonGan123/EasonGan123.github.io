import Link from "next/link";
import { site } from "@/content/site";
import { MAP_ASPECT } from "@/lib/geo";
import { Rich } from "@/lib/rich";
import { spans } from "@/lib/timeline";

/**
 * One screen. The name is a particle shape; hovering a category row
 * re-forms the same dots into a preview of that page.
 */
export default function HomeHero() {
  const bars = spans();
  return (
    <section data-scene-driver aria-label="Introduction" className="relative flex min-h-[100svh] flex-col pb-8 pt-20 md:pb-10 md:pt-24">
      <div className="container-x flex justify-end">
        {site.status.show && (
          <p className="label-mono inline-flex items-center gap-2 rounded-full border border-line bg-bg/60 px-3 py-1.5 normal-case tracking-normal text-ink backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inset-0 rounded-full bg-accent" />
              <span className="relative h-2 w-2 rounded-full bg-accent" />
            </span>
            {site.status.text}
          </p>
        )}
      </div>

      {/* Stage: the name, plus invisible shapes the dots can preview */}
      <div className="container-x relative flex min-h-[34vh] flex-1 items-center py-6">
        <h1 data-scene="text" data-particle-text className="display -ml-[0.04em] text-[clamp(4.25rem,27vw,9rem)] uppercase md:text-[clamp(4rem,15.2vw,17rem)]">
          <span data-word>{site.firstName}</span> <span data-word>{site.lastName}</span>
        </h1>

        <div aria-hidden className="pointer-events-none invisible absolute inset-x-[var(--gutter)] bottom-6 top-16 hidden md:block">
          <div className="flex h-full items-center">
            <span data-preview="projects" data-scene="text" className="display text-[clamp(4rem,15.2vw,17rem)]">
              <span data-word>25,000+</span>
            </span>
          </div>
          <div data-preview="about" data-scene="map" data-scene-alpha="0.85" className="absolute inset-y-0 right-0 h-full" style={{ aspectRatio: MAP_ASPECT }} />
          <div className="absolute inset-0 flex items-center">
            <span data-preview="life" data-scene="text" className="display text-[clamp(4rem,13vw,15rem)]">
              <span data-word>Off the</span> <span data-word className="serif-accent tracking-[-0.03em]">clock.</span>
            </span>
          </div>
          <div data-preview="experience" data-scene="fill" data-scene-alpha="0.9" className="absolute inset-x-0 bottom-0 top-[8%]">
            {bars.map((b, i) => (
              <span
                key={b.p.id}
                data-fill
                className="absolute rounded-sm"
                style={{ left: `${b.left * 100}%`, width: `${b.width * 100}%`, top: `${i * 19}%`, height: "11%" }}
              />
            ))}
          </div>
        </div>

        {/* Captions fade in with each preview (desktop hover only) */}
        <div aria-hidden className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-6 top-6 hidden md:block">
          {site.categories.map((c) => (
            <p key={c.key} data-caption={c.key} className="label-mono absolute left-0 top-0 normal-case tracking-normal text-ink">
              <span className="text-accent">●</span> {c.caption}
            </p>
          ))}
          <div data-caption="experience" className="absolute inset-x-0 bottom-0 top-[calc(2.5rem+8%)]">
            {bars.map((b, i) => (
              <span
                key={b.p.id}
                className="label-mono absolute -translate-y-full whitespace-nowrap pb-1 text-ink"
                style={{ left: `${b.left * 100}%`, top: `${i * 19}%` }}
              >
                {b.p.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x grid-12 items-end gap-y-10">
        <div className="col-span-4 md:col-span-6">
          <p className="text-[clamp(1.6rem,3vw,2.75rem)] font-medium leading-[1.02] tracking-[-0.035em]">
            <Rich text={site.hero.oneLiner} />
            <br />
            <span className="text-muted">{site.hero.proof}</span>
          </p>
          <p className="label-mono mt-5 normal-case tracking-normal">{site.hero.subLine}</p>
        </div>

        <nav aria-label="Explore" className="col-span-4 md:col-span-5 md:col-start-8">
          <ul className="border-t border-line">
            {site.categories.map((c, i) => (
              <li key={c.key} className="border-b border-line">
                <Link
                  href={c.href}
                  data-focus={c.key}
                  className="group grid grid-cols-[2.25rem_1fr_auto] items-baseline gap-x-3 py-3.5 md:py-4"
                >
                  <span className="label-mono transition-colors duration-300 group-hover:text-accent">0{i + 1}</span>
                  <span className="flex flex-col gap-0.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="text-xl font-medium tracking-[-0.03em] md:text-2xl">{c.label}</span>
                    <span className="text-[13px] text-muted">{c.teaser}</span>
                  </span>
                  <span
                    aria-hidden
                    className="text-lg transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-45 group-hover:text-accent"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
