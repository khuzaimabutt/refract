"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Radius of the drawn arc in user units; the circumference below depends on it. */
const R = 17;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** How far the ring opens over something clickable. A tenth is a hint, not an event. */
const HOVER_SCALE = 1.1;

/**
 * A ring that trails the pointer, with an arc showing how far down the page you are.
 *
 * On a page about refraction a circle you drag across the type reads as a lens, which
 * is why the shape earns its place rather than being an ornament borrowed from another
 * site. The arc reports scroll position, so it is a reading dial carried around under
 * the hand rather than decoration: empty at the top, full at the footer, and it runs
 * backwards when you scroll back up.
 *
 * Position is read straight from the document each frame rather than from a scroll
 * event or from the 3D scene's own progress value. That keeps it correct while Lenis
 * is easing between positions, and keeps it working on the poster path where there is
 * no WebGL scene running at all.
 *
 * The native cursor is deliberately left alone. Hiding it is the fashion, but it costs
 * a visitor the one thing they rely on to know where they are pointing, and on a page
 * this dark that is a poor trade.
 *
 * Over something clickable the ring opens slightly. Slightly is the point: a large jump
 * turns a quiet accent into the loudest thing on screen, and the ring competes with the
 * crystal it sits in front of.
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
    let lastScrollY = -1;
    let raf = 0;

    /**
     * What sits under a given point right now.
     *
     * Asked of the document rather than taken from an event target, because the answer
     * has to be recomputed when the page moves under a stationary cursor as well as
     * when the cursor moves over a still page.
     */
    const interactiveAt = (x: number, y: number) =>
      Boolean(document.elementFromPoint(x, y)?.closest("a, button, [role='button']"));

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      targetVisible = 1;
      targetScale = interactiveAt(e.clientX, e.clientY) ? HOVER_SCALE : 1;
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

      // How far through the document we are. The guard matters: a page shorter than
      // the viewport has nothing to scroll, and dividing by zero would leave the dial
      // stuck at NaN and blank.
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;
      arc.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - progress));

      // Scrolling moves the page under the cursor without firing a pointer event, so
      // a link scrolled out from beneath a stationary hand would otherwise leave the
      // ring stuck open. Only recomputed when the page has actually moved, since
      // hit-testing every frame is not free.
      if (y !== lastScrollY) {
        lastScrollY = y;
        if (pointer.x > -100) {
          targetScale = interactiveAt(pointer.x, pointer.y) ? HOVER_SCALE : 1;
        }
      }

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
