import { copy } from "@/content/copy";
import { Counters } from "@/components/Counters";

/** The quiet beat before the close: three figures, then the line admitting they are made up. */
export function ProofStrip() {
  return (
    <section className="proof" data-section="proof">
      <Counters>
        <div className="proof__stats">
        {copy.proof.stats.map((s) => (
          <div className="proof__stat" key={s.label}>
            <span className="proof__value" data-value={s.value} data-suffix={s.suffix} data-disperse>
              {s.value}
              {s.suffix}
            </span>
            <span className="proof__label">{s.label}</span>
          </div>
          ))}
        </div>
      </Counters>
      <p className="proof__line">{copy.proof.line}</p>
    </section>
  );
}
