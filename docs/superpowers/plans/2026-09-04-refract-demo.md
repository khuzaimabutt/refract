# Refract Demo Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Refract, a fictional AI-agent observability launch site with award-tier motion design: refracting 3D glass hero, scroll-driven camera narrative, staggered type choreography, at 60fps with hard performance and accessibility budgets.

**Architecture:** Two layers joined by one scroll value. A fixed React Three Fiber canvas renders the glass object and camera rig behind the page; the DOM scroll layer in front carries all text and UI. Lenis drives native scroll, GSAP ScrollTrigger reads it, and both DOM timelines and the R3F camera consume the same progress. All copy lives in one typed content module. No CMS, no backend.

**Tech Stack:** Next.js (App Router, latest) + React 19 + TypeScript, GSAP 3.13+ (ScrollTrigger, SplitText), Lenis, React Three Fiber v9 + drei (MeshTransmissionMaterial), plain CSS with custom properties (no Tailwind), self-hosted Fontshare fonts (Clash Display, General Sans), Vercel hosting.

**Spec:** `docs/superpowers/specs/2026-09-04-refract-demo-design.md`

## Global Constraints

- Ground color `#0A0A0C`; color appears ONLY via chromatic dispersion in the glass material. No brand colors, no gradient buttons.
- Display type Clash Display, body General Sans, both self-hosted woff2 via `next/font/local`.
- Performance: LCP < 2.5s simulated 4G, Lighthouse mobile >= 90, 60fps scroll on mid-range Android, DPR clamp 2.
- `prefers-reduced-motion`: static page, poster instead of canvas, no Lenis.
- Every visible link works; footer discloses the fictional product and credits Khuzaima.
- No custom GLSL in v1 (spec section 9). MeshTransmissionMaterial only.
- Repo `khuzaimabutt/refract` only. Push via `gh auth switch --user khuzaimabutt` first.
- No em dashes in any copy.
- Design-critical tasks (2, 6, 7, 8) load the `frontend-design:frontend-design` skill before starting and end with a screenshot review against the spec's art direction.

---

### Task 1: Scaffold

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` (via create-next-app, then trimmed)
- Create: `public/fonts/` (woff2 files)

**Interfaces:**
- Produces: running dev server; `clashDisplay` and `generalSans` font objects exported from `src/app/fonts.ts` with CSS variables `--font-display` and `--font-body`.

- [ ] **Step 1: Scaffold the app** (run inside `E:\OldD File\UP\refract`)

```bash
npx -y create-next-app@latest . --ts --app --no-tailwind --eslint --src-dir --use-npm --no-import-alias --yes
npm i gsap lenis three @react-three/fiber @react-three/drei
npm i -D @types/three
```

- [ ] **Step 2: Fetch fonts.** Download Fontshare families (free for commercial use) and place woff2 files:

```bash
curl -L -o clash.zip "https://api.fontshare.com/v2/fonts/download/clash-display"
curl -L -o general.zip "https://api.fontshare.com/v2/fonts/download/general-sans"
unzip -j clash.zip "*Variable*.woff2" -d public/fonts/ || unzip -j clash.zip "*.woff2" -d public/fonts/
unzip -j general.zip "*Variable*.woff2" -d public/fonts/ || unzip -j general.zip "*.woff2" -d public/fonts/
rm clash.zip general.zip
```

If the API shape changed, download manually from fontshare.com and keep only the variable woff2 per family. Record exact filenames for Step 3.

- [ ] **Step 3: Create `src/app/fonts.ts`**

```ts
import localFont from "next/font/local";

export const clashDisplay = localFont({
  src: "../../public/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-display",
  display: "swap",
});

export const generalSans = localFont({
  src: "../../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-body",
  display: "swap",
});
```

Adjust `src` to the actual filenames from Step 2.

- [ ] **Step 4: Verify dev server**

Run: `npm run dev` then `curl -s localhost:3000 | head -5`
Expected: HTML response with no build errors in the dev log.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Scaffold Next.js app with fonts and 3D/motion dependencies"
```

---

### Task 2: Static design composition (THE design gate)

The most important task. No animation, no 3D: compose the whole page as beautiful static sections. If this looks premium standing still, everything after amplifies it; if not, nothing after saves it. Load `frontend-design:frontend-design` before starting.

**Files:**
- Create: `src/content/copy.ts`, `src/components/Hero.tsx`, `src/components/beats/Beat.tsx`, `src/components/beats/UICard.tsx`, `src/components/ProofStrip.tsx`, `src/components/Closing.tsx`, `src/components/Footer.tsx`, `src/components/Grain.tsx`
- Modify: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`
- Test: `tests/copy.test.ts`

**Interfaces:**
- Produces: `copy` object from `src/content/copy.ts` typed as `SiteCopy` (shape below); section components accepting no props except `Beat`, which takes `{ index: number; beat: BeatCopy }`; every section root carries `data-section="<name>"` for later ScrollTrigger targeting.

- [ ] **Step 1: Write the copy module** `src/content/copy.ts`

```ts
export type BeatCopy = {
  label: string;      // "01 Trace"
  headline: string;   // display headline, <= 6 words
  body: string;       // exactly 2 sentences
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
    sub: "Refract is observability for AI agents. Every decision, every tool call, every token, visible while it happens.",
    cta: "Start seeing",
  },
  beats: [
    {
      label: "01 Trace",
      headline: "Every decision, lit.",
      body: "Follow an agent's reasoning as a readable timeline instead of a log dump. Each step shows what the model saw, what it chose, and what it cost.",
      card: {
        title: "run 4f2a · live",
        rows: [["plan", "search docs, then draft"], ["tool", "vector.query(billing)"], ["tokens", "1,204 in · 87 out"], ["verdict", "grounded"]],
      },
    },
    {
      label: "02 Steer",
      headline: "Intervene mid-run.",
      body: "Pause a live agent, edit its context, and resume without losing state. Bad paths end in seconds, not after the invoice.",
      card: {
        title: "run 4f2a · paused",
        rows: [["state", "held at step 6 of 9"], ["edit", "context patched"], ["resume", "from step 6"], ["saved", "3 calls · $0.41"]],
      },
    },
    {
      label: "03 Replay",
      headline: "Prove what happened.",
      body: "Reproduce any historical run bit for bit, inputs pinned, and export the evidence. When someone asks why the agent did that, you answer with a link.",
      card: {
        title: "run 31c8 · replay",
        rows: [["pinned", "model, tools, seed"], ["diff", "0 divergent steps"], ["export", "audit.refract.json"], ["shared", "with 2 reviewers"]],
      },
    },
  ],
  proof: {
    stats: [
      { value: 48, suffix: "ms", label: "median trace latency" },
      { value: 100, suffix: "%", label: "of steps captured" },
      { value: 0, suffix: "", label: "code changes required" },
    ],
    line: "Numbers are illustrative. Refract is a fictional product.",
  },
  closing: { headline: "Start seeing.", cta: "Request access" },
  footer: {
    disclosure: "Refract is a fictional product, designed and built as a portfolio demonstration.",
    credit: "Designed and built by Khuzaima Atiq.",
    contactHref: "mailto:ikrma434@gmail.com",
    githubHref: "https://github.com/khuzaimabutt",
  },
};
```

- [ ] **Step 2: Write the failing copy test** `tests/copy.test.ts` (guards the spec's copy rules)

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { copy } from "../src/content/copy.ts";

test("no em dashes anywhere in site copy", () => {
  assert.ok(!JSON.stringify(copy).includes("\u2014"));
});

test("three beats, each with label, short headline, and a card", () => {
  assert.equal(copy.beats.length, 3);
  for (const b of copy.beats) {
    assert.match(b.label, /^0[1-3] /);
    assert.ok(b.headline.split(" ").length <= 6);
    assert.ok(b.card.rows.length >= 3);
  }
});

test("footer discloses the fiction and credits the author", () => {
  assert.match(copy.footer.disclosure, /fictional/i);
  assert.match(copy.footer.credit, /Khuzaima/);
});
```

- [ ] **Step 3: Add test runner + run to verify it fails before copy.ts exists / passes after**

`package.json` scripts: `"test": "node --experimental-strip-types --test tests/"`. Run `npm test`. If copy.ts was written first, temporarily rename it to see the suite fail, restore, see it pass (red-green per project rules).

- [ ] **Step 4: Design tokens in `globals.css`**

```css
:root {
  --ground: #0a0a0c;
  --ink: #e8e8ea;
  --ink-dim: #9a9aa2;
  --hairline: #ffffff14;
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --step-hero: clamp(3.5rem, 12vw, 11rem);
  --step-beat: clamp(2.5rem, 7vw, 6rem);
  --step-label: 0.8125rem;
  --space-section: clamp(6rem, 18vh, 12rem);
}
html { background: var(--ground); color: var(--ink); }
body { font-family: var(--font-body), system-ui, sans-serif; margin: 0; }
h1, h2 { font-family: var(--font-display), var(--font-body), sans-serif; font-weight: 560; letter-spacing: -0.02em; line-height: 0.95; margin: 0; }
.label { font-size: var(--step-label); letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-dim); font-variant-caps: all-small-caps; }
```

- [ ] **Step 5: Build each section component as static JSX** using `copy`, with `data-section` attributes (`hero`, `beat-0`..`beat-2`, `proof`, `closing`). `Grain.tsx` renders a fixed full-viewport div using a tiny tiled PNG noise data-URI at ~5% opacity with `mix-blend-mode: overlay` and `pointer-events: none`. `UICard.tsx` is a bordered translucent panel (`background: #ffffff08; border: 1px solid var(--hairline); backdrop-filter: blur(8px)`) rendering `card.title` and rows as a small mono-spaced table.

- [ ] **Step 6: Compose `page.tsx`** in spec order: Hero, three Beats, ProofStrip, Closing, Footer. Hero leaves the center-stage area visually open (the glass object will occupy it), headline low-left, sub and CTA beneath.

- [ ] **Step 7: Screenshot review gate.** Run dev server, screenshot desktop (1440w) and mobile (390w) of every section (use the run skill / Playwright). Judge against spec section 3: near-black ground, monochrome, huge display type against tiny labels, generous space. Iterate until it looks premium standing still. This step is done only when the reviewer (Claude, then Khuzaima if he wants to look) would put the static page in a portfolio as-is.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "Static composition: tokens, type system, all sections, grain"
```

---

### Task 3: Motion foundation (Lenis + ScrollTrigger + reduced motion)

**Files:**
- Create: `src/lib/motion.ts`, `src/components/MotionRoot.tsx`
- Test: `tests/motion.test.ts`

**Interfaces:**
- Produces: `prefersReducedMotion(): boolean` (SSR-safe, false on server); `<MotionRoot>` client component that, when motion is allowed, instantiates Lenis, wires `lenis.on("scroll", ScrollTrigger.update)` and `gsap.ticker.add((t) => lenis.raf(t * 1000))`, registers `ScrollTrigger` + `SplitText` plugins once, and exposes nothing (side-effect wrapper around children). When reduced motion: renders children untouched, no Lenis.

- [ ] **Step 1: Failing test for the SSR-safe helper**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { prefersReducedMotion } from "../src/lib/motion.ts";

test("prefersReducedMotion is false in a non-browser environment", () => {
  assert.equal(prefersReducedMotion(), false);
});
```

Run `npm test`, expect failure (module missing).

- [ ] **Step 2: Implement `src/lib/motion.ts`**

```ts
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 3: Implement `MotionRoot.tsx`** ("use client"; useEffect creating Lenis with `{ lerp: 0.1 }`, GSAP plugin registration guarded by a module flag, cleanup on unmount destroys Lenis and removes the ticker). Wrap `page.tsx` content with it.

- [ ] **Step 4: Verify** `npm test` passes; dev server scrolls with visible smoothing; with OS reduced-motion enabled (or DevTools emulation) scrolling is native and no Lenis instance is created (assert via `window.__lenis` debug flag set only when instantiated).

- [ ] **Step 5: Commit** `git add -A && git commit -m "Motion foundation: Lenis synced to ScrollTrigger, reduced-motion gate"`

---

### Task 4: Preloader

**Files:**
- Create: `src/components/Preloader.tsx`, `src/lib/preloader.ts`
- Test: `tests/preloader.test.ts`

**Interfaces:**
- Produces: `shouldShowPreloader(store: Pick<Storage, "getItem" | "setItem">): boolean` in `src/lib/preloader.ts` (returns true once per session, marks seen); `<Preloader onDone={() => void}>` overlay: counter 0→100 driven by actual font+first-paint readiness with a minimum display of 900ms and hard cap 2000ms, skip on click or any key, exits with a clip-path wipe (GSAP), then unmounts.

- [ ] **Step 1: Failing test for session logic**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldShowPreloader } from "../src/lib/preloader.ts";

function fakeStore(): Pick<Storage, "getItem" | "setItem"> {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) };
}

test("shows once per session", () => {
  const s = fakeStore();
  assert.equal(shouldShowPreloader(s), true);
  assert.equal(shouldShowPreloader(s), false);
});
```

- [ ] **Step 2: Implement**

```ts
const KEY = "refract:preloaded";
export function shouldShowPreloader(store: Pick<Storage, "getItem" | "setItem">): boolean {
  if (store.getItem(KEY)) return false;
  store.setItem(KEY, "1");
  return true;
}
```

- [ ] **Step 3: Build the component**, honoring reduced motion (skips entirely). Verify by eye: counter, wipe, skip works, second reload shows nothing. `npm test` green.
- [ ] **Step 4: Commit** `git add -A && git commit -m "Preloader with once-per-session logic and skip"`

---

### Task 5: R3F stage and the glass object

Load `frontend-design:frontend-design`. This is the make-or-break visual.

**Files:**
- Create: `src/components/scene/Stage.tsx`, `src/components/scene/GlassObject.tsx`, `src/components/scene/SceneRoot.tsx`

**Interfaces:**
- Produces: `<SceneRoot />` mounted once in `page.tsx` behind the DOM layer (`position: fixed; inset: 0; z-index: 0;` DOM layer `z-index: 1`). Dynamically imported with `next/dynamic` `{ ssr: false }` AFTER first paint; renders `null` when `prefersReducedMotion()` or WebGL unavailable (poster shows instead, Task 8). `GlassObject` exposes a ref-based API consumed by Task 6: `groupRef` positioned by the camera rig.

- [ ] **Step 1: Stage.** `<Canvas dpr={[1, 2]} camera={{ fov: 35, position: [0, 0, 8] }} gl={{ antialias: true, powerPreference: "high-performance" }}>`; `<Environment preset="studio" />` from drei (or "city" if studio flatters less); two rim lights (`#ffffff`, low intensity) behind the object so facets catch edges against the dark ground.

- [ ] **Step 2: GlassObject.**

```tsx
"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import type { Group } from "three";

export function GlassObject({ groupRef }: { groupRef: React.RefObject<Group | null> }) {
  const inner = useRef<Group>(null);
  useFrame((state, delta) => {
    if (!inner.current) return;
    inner.current.rotation.x += delta * 0.08;           // idle drift
    inner.current.rotation.y += delta * 0.12;
    const { x, y } = state.pointer;                      // mouse parallax, inertial
    inner.current.rotation.x += (y * 0.25 - inner.current.rotation.x % 0.001) * 0.02;
    inner.current.rotation.y += (x * 0.35) * 0.02;
  });
  return (
    <group ref={groupRef}>
      <group ref={inner}>
        <mesh>
          <torusKnotGeometry args={[1.1, 0.42, 220, 36]} />
          <MeshTransmissionMaterial
            transmission={1} thickness={1.4} roughness={0.08}
            ior={1.5} chromaticAberration={0.35} anisotropicBlur={0.4}
            distortion={0.25} distortionScale={0.4} temporalDistortion={0.1}
            samples={8} resolution={1024} backside
          />
        </mesh>
      </group>
    </group>
  );
}
```

Starting values only; the step's real work is tuning by eye against screenshots until the refraction of the headline text behind it reads as glass with visible rainbow dispersion at facet edges. If the torus knot reads as blobby, switch geometry to an icosahedron at detail 0 scaled anisotropically (the faceted slab from the spec's risk section) and re-tune.

- [ ] **Step 3: Mobile preset.** Below 768px viewport: `samples: 4, resolution: 512, distortion: 0`. Verify 60fps via the drei `<PerformanceMonitor>` or DevTools FPS meter on a throttled profile.

- [ ] **Step 4: Screenshot gate** desktop + mobile; the hero must out-photograph fluid.glass's hero as a still. Iterate before proceeding.

- [ ] **Step 5: Commit** `git add -A && git commit -m "Glass hero: transmission material stage with idle drift and parallax"`

---

### Task 6: Scroll-driven camera and object travel

**Files:**
- Create: `src/components/scene/CameraRig.tsx`
- Modify: `src/components/scene/SceneRoot.tsx`, `src/components/scene/Stage.tsx`

**Interfaces:**
- Consumes: `groupRef` from `GlassObject`; `data-section` attributes from Task 2.
- Produces: a single `ScrollTrigger` spanning the full page writing `progress` (0..1) into a shared ref; `CameraRig` maps progress to camera z/y and to `groupRef` position/scale via keyframe tables (below), lerped in `useFrame`.

- [ ] **Step 1: Keyframe tables** in `CameraRig.tsx`:

```ts
// progress keyframes: [p, camZ, camY, objX, objScale]
const KEYS: [number, number, number, number, number][] = [
  [0.00, 8.0, 0.0,  0.0, 1.00],   // hero: center stage
  [0.18, 7.0, 0.2,  1.6, 0.72],   // beat 1: object right, text left
  [0.42, 6.2, 0.3, -1.6, 0.66],   // beat 2: object left
  [0.66, 5.6, 0.2,  1.4, 0.60],   // beat 3: object right
  [0.82, 6.5, 0.0,  0.0, 0.42],   // proof: recede small, centered
  [1.00, 8.0, 0.0,  0.0, 1.05],   // closing: return, slightly larger
];
```

Linear interpolate between rows by progress, then lerp the live values toward targets at 0.06/frame so travel feels inertial, never stepped.

- [ ] **Step 2: Wire the page ScrollTrigger** (`trigger: document.body, start: "top top", end: "bottom bottom", scrub: true`) updating the shared progress ref only (no React state per frame).

- [ ] **Step 3: Verify by scroll-through screencast:** object hands off left/right opposite each beat's text column, never covers text, returns for closing. Tune keyframes by eye.

- [ ] **Step 4: Commit** `git add -A && git commit -m "Scroll-driven camera rig with keyframed object travel"`

---

### Task 7: DOM choreography (SplitText beats, counters, closing)

Load `frontend-design:frontend-design`.

**Files:**
- Create: `src/lib/reveal.ts`
- Modify: `src/components/Hero.tsx`, `src/components/beats/Beat.tsx`, `src/components/ProofStrip.tsx`, `src/components/Closing.tsx`
- Test: `tests/reveal.test.ts`

**Interfaces:**
- Produces: `formatStat(value: number, suffix: string): string` (pure, tested); `revealHeadline(el: HTMLElement): gsap.core.Timeline` using `SplitText` by words+chars, chars rising with `yPercent: 110 → 0`, `stagger: 0.02`, `ease: "power4.out"`, masked by `overflow: hidden` line wrappers; each beat gets a `ScrollTrigger` at `start: "top 70%"` playing once.

- [ ] **Step 1: Failing test for `formatStat`**

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatStat } from "../src/lib/reveal.ts";

test("formats stat values with suffix and no decimals", () => {
  assert.equal(formatStat(48, "ms"), "48ms");
  assert.equal(formatStat(100, "%"), "100%");
  assert.equal(formatStat(0, ""), "0");
});
```

- [ ] **Step 2: Implement** `formatStat` (`Math.round(value)` + suffix), run tests green.
- [ ] **Step 3: Wire reveals:** hero headline plays after preloader `onDone`; beat headlines + bodies + cards stagger in on their triggers; proof counters tween `{ n: 0 → value }` with `snap: 1` writing through `formatStat`; closing headline reveal + CTA fade. Cards additionally get a subtle `skewY` proportional to Lenis velocity, clamped to 1.5deg (velocity read from Lenis instance).
- [ ] **Step 4: Reduced-motion check:** with reduce on, no SplitText runs and all content is visible statically (guard every effect behind `prefersReducedMotion()`).
- [ ] **Step 5: Scroll-through screencast review;** timing feels editorial, nothing pops, nothing lags the scroll.
- [ ] **Step 6: Commit** `git add -A && git commit -m "Scroll choreography: split reveals, counters, closing sequence"`

---

### Task 8: Fallbacks (poster, WebGL-off, reduced motion end-to-end)

**Files:**
- Create: `public/poster.jpg` (captured from the finished hero at 2x), `src/components/scene/Poster.tsx`
- Modify: `src/components/scene/SceneRoot.tsx`

**Interfaces:**
- Consumes: `prefersReducedMotion()`.
- Produces: `SceneRoot` renders `<Poster />` (a plain `<img>` of the hero, `alt=""`, `aria-hidden`, absolutely positioned) whenever reduced motion is on, WebGL context creation fails, or `webglcontextlost` fires without restore.

- [ ] **Step 1: Capture poster** from the live hero via Playwright screenshot at 2880w, compress to < 200KB jpg.
- [ ] **Step 2: Implement detection:** try `canvas.getContext("webgl2") ?? canvas.getContext("webgl")` in a probe before mounting Canvas; on failure render Poster. Add `onContextLost` handler swapping to Poster.
- [ ] **Step 3: Verify three ways:** DevTools reduced-motion emulation shows static page + poster and native scroll; Chrome `--disable-webgl` (or spoof probe) shows poster; normal load shows canvas.
- [ ] **Step 4: Commit** `git add -A && git commit -m "Poster fallbacks for reduced motion and missing WebGL"`

---

### Task 9: Performance pass to budget

**Files:**
- Modify: whatever the measurements implicate; `next.config.ts` for bundle analysis.

- [ ] **Step 1: Measure.** Production build (`npm run build && npm start`), Lighthouse mobile run, record LCP, TBT, score; `@next/bundle-analyzer` for chunk sizes. Save numbers to `docs/perf/2026-XX-XX-baseline.md`.
- [ ] **Step 2: Fix to budget.** Expected levers, apply as measurements dictate: three/R3F in a dynamic-imported chunk that loads after LCP (hero text is the LCP element, not the canvas); font subsetting (`latin` only); preloader not blocking LCP (it overlays real content, does not delay it); `content-visibility: auto` on below-fold sections; grain PNG < 2KB.
- [ ] **Step 3: Exit criteria met:** LCP < 2.5s (simulated 4G), Lighthouse mobile >= 90, 60fps scroll desktop + throttled mobile profile. Re-record numbers in the same doc; these figures feed the case study.
- [ ] **Step 4: Commit** `git add -A && git commit -m "Performance pass: budgets met and recorded"`

---

### Task 10: QA matrix, deploy, case study

**Files:**
- Create: `docs/case-study.md`, `README.md`
- Modify: as QA findings dictate.

- [ ] **Step 1: QA click path** per spec section 8 on Chrome, Edge, Firefox, DuckDuckGo (installed), Safari (BrowserStack or borrowed device; note honestly if unavailable), one real Android phone: land, preloader, full scroll, every link, resize, rotate. Log findings, fix, re-test.
- [ ] **Step 2: Repo + deploy.** `gh auth switch --user khuzaimabutt`; create `khuzaimabutt/refract` (public); push; import to Vercel on Khuzaima's account; verify production URL end to end including fallbacks.
- [ ] **Step 3: Case study** `docs/case-study.md`: problem framing, the metaphor decision, stack choices and why, the measured performance numbers from Task 9, screenshots. Written for an agency reader, no em dashes.
- [ ] **Step 4: Final commit and push both** (only the `khuzaimabutt` account; this project has no client remote).

---

## Self-review notes

- Spec coverage: section 1 → Task 2 copy; 3 → Tasks 2, 5; 4 → Tasks 2, 4, 6, 7; 5 → Tasks 1, 3, 5, 6; 6 → Tasks 3, 7, 8; 7 → Task 9; 8 → Task 10; 9 honored (no GLSL anywhere); 10 risks: glass-looks-cheap gate in Task 5 Step 4, mobile preset Task 5 Step 3, no-GLSL constraint global.
- Types checked: `SiteCopy`/`BeatCopy` consumed in Tasks 2 and 7; `prefersReducedMotion` consumed in Tasks 3, 4, 7, 8; `groupRef` produced Task 5, consumed Task 6; `formatStat` defined and tested in Task 7 only.
- Visual-tuning steps are deliberate judgment steps with explicit screenshot gates, not placeholders: the gate criterion is stated in each.
