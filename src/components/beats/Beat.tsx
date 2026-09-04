import type { BeatCopy } from "@/content/copy";
import { UICard } from "./UICard";

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
      <div className="beat__text">
        <p className="stage-note">{beat.stageNote}</p>
        <h2 className="beat__headline">
          <span className="line-mask">
            <span className="line">{beat.headline}</span>
          </span>
        </h2>
        <p className="beat__body measure">{beat.body}</p>
      </div>
      <div className="beat__card">
        <UICard card={beat.card} />
      </div>
    </section>
  );
}
