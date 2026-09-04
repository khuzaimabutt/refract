"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { shouldShowPreloader } from "@/lib/preloader";
import { copy } from "@/content/copy";

/**
 * The one page-load sequence.
 *
 * It exists to cover a real gap rather than to perform: the display face swaps in and
 * the first frame settles behind it. So it is bounded by what it is waiting for, with a
 * floor of 900ms so it does not flash, and a ceiling of 2s so a slow font never holds
 * the page hostage. Any click or key press ends it immediately.
 *
 * `onDone` is what starts the hero's own reveal, so the two never overlap.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [active, setActive] = useState(false);
  const [pct, setPct] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const finished = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion() || !shouldShowPreloader(window.sessionStorage)) {
      onDone();
      return;
    }
    setActive(true);

    const started = performance.now();
    const MIN = 900;
    const MAX = 2000;
    let raf = 0;

    const ready = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, MAX)),
    ]);
    let isReady = false;
    void ready.then(() => {
      isReady = true;
    });

    const step = () => {
      const elapsed = performance.now() - started;
      // The counter tracks the smaller of "time served" and "work done", so it never
      // sits at 99 waiting, and never races to 100 while fonts are still loading.
      const byTime = Math.min(1, elapsed / MIN);
      const target = isReady ? 1 : Math.min(byTime, 0.92);
      setPct((p) => Math.max(p, Math.round(target * 100)));

      if ((isReady && elapsed >= MIN) || elapsed >= MAX) {
        finish();
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    function finish() {
      if (finished.current) return;
      finished.current = true;
      cancelAnimationFrame(raf);
      setPct(100);
      const el = rootRef.current;
      if (!el) {
        setActive(false);
        onDone();
        return;
      }
      gsap.to(el, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
        ease: "power4.inOut",
        onComplete: () => {
          setActive(false);
          onDone();
        },
      });
    }

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [onDone]);

  if (!active) return null;

  return (
    <div ref={rootRef} className="preloader" role="status" aria-label="Loading">
      <span className="preloader__mark machine">{copy.brand}</span>
      <span className="preloader__pct machine">{String(pct).padStart(3, "0")}</span>
    </div>
  );
}
