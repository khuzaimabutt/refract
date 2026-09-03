/**
 * All site copy in one place.
 *
 * Refract is a fictional product. Nothing here describes a real company, and the footer
 * says so on the page itself. Keeping every string in one typed module means the copy
 * rules (no em dashes, short display headlines, the fiction disclosure) can be tested
 * rather than trusted, which is what tests/copy.test.ts does.
 */

export type BeatCopy = {
  /** Section eyebrow, e.g. "01 Trace". The number is part of the visual system. */
  label: string;
  /** Display headline. Short on purpose: it is set at 7vw and has to survive one line. */
  headline: string;
  body: string;
  /** The mocked product panel that sits beside the beat and distorts past the glass. */
  card: { title: string; rows: [string, string][] };
};

export type SiteCopy = {
  brand: "REFRACT";
  hero: { headline: string; sub: string; cta: string };
  beats: [BeatCopy, BeatCopy, BeatCopy];
  proof: { stats: { value: number; suffix: string; label: string }[]; line: string };
  closing: { headline: string; cta: string };
  footer: { disclosure: string; credit: string; contactHref: string; githubHref: string };
};

export const copy: SiteCopy = {
  brand: "REFRACT",
  hero: {
    headline: "See through your agents.",
    sub: "Observability for AI agents. Every decision, every tool call, every token, visible while it happens.",
    cta: "Start seeing",
  },
  beats: [
    {
      label: "01 Trace",
      headline: "Every decision, lit.",
      body: "Follow an agent's reasoning as a readable timeline instead of a log dump. Each step shows what the model saw, what it chose, and what it cost.",
      card: {
        title: "run 4f2a / live",
        rows: [
          ["plan", "search docs, then draft"],
          ["tool", "vector.query(billing)"],
          ["tokens", "1,204 in / 87 out"],
          ["verdict", "grounded"],
        ],
      },
    },
    {
      label: "02 Steer",
      headline: "Intervene mid-run.",
      body: "Pause a live agent, edit its context, and resume without losing state. Bad paths end in seconds, not after the invoice.",
      card: {
        title: "run 4f2a / paused",
        rows: [
          ["state", "held at step 6 of 9"],
          ["edit", "context patched"],
          ["resume", "from step 6"],
          ["saved", "3 calls / $0.41"],
        ],
      },
    },
    {
      label: "03 Replay",
      headline: "Prove what happened.",
      body: "Reproduce any historical run bit for bit with inputs pinned, then export the evidence. When someone asks why the agent did that, you answer with a link.",
      card: {
        title: "run 31c8 / replay",
        rows: [
          ["pinned", "model, tools, seed"],
          ["diff", "0 divergent steps"],
          ["export", "audit.refract.json"],
          ["shared", "with 2 reviewers"],
        ],
      },
    },
  ],
  proof: {
    stats: [
      { value: 48, suffix: "ms", label: "median trace latency" },
      { value: 100, suffix: "%", label: "of steps captured" },
      { value: 0, suffix: "", label: "code changes required" },
    ],
    line: "Figures are illustrative. Refract is a fictional product built to demonstrate craft.",
  },
  closing: { headline: "Start seeing.", cta: "Request access" },
  footer: {
    disclosure: "Refract is a fictional product, designed and built as a portfolio demonstration.",
    credit: "Designed and built by Khuzaima Atiq.",
    contactHref: "mailto:ikrma434@gmail.com",
    githubHref: "https://github.com/khuzaimabutt",
  },
};
