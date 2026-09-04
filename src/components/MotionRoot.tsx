"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Smooth scrolling, and the one clock everything else reads from.
 *
 * Lenis is used rather than a transform-based smooth scroll because it rides the real
 * scroll position instead of translating the page inside a wrapper. Keyboard scrolling,
 * anchors, find-in-page and screen readers all keep working, which is the whole reason
 * the technique is defensible on a site this animated.
 *
 * GSAP's ticker drives Lenis and Lenis drives ScrollTrigger's update, so the DOM
 * timelines and the 3D camera advance on the same frame. Running them on separate
 * loops is what makes an animated page feel like two pages sliding against each other.
 *
 * When the visitor has asked for reduced motion, none of this is created at all.
 */
export function MotionRoot({ children }: { children: ReactNode }) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current || prefersReducedMotion()) return;
    started.current = true;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.1 });
    // Exposed so tests and manual checks can assert smooth scrolling really is off
    // under reduced motion, rather than taking the absence of movement on trust.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      started.current = false;
    };
  }, []);

  return <>{children}</>;
}
