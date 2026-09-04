import type { BeatCopy } from "@/content/copy";

/**
 * The mocked product panel beside each beat.
 *
 * Deliberately not a rounded SaaS card with a drop shadow. It is a thin-ruled plate of
 * the same faintly cyan glass as the rest of the page, so it reads as another pane the
 * light passes through rather than a UI component pasted on top. Values are monospaced
 * because they are verbatim machine output; the words naming them are not.
 */
export function UICard({ card }: { card: BeatCopy["card"] }) {
  return (
    <figure className="card">
      <figcaption className="card__head machine">{card.title}</figcaption>
      <dl className="card__rows">
        {card.rows.map(([key, value]) => (
          <div className="card__row" key={key}>
            <dt className="card__key">{key}</dt>
            <dd className="card__val machine">{value}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
