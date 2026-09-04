import { copy } from "@/content/copy";

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
  return (
    <section className="hero" data-section="hero">
      <div className="hero__mark machine">{copy.brand}</div>

      <h1 className="hero__headline">
        <span className="line-mask">
          <span className="line">See through</span>
        </span>
        <span className="line-mask">
          <span className="line">your agents.</span>
        </span>
      </h1>

      <div className="hero__foot">
        <div className="hero__aside">
          <p className="hero__sub measure">{copy.hero.sub}</p>
          <a className="cta" href="#closing">
            {copy.hero.cta}
          </a>
        </div>
        <p className="hero__cue" aria-hidden>
          scroll
        </p>
      </div>
    </section>
  );
}
