# Refract: premium animated demo site. Design spec

Date: 2026-09-04. Status: approved in conversation, awaiting final spec review.
Owner: Khuzaima. Purpose: first portfolio piece for entering the creative developer
market (white-label agency work and a productized landing page offer). Quality over
speed: built at background pace behind client work, no deadline, ceiling-first.

## 1. What Refract is

A fictional observability platform for AI agents. Tagline: "See through your agents."
The glass hero object refracts what is behind it; the product promise is transparency
into black-box AI. The metaphor and the visual are the same idea.

Refract is openly fictional. The footer states: a fictional product, designed and built
by Khuzaima, with a contact link. The site is self-crediting; it must never read as a
real company. No real logos, no invented testimonials attributed to real people or
firms. Quotes in the proof strip are written as obviously illustrative or omitted.

## 2. Success criteria

- A visitor's first reaction is "who built this", not "which template is this".
- Loads fast enough that the speed itself is part of the pitch (budgets in section 7).
- Usable in outreach: live URL plus a written case study with real numbers.
- Good enough to submit to Awwwards once, when it genuinely deserves it ($65, later,
  separate decision).
- Reusable plumbing: the Lenis/GSAP/R3F scaffold becomes the internal starter for the
  productized landing page offer.

## 3. Art direction

- Ground: near-black #0A0A0C. Fine film grain overlay across the whole page (subtle,
  animated, cheap: canvas or CSS, not a shader pass unless free within budget).
- Color: monochrome type and UI. Color enters ONLY as chromatic dispersion through the
  glass object (the rainbow fringing real glass makes). No brand color, no gradient
  buttons.
- Type: Clash Display (Fontshare, free for commercial) for display; General Sans
  (Fontshare) for body; small-caps micro labels for section numbers and eyebrow text.
  Display scale 10-14vw desktop; body stays small and quiet. Self-hosted via next/font.
- Layout: generous negative space, content narrow and centered against the full-bleed
  3D stage. Micro labels number the sections (01, 02, 03) in the award-site idiom.

## 4. Page structure and motion spec (single page)

1. Preloader. Percentage counter and REFRACT wordmark. Max ~2s, skippable on click or
   key, plays once per session (sessionStorage). Reveals the page with a clip wipe.
2. Hero. Fixed full-viewport R3F stage. A faceted glass form (torus knot or crystal
   cluster; decided by what photographs best during build) floating over the headline
   "See through your agents." The object refracts and disperses the type behind it.
   Idle drift + inertial rotation + mouse parallax. One CTA, one scroll cue.
3. Scroll narrative, three beats (the Oryzo pattern). Scroll progress drives the camera
   through z-depth; the object travels and re-lights between beats. Each beat:
   SplitText staggered headline, two-line body, one mocked product UI card that the
   glass edge distorts as it passes.
   - 01 Trace: see every decision an agent made.
   - 02 Steer: intervene mid-run.
   - 03 Replay: audit and prove what happened.
4. Proof strip. Animated counters (fictional but plausible metrics) and one clearly
   illustrative line. The calm beat before the close.
5. Closing. Full-viewport CTA, the object returns to center, "Start seeing." Footer:
   fictional-product disclosure, built-by credit, contact link, GitHub link.

No navigation to pages that do not exist. Every visible link works.

## 5. Technical architecture

- Next.js App Router + TypeScript + React 19. Structure modeled on darkroom
  engineering's public Satus starter (the award-tier reference blueprint).
- Two layers: fixed R3F <Canvas> behind; DOM scroll layer in front. One shared scroll
  progress value joins them: Lenis -> GSAP ScrollTrigger -> both DOM timelines and the
  R3F camera/object.
- Hero material: drei MeshTransmissionMaterial (transmission, thickness, chromatic
  aberration, roughness, IOR tuned by eye). This is the load-bearing choice that makes
  Approach B buildable without custom GLSL.
- GSAP 3.13+ (free, includes ScrollTrigger and SplitText). Lenis via lenis/react.
  React Three Fiber v9 + drei. No other animation libraries.
- No CMS, no database, no backend. Static content in typed constants.
- Repo: khuzaimabutt/refract (personal GitHub only). Hosting: Khuzaima's Vercel.
- v1.1 upgrade path (post-ship, optional): custom shader touches on the same mesh
  (noise displacement, tuned dispersion) upgrading toward Approach A without rework.

## 6. Accessibility

- prefers-reduced-motion: static composed page. Object appears as a pre-rendered
  poster image, no Lenis, no scroll choreography, content fully readable.
- WebGL unavailable or context lost: same poster fallback.
- Lenis rides native scroll, so keyboard scrolling, anchors, find-in-page, and screen
  readers keep working. All text is real DOM text (SplitText output stays readable to
  AT via aria; verify).
- Focus states styled, not removed. Contrast: monochrome-on-near-black passes AA for
  body text.

## 7. Performance budget (hard limits, part of the pitch)

- LCP under 2.5s on simulated 4G. Lighthouse mobile 90+.
- 60fps scroll on a mid-range Android phone; DPR clamped at 2; transmission material
  sample count tuned down until the frame budget holds.
- JS shipped to the client kept lean: R3F/three loaded via dynamic import after first
  paint of the DOM layer; fonts subset; grain not a full-screen shader unless free.
- Case study records the real numbers (Lighthouse, bundle sizes, LCP) as proof.

## 8. QA

- Browsers: Chrome, Edge, Firefox, Safari (macOS/iOS via BrowserStack or a borrowed
  device if no Mac available), DuckDuckGo (installed locally), one real Android phone.
- The click path a visitor takes, not direct URLs: land, watch preloader, scroll the
  whole narrative, click every link, resize, rotate phone.
- Reduced-motion and WebGL-off fallbacks tested explicitly.
- fps sampled during scroll on desktop and phone; regressions treated as bugs.

## 9. Out of scope for v1

- Blog, pricing page, auth, forms that submit anywhere.
- Custom GLSL shaders (v1.1 path).
- Awwwards submission (separate later decision).
- Sound design.

## 10. Risks and mitigations

- Glass looks cheap instead of premium: the make-or-break is lighting and environment,
  not the material. Budget dedicated tuning time; if it still fails, fall back to the
  faceted-slab form which flatters MeshTransmissionMaterial most.
- Frame rate on mobile: dispersion and samples are the dials; a mobile-specific
  material preset is acceptable.
- Scope creep toward Approach A mid-build: explicitly forbidden by this spec; custom
  shaders only after v1 ships.
- Unpaid work displacing client work: background pace is a standing rule, client work
  always first (Alliance, Lee).
