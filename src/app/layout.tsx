import type { Metadata } from "next";
import { clashDisplay, erode } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Refract / Observability for AI agents",
  description:
    "Refract is a fictional product built as a portfolio demonstration. Observability for AI agents: every decision, every tool call, every token, visible while it happens.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${clashDisplay.variable} ${erode.variable}`}>
      <body>{children}</body>
    </html>
  );
}
