"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import { registerScrollPlugins } from "@/lib/reveal";
import { beatStage } from "@/components/scene/scroll-progress";
import type { BeatCopy } from "@/content/copy";
import { UICard } from "./UICard";

/**
 * The three capabilities, told as one pinned sequence rather than three screens.
 *
 * Every section on this page used to be exactly one viewport tall, which made the
 * whole thing metronomic: you scrolled, a section left, another arrived, and the
 * rhythm never changed. Holding the stage still and letting scroll drive what happens
 * inside it is what turns a page into something that performs. The scroll distance is
 * long, but nothing moves past you: the content changes in place.
 *
 * Under reduced motion this collapses back to three ordinary stacked sections, because
 * pinning is scroll hijacking by another name and it has no business happening to
 * someone who asked for stillness.
 */
export function PinnedBeats({ beats }: { beats: BeatCopy[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    registerScrollPlugins();

    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    if (!panels.length) return;

    const ctx = gsap.context(() => {
      // Everything but the first panel starts out of the way. Set here rather than in
      // CSS so the static, no-JS page still stacks and reads normally.
      gsap.set(panels.slice(1), { autoAlpha: 0, yPercent: 12 });

      const stage = el.querySelector<HTMLElement>("[data-stage]");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          // One viewport of scroll per panel, plus a little to breathe on either end.
          end: () => `+=${window.innerHeight * (panels.length + 0.6)}`,
          pin: stage,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Handed to the 3D scene so the crystal can perform in step with the
            // panels instead of running its own clock.
            beatStage.value = self.progress;
          },
        },
      });

      // Sequential, never overlapping. Crossfading two stacked panels puts one
      // headline on top of another, and no amount of combined opacity makes two
      // sentences occupying the same lines readable.
      panels.forEach((panel, i) => {
        if (i === 0) return;
        // Short fades, barely apart. Long ones left a stretch of scroll with nothing
        // on screen at all, which reads as the page having broken rather than as a
        // deliberate change of subject.
        const at = i - 0.5;
        tl.to(panels[i - 1], { autoAlpha: 0, yPercent: -10, duration: 0.16, ease: "power2.in" }, at)
          .to(panel, { autoAlpha: 1, yPercent: 0, duration: 0.2, ease: "power2.out" }, at + 0.17);
      });

      // The last panel needs its own moment before the stage releases. Without this it
      // arrived and was immediately scrolled away, so the third capability got a
      // fraction of the time the first two did.
      tl.to({}, { duration: 0.55 });
    }, el);

    return () => {
      ctx.revert();
      beatStage.value = 0;
    };
  }, []);

  return (
    <div className="pinned" ref={root} data-section="beats">
      <div className="pinned__stage" data-stage>
        {beats.map((beat, i) => (
          <article
            className="pinned__panel"
            data-panel
            data-section={`beat-${beat.name.toLowerCase()}`}
            key={beat.name}
            style={{ zIndex: beats.length - i }}
          >
            <div className="pinned__text">
              <p className="stage-note" data-scramble>
                {beat.stageNote}
              </p>
              <h2 className="beat__headline" data-disperse>
                {beat.headline}
              </h2>
              <p className="beat__body measure" data-disperse>
                {beat.body}
              </p>
            </div>
            <div className="pinned__card">
              <UICard card={beat.card} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
