"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Glyphs the text cycles through before settling. Kept close in weight to the real
 *  letters, so the line does not visibly darken while it resolves. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\<>[]{}=+*-";

/**
 * Resolves a line of text out of noise when it first arrives.
 *
 * The structure is borrowed from a site that does this well, and the borrowed part is
 * not the animation: it is the hidden twin. A copy of the real text sits underneath at
 * zero visibility purely to hold the width, while the animated copy is positioned over
 * it. Without that, every substituted glyph changes the measured width of the line and
 * the whole row jitters as it resolves. It is the detail most implementations miss.
 *
 * Applied to the small stage notes rather than the display headlines: scrambling type
 * set at seven per cent of the viewport reads as broken rather than as deliberate.
 */
export function Scramble({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const targets = Array.from(el.querySelectorAll<HTMLElement>("[data-scramble]"));
    if (!targets.length) return;

    const observers: IntersectionObserver[] = [];
    const timers: number[] = [];

    for (const node of targets) {
      const text = node.textContent ?? "";
      if (!text.trim()) continue;

      // Build the twin once. The hidden copy is the one that occupies layout.
      node.textContent = "";
      const wrap = document.createElement("span");
      wrap.style.cssText = "position:relative;display:inline-block;white-space:pre";
      const ghost = document.createElement("span");
      ghost.setAttribute("aria-hidden", "true");
      ghost.style.visibility = "hidden";
      ghost.textContent = text;
      const live = document.createElement("span");
      live.style.cssText = "position:absolute;inset:0";
      live.textContent = text;
      wrap.append(ghost, live);
      node.append(wrap);

      let frame = 0;
      const run = () => {
        const total = 26;
        const step = () => {
          frame++;
          // Each character settles at its own moment, left to right, so the line
          // resolves as a wipe rather than snapping whole.
          const settled = (frame / total) * text.length;
          live.textContent = text
            .split("")
            .map((ch, i) => {
              if (ch === " ") return " ";
              if (i < settled) return ch;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join("");
          if (frame < total) timers.push(requestAnimationFrame(step));
          else live.textContent = text;
        };
        step();
      };

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              io.disconnect();
              run();
            }
          }
        },
        { threshold: 0.6 },
      );
      io.observe(node);
      observers.push(io);
    }

    return () => {
      for (const io of observers) io.disconnect();
      for (const t of timers) cancelAnimationFrame(t);
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
