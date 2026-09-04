"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import {
  registerScrollPlugins,
  prepareHeadline,
  playHeadline,
  prepareSupporting,
  playSupporting,
  onArrival,
} from "@/lib/reveal";

/**
 * Wraps a section and plays its arrival once.
 *
 * Hiding happens on mount, playing happens on arrival, and keeping those apart is the
 * whole point. Building the tween inside the scroll trigger meant gsap applied its start
 * values at that moment, so a section you had already scrolled to would snap out of view
 * and animate back in, reading as a flicker. Everything is parked out of sight here long
 * before it is anywhere near the viewport.
 *
 * Under reduced motion nothing is touched at all, which is why the static styles have to
 * stand on their own: there is no "animate to visible" fallback, because a fallback that
 * depends on JavaScript is how pages end up blank.
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
  const prepared = useRef<{ chars: Element[]; supporting: Element[] } | null>(null);
  const played = useRef(false);

  // Park everything out of sight as soon as the section mounts.
  useEffect(() => {
    const root = ref.current;
    if (!root || prepared.current || prefersReducedMotion()) return;
    registerScrollPlugins();

    const headline = root.querySelector<HTMLElement>("[data-reveal='headline']");
    const supporting = Array.from(root.querySelectorAll("[data-reveal='supporting']"));
    const chars = headline ? prepareHeadline(headline) : [];
    if (supporting.length) prepareSupporting(supporting);
    prepared.current = { chars, supporting };
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root || played.current || prefersReducedMotion()) return;
    if (when === "now" && !active) return;

    const play = () => {
      if (played.current || !prepared.current) return;
      played.current = true;
      const { chars, supporting } = prepared.current;
      if (chars.length) playHeadline(chars);
      if (supporting.length) playSupporting(supporting, chars.length ? 0.22 : 0);
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
