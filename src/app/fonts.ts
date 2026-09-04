import localFont from "next/font/local";

/**
 * Two families, deliberately unalike.
 *
 * Clash Display is a tight grotesque with small apertures: it holds together at 12vw,
 * which is where every headline on this page sits. Erode is a serif with visibly
 * weathered stems, and it carries all the prose. A serif on a developer-tool page is
 * the unexpected half of the pairing, and that is the point: the reading passages
 * should feel written rather than generated.
 *
 * Both are Fontshare variable fonts, free for commercial use and self-hosted, so
 * nothing third-party sits on the critical path.
 */
export const clashDisplay = localFont({
  src: "../../public/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "200 700",
});

export const erode = localFont({
  src: "../../public/fonts/Erode-Variable.woff2",
  variable: "--font-prose",
  display: "swap",
  weight: "300 700",
});
