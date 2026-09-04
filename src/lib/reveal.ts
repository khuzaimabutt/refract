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
 * Splits a headline and parks its characters below their line mask.
 *
 * Preparing and playing are two separate steps on purpose. gsap.from() applies its
 * start values the moment the tween is created, so building the tween inside the
 * scroll trigger meant the text rendered normally, snapped to hidden as you reached
 * it, then animated back in. Reading as a flicker. Everything is hidden here, well
 * before the section is anywhere near the viewport, and the trigger only plays it.
 *
 * Split by line first, then by character, so each line gets its own mask and the
 * stagger reads left to right within a line rather than diagonally across the block.
 */
export function prepareHeadline(el: HTMLElement): Element[] {
  const split = new SplitText(el, { type: "lines,chars", mask: "lines" });
  gsap.set(split.chars, { yPercent: 118 });
  return split.chars;
}

export function playHeadline(chars: Element[], delay = 0): gsap.core.Timeline {
  return gsap.timeline({ delay }).to(chars, {
    yPercent: 0,
    duration: 1.1,
    ease: "power4.out",
    stagger: 0.016,
  });
}

/** Prose and controls follow their headline up, quieter and slower. */
export function prepareSupporting(els: Element[]): void {
  gsap.set(els, { y: 18, autoAlpha: 0 });
}

export function playSupporting(els: Element[], delay = 0): gsap.core.Timeline {
  return gsap.timeline({ delay }).to(els, {
    y: 0,
    autoAlpha: 1,
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
