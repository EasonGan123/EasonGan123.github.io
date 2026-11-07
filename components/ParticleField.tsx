"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { SceneKind, SceneSpec, createEngine } from "@/lib/particles/engine";

type Engine = ReturnType<typeof createEngine>;

/**
 * Markup contract (any page):
 *   data-scene="text|map|grid|fill"   element the dots form (in DOM order)
 *   data-scene-driver                 ancestor whose center drives scroll blending
 *   data-scene-alpha="0.8"            optional opacity
 *   data-preview="key"                a hover-only shape (not a scroll scene)
 *   data-focus="key"                  hovering/focusing this shows preview "key"
 */
function spec(el: HTMLElement): SceneSpec {
  return {
    kind: (el.dataset.scene as SceneKind) ?? "text",
    shapeEl: el,
    driverEl: el.closest<HTMLElement>("[data-scene-driver]") ?? el,
    alpha: el.dataset.sceneAlpha ? Number(el.dataset.sceneAlpha) : undefined,
  };
}

function scan(): SceneSpec[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-scene]:not([data-preview])")).map(spec);
}

export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const pathname = usePathname();

  // Boot once; the canvas persists across navigations.
  useEffect(() => {
    let destroyed = false;
    let cleanup: (() => void) | undefined;

    const boot = async () => {
      const canvas = ref.current;
      if (!canvas) return;
      await document.fonts?.ready;
      const root = document.documentElement;
      if (!root.classList.contains("seen")) {
        await new Promise<void>((res) => {
          window.addEventListener("preloader:done", () => res(), { once: true });
          setTimeout(res, 1600);
        });
      }
      const [{ createEngine }, dots] = await Promise.all([
        import("@/lib/particles/engine"),
        import("@/lib/world-dots.json").then((m) => m.default as number[]),
      ]);
      if (destroyed) return;

      try {
        const engine = createEngine({
          canvas,
          worldDots: dots,
          reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          onReady: () => root.classList.add("particles-on"),
        });
        engineRef.current = engine;
        engine.setScenes(scan());
        canvas.style.opacity = "1";

        // Shapes rebuild when their boxes change size (fonts, layout).
        let t = 0;
        const ro = new ResizeObserver(() => {
          clearTimeout(t);
          t = window.setTimeout(() => engine.rebuild(), 200);
        });
        const observeAll = () => {
          ro.disconnect();
          document.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => ro.observe(el));
        };
        observeAll();
        window.addEventListener("particles:rescan", observeAll);

        // Hover / keyboard focus previews
        // Any time the pointer/focus is not on a category, the dots return to
        // the page's own shape. A short delay avoids flicker between rows.
        let clearT = 0;
        const clear = () => {
          clearTimeout(clearT);
          clearT = window.setTimeout(() => {
            engine.setFocus(null);
            document.documentElement.dataset.previewing = "";
          }, 90);
        };
        const triggerOf = (t: EventTarget | null) => (t as Element | null)?.closest?.<HTMLElement>("[data-focus]") ?? null;
        const show = (target: EventTarget | null) => {
          const key = triggerOf(target)?.dataset.focus;
          const el = key ? document.querySelector<HTMLElement>(`[data-preview="${key}"]`) : null;
          if (!el || !key) return clear();
          clearTimeout(clearT);
          engine.setFocus(spec(el));
          document.documentElement.dataset.previewing = key;
        };
        const over = (e: PointerEvent) => e.pointerType === "mouse" && show(e.target);
        const out = (e: PointerEvent) => {
          if (triggerOf(e.target) && !triggerOf(e.relatedTarget)) clear();
        };
        const focusIn = (e: FocusEvent) => show(e.target);
        const focusOut = (e: FocusEvent) => {
          if (!triggerOf(e.relatedTarget)) clear();
        };
        document.addEventListener("pointerover", over);
        document.addEventListener("pointerout", out);
        document.addEventListener("focusin", focusIn);
        document.addEventListener("focusout", focusOut);
        document.documentElement.addEventListener("mouseleave", clear);
        window.addEventListener("blur", clear);

        cleanup = () => {
          clearTimeout(clearT);
          ro.disconnect();
          document.removeEventListener("pointerover", over);
          document.removeEventListener("pointerout", out);
          document.removeEventListener("focusin", focusIn);
          document.removeEventListener("focusout", focusOut);
          document.documentElement.removeEventListener("mouseleave", clear);
          window.removeEventListener("blur", clear);
          window.removeEventListener("particles:rescan", observeAll);
          engine.destroy();
          engineRef.current = null;
          root.classList.remove("particles-on");
        };
      } catch {
        // WebGL unavailable: the HTML text and SVG fallbacks stay visible.
        root.classList.remove("particles-on");
      }
    };

    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => void boot(), { timeout: 800 });
    else setTimeout(() => void boot(), 200);

    return () => {
      destroyed = true;
      cleanup?.();
    };
  }, []);

  // Route change: the new page's shapes become the targets. The dots fly
  // from the old shapes to the new ones, which is the page transition.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.setFocus(null);
    document.documentElement.dataset.previewing = "";
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        engine.setScenes(scan());
        window.dispatchEvent(new Event("particles:rescan"));
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-0 transition-opacity duration-700"
    />
  );
}
