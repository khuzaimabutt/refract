"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * A ring that trails the pointer.
 *
 * On a page about refraction a circle following your hand reads as a lens being moved
 * across the type, which is why it earns its place here rather than being decoration
 * borrowed from another site. It lags on purpose: arriving exactly with the pointer
 * would make it look welded on, and the delay is what gives it weight.
 *
 * The native cursor is deliberately left alone. Hiding it is the fashion, but it costs
 * a visitor the one thing they rely on to know where they are pointing, and on a page
 * this dark that is a poor trade. The ring is an accent around the cursor, not a
 * replacement for it.
 *
 * Only runs for a fine pointer, so phones and tablets never pay for it, and not at all
 * under reduced motion.
 */
export function CursorLens() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Start off screen so it never flashes at the top left before the first move.
    const pointer = { x: -200, y: -200 };
    const ring = { x: -200, y: -200 };
    let scale = 1;
    let targetScale = 1;
    let visible = 0;
    let targetVisible = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      targetVisible = 1;
      // Interactive things get a wider aperture, which is the only hover feedback
      // the ring gives and the only one it needs.
      const over = (e.target as Element | null)?.closest?.("a, button, [role='button']");
      targetScale = over ? 1.9 : 1;
    };
    const onLeave = () => {
      targetVisible = 0;
    };

    const tick = () => {
      // Frame-rate independent easing: the same feel at 60Hz and 120Hz, rather than
      // a ring that trails twice as fast on a high refresh display.
      const k = 0.14;
      ring.x += (pointer.x - ring.x) * k;
      ring.y += (pointer.y - ring.y) * k;
      scale += (targetScale - scale) * 0.12;
      visible += (targetVisible - visible) * 0.12;
      el.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      el.style.opacity = visible.toFixed(3);
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

  return <div ref={ref} className="cursor-lens" aria-hidden />;
}
