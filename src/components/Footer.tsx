import { copy } from "@/content/copy";

/**
 * The disclosure is not fine print hidden at the bottom of a fake company site. It is
 * the first line of the footer, at reading size, because the page has to be honest
 * about being a demonstration.
 */
export function Footer() {
  return (
    <footer className="footer">
      <p className="footer__disclosure">{copy.footer.disclosure}</p>
      <div className="footer__meta">
        <span>{copy.footer.credit}</span>
        <span className="footer__links">
          <a href={copy.footer.contactHref}>Email</a>
          <a href={copy.footer.githubHref} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </span>
      </div>
    </footer>
  );
}
