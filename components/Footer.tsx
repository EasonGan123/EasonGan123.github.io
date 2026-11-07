"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { site } from "@/content/site";
import { EASE, getLenis } from "@/lib/motion";
import LocalTime from "./LocalTime";
import Magnetic from "./Magnetic";
import ThemeToggle from "./ThemeToggle";

const pill =
  "inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm font-medium transition-colors duration-300 hover:bg-ink hover:text-bg";

/** Shared contact footer. Its heading is the last particle scene on every page. */
export default function Footer() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.contact.email}`;
    }
  };

  return (
    <footer id="contact" data-scene-driver aria-labelledby="contact-title" className="relative z-10 flex min-h-[85svh] flex-col pt-20">
      <div className="container-x flex flex-1 flex-col justify-center">
        <p className="label-mono">Contact</p>
        <h2
          id="contact-title"
          data-scene="text"
          data-particle-text
          className="display mt-6 self-start text-[clamp(4.5rem,22vw,8rem)] md:text-[clamp(4.5rem,13vw,14rem)]"
        >
          <span data-word>Let&apos;s</span> <span data-word className="serif-accent tracking-[-0.03em]">talk.</span>
        </h2>
        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <div className="relative">
            <p className="max-w-[38ch] text-muted">{site.contact.intro}</p>
            <button
              type="button"
              onClick={copy}
              aria-label={`Copy email address ${site.contact.email}`}
              className="group mt-3 text-left text-[clamp(1.5rem,4.4vw,4rem)] font-medium leading-none tracking-[-0.045em]"
            >
              <span className="link-draw [background-size:0%_2px] group-hover:[background-size:100%_2px]">{site.contact.email}</span>
            </button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="absolute -top-8 right-0 rounded-full bg-ink px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-bg md:left-auto"
                >
                  Copied
                </motion.span>
              )}
            </AnimatePresence>
            <span className="sr-only" aria-live="polite">
              {copied ? "Email copied to clipboard" : ""}
            </span>
          </div>
          <ul className="flex flex-wrap gap-3">
            <li>
              <Magnetic>
                <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" className={pill}>
                  LinkedIn ↗
                </a>
              </Magnetic>
            </li>
            <li>
              <Magnetic>
                <a href={site.contact.resume} download className={pill}>
                  Resume ↓
                </a>
              </Magnetic>
            </li>
            <li>
              <Magnetic>
                <a href={`mailto:${site.contact.email}`} className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-bg">
                  Email
                </a>
              </Magnetic>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-16 flex items-center justify-between gap-4 border-t border-line py-5">
        <p className="label-mono">© {new Date().getFullYear()} {site.name}</p>
        <LocalTime className="hidden sm:inline" />
        <div className="flex items-center gap-4">
          <div className="sm:hidden">
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => {
              const l = getLenis();
              if (l) l.scrollTo(0, { duration: 1.4 });
              else window.scrollTo({ top: 0 });
            }}
            className="label-mono link-draw text-ink"
          >
            Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
