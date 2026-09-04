import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Scroll choreography.
 *
 * One rule governs everything here: a reveal plays once, when its section arrives, and
 * never again. Elements that re-animate every time they cross the viewport are the
 * clearest tell of a generated page, and they punish anyone scrolling back to reread.
 */

let registered = false;
export function registerScrollPlugins(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

/** Formats a counter value. Pure, so the rounding rule is testable without a browser. */
export function formatStat(value: number, suffix: string): string {
  return `${Math.round(value)}${suffix}`;
}

/**
 * Rises the characters of a headline out from behind their line mask.
 *
 * Split by line first, then by character, so each line gets its own mask and the
 * stagger reads left to right within a line rather than diagonally across the block.
 * SplitText's `mask` option builds the overflow wrapper for us.
 */
export function revealHeadline(el: HTMLElement, delay = 0): gsap.core.Timeline {
  const split = new SplitText(el, { type: "lines,chars", mask: "lines" });
  const tl = gsap.timeline({ delay });
  tl.from(split.chars, {
    yPercent: 118,
    duration: 1.1,
    ease: "power4.out",
    stagger: 0.016,
  });
  return tl;
}

/** Prose and controls follow their headline up, quieter and slower. */
export function revealSupporting(els: Element[], delay = 0): gsap.core.Timeline {
  return gsap.timeline({ delay }).from(els, {
    y: 18,
    autoAlpha: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.09,
  });
}

/**
 * Counts a figure up when it arrives.
 *
 * The tween drives a plain object and writes through formatStat, rather than animating
 * textContent directly, so the number never shows a fractional frame.
 */
export function countUp(el: HTMLElement, value: number, suffix: string): gsap.core.Tween {
  const state = { n: 0 };
  return gsap.to(state, {
    n: value,
    duration: 1.6,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = formatStat(state.n, suffix);
    },
  });
}

/** Plays `build` once, the first time `el` is well inside the viewport. */
export function onArrival(el: Element, build: () => void): ScrollTrigger {
  return ScrollTrigger.create({
    trigger: el,
    start: "top 72%",
    once: true,
    onEnter: build,
  });
}
