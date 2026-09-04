"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { registerScrollPlugins, countUp, onArrival } from "@/lib/reveal";

/**
 * Counts the proof figures up on arrival.
 *
 * The final values are already in the markup, so a visitor with reduced motion, or with
 * JavaScript disabled, reads the real numbers rather than three zeros.
 */
export function Counters({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    registerScrollPlugins();

    const values = Array.from(root.querySelectorAll<HTMLElement>("[data-value]"));
    const st = onArrival(root, () => {
      for (const el of values) {
        const value = Number(el.dataset.value ?? 0);
        countUp(el, value, el.dataset.suffix ?? "");
      }
    });
    return () => st.kill();
  }, []);

  return <div ref={ref}>{children}</div>;
}
