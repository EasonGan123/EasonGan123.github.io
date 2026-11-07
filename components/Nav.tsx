"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { EASE } from "@/lib/motion";
import LocalTime from "./LocalTime";
import ThemeToggle from "./ThemeToggle";

export const NAV = site.categories.map((c) => ({ href: c.href, label: c.label }));

export default function Nav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      if (Math.abs(dy) > 4) setHidden(dy > 0 && y > 120);
      setScrolled(y > 24);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setHidden(false), [pathname]);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <div
        className={`border-b transition-[background-color,backdrop-filter,border-color] duration-300 ${
          scrolled ? "border-line bg-bg/75 backdrop-blur-md" : "border-transparent"
        }`}
      >
        <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/" className="text-[15px] font-semibold tracking-[-0.04em]" aria-label={`${site.monogram}, ${site.name}, home`}>
            {site.monogram}
          </Link>
          <div className="flex items-center gap-4 md:gap-8">
            <LocalTime className="hidden lg:inline" />
            <ul className="flex items-center gap-3 text-[13px] sm:gap-5 sm:text-sm">
              {NAV.map((l) => {
                const path = pathname.replace(/\/$/, "") || "/";
                const active = path === l.href || path.startsWith(l.href + "/");
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative inline-flex items-center gap-1.5 transition-colors ${active ? "text-ink" : "text-muted hover:text-ink"}`}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-dot"
                          className="h-1.5 w-1.5 rounded-full bg-accent"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
