import { test } from "node:test";
import assert from "node:assert/strict";
import { copy } from "../src/content/copy.ts";

test("no em dashes anywhere in site copy", () => {
  assert.ok(!JSON.stringify(copy).includes("\u2014"), "found an em dash in copy");
});

test("three beats, each numbered, short headline, populated card", () => {
  assert.equal(copy.beats.length, 3);
  for (const b of copy.beats) {
    assert.match(b.label, /^0[1-3] /);
    assert.ok(b.headline.split(" ").length <= 6, `headline too long: ${b.headline}`);
    assert.ok(b.card.rows.length >= 3);
  }
});

test("footer discloses the fiction and credits the author", () => {
  assert.match(copy.footer.disclosure, /fictional/i);
  assert.match(copy.footer.credit, /Khuzaima/);
});

test("proof strip flags its own numbers as illustrative", () => {
  assert.match(copy.proof.line, /illustrative|fictional/i);
});
