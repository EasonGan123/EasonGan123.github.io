"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as "light" | "dark") ?? "light");
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSys = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("theme");
      } catch {}
      if (saved) return;
      const t = mq.matches ? "dark" : "light";
      document.documentElement.dataset.theme = t;
      setTheme(t);
    };
    mq.addEventListener("change", onSys);
    return () => mq.removeEventListener("change", onSys);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid h-8 w-8 place-items-center rounded-full border border-line transition-colors hover:border-ink"
    >
      <span
        aria-hidden
        className="block h-3 w-3 rounded-full border border-ink transition-[background] duration-300"
        style={{ background: "linear-gradient(90deg, var(--ink) 50%, transparent 50%)" }}
      />
    </button>
  );
}
