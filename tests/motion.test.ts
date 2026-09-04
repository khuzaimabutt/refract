import { test } from "node:test";
import assert from "node:assert/strict";
import { prefersReducedMotion } from "../src/lib/motion.ts";
import { shouldShowPreloader } from "../src/lib/preloader.ts";

test("prefersReducedMotion answers false when there is no browser", () => {
  assert.equal(prefersReducedMotion(), false);
});

function fakeStore(): Pick<Storage, "getItem" | "setItem"> {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) };
}

test("preloader shows once per session, then never again", () => {
  const s = fakeStore();
  assert.equal(shouldShowPreloader(s), true);
  assert.equal(shouldShowPreloader(s), false);
  assert.equal(shouldShowPreloader(s), false);
});

test("preloader still shows when storage throws", () => {
  const hostile: Pick<Storage, "getItem" | "setItem"> = {
    getItem: () => {
      throw new Error("storage disabled");
    },
    setItem: () => {
      throw new Error("storage disabled");
    },
  };
  assert.equal(shouldShowPreloader(hostile), true);
});
