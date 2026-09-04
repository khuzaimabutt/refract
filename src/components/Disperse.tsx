"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Splits text into colour fringes as the pointer passes over it.
 *
 * A generic digital scramble would be borrowed. This is the same physics the rest of
 * the page is built on: white light entering a dense medium separates into its
 * components, which is exactly what the crystal does to the headline behind it. Running
 * your cursor over a line of type does the same thing on a smaller scale, so the effect
 * reads as part of the idea rather than as an effect.
 *
 * Strength follows distance, so the split is strongest under the cursor and fades out
 * within a couple of hundred pixels, and it follows speed too: a slow drag barely
 * disturbs the type while a fast pass throws the channels wide.
 *
 * Implemented as two coloured shadows rather than duplicated DOM. The text stays one
 * selectable, screen-readable node, and the whole effect is a single text-shadow the
 * compositor can handle.
 */
export function Disperse({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-disperse]"));
    if (!targets.length) return;

    let px = -9999;
    let py = -9999;
    let speed = 0;
    let lastX = -9999;
    let lastY = -9999;
    let lastT = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      if (lastX > -9000) speed = Math.min(1, Math.hypot(e.clientX - lastX, e.clientY - lastY) / 55);
      lastX = e.clientX;
      lastY = e.clientY;
      px = e.clientX;
      py = e.clientY;
    };

    const tick = (now: number) => {
      // Decays against the clock, not the frame.
      //
      // Per-frame decay looked right at sixty frames a second and wrong everywhere
      // else: on a slow machine the split hung around for seconds after the hand
      // stopped, because the same multiplier was applied a tenth as often. Halving
      // roughly every 90ms is the same settle either way.
      const dt = lastT ? Math.min(now - lastT, 100) : 16;
      lastT = now;
      speed *= Math.pow(0.5, dt / 90);

      for (const el of targets) {
        const r = el.getBoundingClientRect();
        // Ignore anything off screen: reading its box is cheap, lighting it is not.
        if (r.bottom < -100 || r.top > window.innerHeight + 100) continue;

        const cx = Math.max(r.left, Math.min(px, r.right));
        const cy = Math.max(r.top, Math.min(py, r.bottom));
        const d = Math.hypot(px - cx, py - cy);
        const near = Math.max(0, 1 - d / 220);
        // Movement carries almost all of it. A resting cursor leaves the faintest
        // fringe, because a static three-pixel colour split sitting under someone's
        // hand stops being an effect and starts being a legibility problem.
        const amount = near * near * (0.07 + speed * 0.93);

        if (amount < 0.004) {
          if (el.style.textShadow) el.style.textShadow = "";
          continue;
        }
        const o = amount * 7;
        el.style.textShadow = `${-o}px 0 rgba(120, 220, 255, 0.6), ${o}px 0 rgba(255, 140, 170, 0.55)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      for (const el of targets) el.style.textShadow = "";
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
