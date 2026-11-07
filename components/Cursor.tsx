"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useFinePointer, useReducedMotion } from "@/lib/motion";

type Mode = "default" | "hover" | "view";

/** Small accent dot that grows into a ring on interactive elements. */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("default");
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const cfg = reduced ? { stiffness: 2000, damping: 100 } : { stiffness: 700, damping: 45, mass: 0.35 };
  const sx = useSpring(x, cfg);
  const sy = useSpring(y, cfg);

  useEffect(() => {
    if (!fine) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = (e.target as Element | null)?.closest?.("[data-cursor], a, button, [role=button], input, label");
      if (!t) setMode("default");
      else setMode((t.getAttribute("data-cursor") as Mode) === "view" ? "view" : "hover");
    };
    const leave = () => setVisible(false);
    // UI under the pointer can change on click (overlays), so reset.
    const click = () => setMode("default");
    window.addEventListener("click", click);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("click", click);
      document.removeEventListener("pointerleave", leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;
  const size = mode === "view" ? 76 : mode === "hover" ? 40 : 8;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: mode === "default" ? "var(--accent)" : mode === "view" ? "var(--ink)" : "rgba(0,0,0,0)",
          borderWidth: mode === "hover" ? 1 : 0,
        }}
        style={{ borderColor: "var(--accent)", borderStyle: "solid" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <motion.span
          className="font-mono text-[11px] uppercase tracking-wider text-bg"
          animate={{ opacity: mode === "view" ? 1 : 0, scale: mode === "view" ? 1 : 0.6 }}
        >
          View
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
