import { copy } from "@/content/copy";

export function Closing() {
  return (
    <section className="closing" id="closing" data-section="closing">
      <h2 className="closing__headline">
        <span className="line-mask">
          <span className="line">{copy.closing.headline}</span>
        </span>
      </h2>
      <a className="cta cta--lg" href={copy.footer.contactHref}>
        {copy.closing.cta}
      </a>
    </section>
  );
}
