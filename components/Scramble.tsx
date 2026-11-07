"use client";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "0123456789#%$+/<>";

/** Text decode: characters resolve left to right from noise. */
export default function Scramble({ text, play, className = "" }: { text: string; play: boolean; className?: string }) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  useEffect(() => {
    if (!play || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    const start = performance.now();
    const dur = 520;
    const loop = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const solved = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < solved || ch === " " || ch === ",") s += ch;
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [play, text]);
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </span>
  );
}
