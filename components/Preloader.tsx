"use client";
import { useEffect, useState } from "react";

/** 000 to 100 mono counter, then splits away. Skipped on repeat visits. */
export default function Preloader() {
  const [n, setN] = useState(0);
  const [phase, setPhase] = useState<"count" | "split" | "gone">("count");

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("seen")) {
      setPhase("gone");
      return;
    }
    const start = performance.now();
    const dur = 780;
    let raf = 0;
    const loop = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round((1 - Math.pow(1 - p, 2)) * 100));
      if (p < 1) raf = requestAnimationFrame(loop);
      else {
        setPhase("split");
        try {
          sessionStorage.setItem("seen", "1");
        } catch {}
        window.dispatchEvent(new Event("preloader:done"));
        setTimeout(() => setPhase("gone"), 420);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === "gone") return null;
  const split = phase === "split";
  const half = "absolute inset-x-0 h-1/2 bg-ink transition-transform duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
  return (
    <div className="preloader fixed inset-0 z-[90]" aria-hidden>
      <div className={`${half} top-0`} style={{ transform: split ? "translateY(-100%)" : "none" }} />
      <div className={`${half} bottom-0`} style={{ transform: split ? "translateY(100%)" : "none" }} />
      <div
        className="absolute inset-0 flex items-center justify-center font-mono text-sm tracking-[0.2em] text-bg transition-opacity duration-200"
        style={{ opacity: split ? 0 : 1 }}
      >
        {String(n).padStart(3, "0")}
      </div>
    </div>
  );
}
