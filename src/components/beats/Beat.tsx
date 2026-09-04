import type { BeatCopy } from "@/content/copy";
import { UICard } from "./UICard";
import { Reveal } from "@/components/Reveal";

/**
 * One capability, one screenful.
 *
 * `side` is which half the text occupies. It alternates so the glass object always has
 * the opposite half to travel through, and the text is displaced off its expected axis
 * by --shift, the layout's borrowed version of how a dense medium bends light sideways.
 */
export function Beat({ beat, side }: { beat: BeatCopy; side: "left" | "right" }) {
  return (
    <section className={`beat beat--${side}`} data-section={`beat-${beat.name.toLowerCase()}`}>
      <Reveal>
        <div className="beat__text">
          <p className="stage-note" data-reveal="supporting">
            {beat.stageNote}
          </p>
          <h2 className="beat__headline" data-reveal="headline" data-disperse>
            {beat.headline}
          </h2>
          <p className="beat__body measure" data-reveal="supporting" data-disperse>
            {beat.body}
          </p>
        </div>
      </Reveal>
      <div className="beat__card">
        <Reveal>
          <div data-reveal="supporting">
            <UICard card={beat.card} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
