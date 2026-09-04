"use client";

import { copy } from "@/content/copy";
import { Reveal } from "./Reveal";
import { useEntered } from "./entered";

/**
 * The headline sits on the optical centre line rather than at the foot of the screen,
 * because the glass object floats there and the entire premise is that it bends these
 * words. Type parked safely below the object would never be refracted, and the page
 * would lose the one idea it is built on.
 *
 * The supporting line and the call to action drop to the base, out of the object's path,
 * so they stay readable while the headline is the thing being distorted.
 */
export function Hero() {
  const entered = useEntered();

  return (
    <section className="hero" data-section="hero">
      <div className="hero__mark machine">{copy.brand}</div>

      {/* The visible headline is rendered inside the 3D scene so the glass can
          actually refract it. This copy stays for search engines, screen readers
          and anyone selecting text, and is hidden from sight rather than from
          assistive technology. */}
      <h1 className="sr-only">{copy.hero.headline}</h1>

      {/* Shown only when the scene is not running, so the hero still has a visible
          headline for reduced-motion visitors and browsers without WebGL. */}
      <p className="hero__headline-fallback" aria-hidden>
        See through
        <br />
        your agents.
      </p>

      <div className="hero__foot">
        <Reveal when="now" active={entered}>
          <div className="hero__aside">
            <p className="hero__sub measure" data-reveal="supporting">
              {copy.hero.sub}
            </p>
            <a className="cta" data-reveal="supporting" href="#closing">
              {copy.hero.cta}
            </a>
          </div>
        </Reveal>
        <p className="hero__cue" aria-hidden>
          scroll
        </p>
      </div>
    </section>
  );
}
