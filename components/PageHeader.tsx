import Link from "next/link";
import type { ReactNode } from "react";
import SectionLabel from "./SectionLabel";

/**
 * Page title rendered as real HTML, then taken over by the particle field.
 * Navigating between pages makes the dots fly from one title into the next.
 */
export default function PageHeader({
  index,
  label,
  title,
  serifTail,
  intro,
  children,
  size = "lg",
  back,
}: {
  back?: { href: string; label: string };
  index: string;
  label: string;
  title: string;
  /** Optional last word rendered in serif italic. */
  serifTail?: string;
  intro?: ReactNode;
  children?: ReactNode;
  size?: "lg" | "md";
}) {
  const cls =
    size === "lg"
      ? "text-[clamp(3.75rem,19vw,8rem)] md:text-[clamp(4rem,13vw,13rem)]"
      : "text-[clamp(3.25rem,17vw,6rem)] md:text-[clamp(3.5rem,10vw,10rem)]";
  return (
    <header data-scene-driver className="relative flex min-h-[62svh] flex-col justify-end pb-10 pt-28 md:min-h-[70svh] md:pb-14">
      <div className="container-x">
        {back && (
          <Link href={back.href} className="label-mono link-draw mb-8 inline-block text-ink">
            ← {back.label}
          </Link>
        )}
        <SectionLabel index={index} label={label} />
        <h1 data-scene="text" data-particle-text className={`display -ml-[0.04em] mt-8 ${cls}`}>
          {title.split(" ").map((w, i) => (
            <span key={i}>
              {i > 0 && " "}
              <span data-word>{w}</span>
            </span>
          ))}
          {serifTail && (
            <>
              {" "}
              <span data-word className="serif-accent tracking-[-0.03em]">
                {serifTail}
              </span>
            </>
          )}
        </h1>
        {(intro || children) && (
          <div className="mt-8 grid-12 gap-y-6">
            {intro && <p className="col-span-4 max-w-[52ch] text-lg leading-relaxed text-muted md:col-span-6">{intro}</p>}
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
