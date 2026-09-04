import { copy } from "@/content/copy";

/**
 * The handoff.
 *
 * Everything above this line belongs to a product that does not exist. This is where
 * the page stops performing and says who actually built it, which for a portfolio piece
 * is the only part with a job to do. So the name is set at display size rather than
 * being a credit in the fine print, and the disclosure leads rather than hides: naming
 * the fiction first is what earns the claim that follows it.
 *
 * The colophon is not decoration either. Typefaces, stack and measured figures are the
 * most persuasive content on the page for the people it is aimed at, and every number
 * in it is one we recorded rather than one that sounded good.
 */
export function Footer() {
  const { footer } = copy;

  return (
    <footer className="footer">
      <p className="footer__disclosure">
        {footer.disclosure} <span className="footer__turn">{footer.turn}</span>
      </p>

      <div className="footer__hand">
        <h2 className="footer__name" data-disperse>{footer.name}</h2>
        <p className="footer__role measure">{footer.role}</p>
        <div className="footer__links">
          <a className="footer__link" href={footer.contactHref}>
            {footer.contactLabel}
          </a>
          <a className="footer__link" href={footer.githubHref} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>

      <ul className="colophon">
        {footer.colophon.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </footer>
  );
}
