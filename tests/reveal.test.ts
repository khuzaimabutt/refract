import { test } from "node:test";
import assert from "node:assert/strict";
import { formatStat } from "../src/lib/reveal.ts";

test("counter values are whole numbers with their suffix attached", () => {
  assert.equal(formatStat(48, "ms"), "48ms");
  assert.equal(formatStat(100, "%"), "100%");
  assert.equal(formatStat(0, ""), "0");
});

test("mid-tween fractions never reach the screen", () => {
  assert.equal(formatStat(47.6218, "ms"), "48ms");
  assert.equal(formatStat(0.4, ""), "0");
});
