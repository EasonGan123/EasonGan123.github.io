"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { EASE } from "@/lib/motion";

// First load renders content immediately (fast LCP, readable without JS).
// Only client-side navigations get the enter animation.
let navigated = false;

/** Each page rises in while the dots re-form behind it. */
export default function Template({ children }: { children: React.ReactNode }) {
  const animateIn = navigated;
  useEffect(() => {
    navigated = true;
  }, []);
  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 24 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
    >
      {children}
    </motion.div>
  );
}
