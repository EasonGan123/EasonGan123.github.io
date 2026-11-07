import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, type Project } from "@/content/site";
import PageHeader from "@/components/PageHeader";
import ScaleBlock from "@/components/ScaleBlock";
import { FadeIn } from "@/components/Reveal";

const projects = site.projects as readonly Project[];

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.id === slug);
  if (!p) return {};
  return { title: p.name, description: `${p.role}, ${p.period}. ${p.card.result}` };
}

function Block({ title, paras, big, delay }: { title: string; paras: readonly string[]; big?: string; delay: number }) {
  return (
    <FadeIn delay={delay} className="border-t border-line pt-5">
      <h2 className="label-mono">{title}</h2>
      {big && (
        <p className="display mt-4 flex items-start gap-2 text-[clamp(3rem,6vw,5.5rem)]">
          {big}
          <span aria-hidden className="mt-[0.18em] h-3 w-3 shrink-0 rounded-full bg-accent" />
        </p>
      )}
      <div className="mt-4 space-y-3 text-[17px] leading-relaxed">
        {paras.map((t) => (
          <p key={t}>{t}</p>
        ))}
      </div>
    </FadeIn>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.id === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <article>
      <PageHeader
        index={p.index}
        label={`${p.group} · ${p.category}`}
        title={p.name}
        size="md"
        back={{ href: "/projects", label: "All projects" }}
        intro={`${p.role} · ${p.period}`}
      />

      <div className="container-x">
        <dl className="grid grid-cols-2 border-t border-line md:grid-cols-4">
          {p.expanded.facts.map((f, k) => (
            <FadeIn key={f.label} delay={k * 0.06} className="border-b border-line py-6 pr-4">
              <dt className="label-mono">{f.label}</dt>
              <dd className="display mt-3 text-[clamp(1.8rem,3.4vw,3rem)]">{f.value}</dd>
            </FadeIn>
          ))}
        </dl>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-10">
          <Block title="Problem" paras={p.expanded.problem} delay={0} />
          <Block title="What I did" paras={p.expanded.did} delay={0.08} />
          <Block title="Result" paras={p.expanded.result} big={p.resultValue} delay={0.16} />
        </div>

        <ul className="mt-14 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <li key={t} className="label-mono rounded-full border border-line px-3 py-1.5 normal-case tracking-normal">
              {t}
            </li>
          ))}
        </ul>
      </div>

      {p.id === "pickup-games" && <ScaleBlock />}

      <div className="container-x mt-24 md:mt-32">
        <Link href={`/projects/${next.id}`} className="group block border-y border-line py-10 md:py-14">
          <span className="label-mono">Next project</span>
          <span className="mt-4 flex items-baseline justify-between gap-6">
            <span className="text-[clamp(2.4rem,7vw,7rem)] font-medium leading-none tracking-[-0.05em] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3">
              {next.name}
            </span>
            <span aria-hidden className="text-[clamp(2rem,5vw,5rem)] transition-[transform,color] duration-500 group-hover:-rotate-45 group-hover:text-accent">
              →
            </span>
          </span>
        </Link>
      </div>
    </article>
  );
}
