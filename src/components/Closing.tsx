import { copy } from "@/content/copy";
import { Reveal } from "@/components/Reveal";

export function Closing() {
  return (
    <section className="closing" id="closing" data-section="closing">
      <Reveal>
        <h2 className="closing__headline" data-reveal="headline" data-disperse>
          {copy.closing.headline}
        </h2>
        <a className="cta cta--lg" data-reveal="supporting" href={copy.footer.contactHref}>
          {copy.closing.cta}
        </a>
      </Reveal>
    </section>
  );
}
