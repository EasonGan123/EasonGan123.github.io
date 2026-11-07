import { Fragment } from "react";

/** Renders "*word*" segments in Instrument Serif italic. */
export function Rich({ text, accentClass = "serif-accent" }: { text: string; accentClass?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? (
          <span key={i} className={accentClass}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

export const plain = (text: string) => text.replace(/\*/g, "");
