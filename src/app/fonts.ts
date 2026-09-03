import localFont from "next/font/local";

/**
 * Both families are Fontshare variable fonts, free for commercial use, self-hosted so
 * there is no third-party request on the critical path. Variable means one file covers
 * every weight the page uses, which matters when the display face is set at 12vw and the
 * body at 15px in the same viewport.
 */
export const clashDisplay = localFont({
  src: "../../public/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "200 700",
});

export const generalSans = localFont({
  src: "../../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-body",
  display: "swap",
  weight: "200 700",
});
