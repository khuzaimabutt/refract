/**
 * Whether this visitor has asked their system to reduce motion.
 *
 * Safe to call during server rendering, where it answers false: the server cannot know,
 * and every caller treats false as "assume motion is fine, then correct on the client".
 * Getting that backwards would flash a static page at everyone on first paint.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
