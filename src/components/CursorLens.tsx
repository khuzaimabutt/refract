"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Radius of the drawn arc in user units; the circumference below depends on it. */
const R = 17;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * A ring that trails the pointer, with an arc that fills as you move.
 *
 * On a page about refraction a circle you drag across the type reads as a lens, which
 * is why the shape earns its place rather than being an ornament borrowed from another
 * site. The arc is what makes it feel alive: it charges with the distance travelled and
 * cycles, so moving across the screen visibly loads it and standing still leaves it be.
 *
 * The native cursor is deliberately left alone. Hiding it is the fashion, but it costs
 * a visitor the one thing they rely on to know where they are pointing, and on a page
 * this dark that is a poor trade.
 *
 * Only runs for a fine pointer, so phones never pay for it, and not at all under
 * reduced motion.
 */
export function CursorLens() {
  const ref = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = ref.current;
    const arc = arcRef.current;
    if (!el || !arc) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Start off screen so it never flashes in a corner before the first move.
    const pointer = { x: -200, y: -200 };
    const ring = { x: -200, y: -200 };
    let scale = 1;
    let targetScale = 1;
    let visible = 0;
    let targetVisible = 0;
    let charge = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      // Distance travelled is what fills the arc, so a slow deliberate move loads it
      // gradually and a flick across the page snaps it round.
      const dx = e.clientX - pointer.x;
      const dy = e.clientY - pointer.y;
      if (pointer.x > -100) charge += Math.hypot(dx, dy) / 1400;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      targetVisible = 1;
      const over = (e.target as Element | null)?.closest?.("a, button, [role='button']");
      targetScale = over ? 1.9 : 1;
    };
    const onLeave = () => {
      targetVisible = 0;
    };

    const tick = () => {
      const k = 0.14;
      ring.x += (pointer.x - ring.x) * k;
      ring.y += (pointer.y - ring.y) * k;
      scale += (targetScale - scale) * 0.12;
      visible += (targetVisible - visible) * 0.12;

      el.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      el.style.opacity = visible.toFixed(3);

      // Wraps rather than clamping, so the arc keeps cycling for as long as the
      // pointer keeps moving instead of filling once and dying.
      const p = charge % 1;
      arc.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - p));

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-lens" aria-hidden>
      <svg className="cursor-lens__svg" viewBox="0 0 38 38">
        {/* The full ring, faint: the track the arc runs on. */}
        <circle className="cursor-lens__track" cx="19" cy="19" r={R} />
        {/* The arc itself, rotated so it starts at twelve o'clock. */}
        <circle
          ref={arcRef}
          className="cursor-lens__arc"
          cx="19"
          cy="19"
          r={R}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>
    </div>
  );
}
