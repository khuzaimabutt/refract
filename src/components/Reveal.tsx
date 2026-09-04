"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import {
  registerScrollPlugins,
  revealHeadline,
  revealSupporting,
  onArrival,
} from "@/lib/reveal";

/**
 * Wraps a section and plays its arrival once.
 *
 * The headline rises out of its mask; everything marked as supporting follows a beat
 * later. Under reduced motion nothing is touched at all, which is why the static styles
 * have to stand on their own: there is no "animate to visible" fallback here, because a
 * fallback that depends on JavaScript is how pages end up blank.
 */
export function Reveal({
  children,
  /** Hero waits for the preloader; scroll sections wait for their own arrival. */
  when = "arrival",
  active = true,
}: {
  children: ReactNode;
  when?: "arrival" | "now";
  active?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    const root = ref.current;
    if (!root || played.current || prefersReducedMotion()) return;
    if (when === "now" && !active) return;

    registerScrollPlugins();

    const play = () => {
      if (played.current) return;
      played.current = true;
      const headline = root.querySelector<HTMLElement>("[data-reveal='headline']");
      const supporting = Array.from(root.querySelectorAll("[data-reveal='supporting']"));
      if (headline) revealHeadline(headline);
      if (supporting.length) revealSupporting(supporting, headline ? 0.22 : 0);
    };

    if (when === "now") {
      play();
      return;
    }
    const st = onArrival(root, play);
    return () => st.kill();
  }, [when, active]);

  return <div ref={ref}>{children}</div>;
}
