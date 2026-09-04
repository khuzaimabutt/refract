const KEY = "refract:preloaded";

/**
 * The preloader earns its two seconds once. On the first view it covers the font swap
 * and the first paint; on every later view in the same session it would just be a wall
 * between someone and the page they already waited for.
 *
 * Takes the store rather than reaching for sessionStorage so the decision can be tested
 * without a browser, and so a privacy mode that throws on access cannot break the page.
 */
export function shouldShowPreloader(store: Pick<Storage, "getItem" | "setItem">): boolean {
  try {
    if (store.getItem(KEY)) return false;
    store.setItem(KEY, "1");
    return true;
  } catch {
    // Storage disabled. Showing it every time is the friendlier failure.
    return true;
  }
}
