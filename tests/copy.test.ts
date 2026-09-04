import { test } from "node:test";
import assert from "node:assert/strict";
import { copy } from "../src/content/copy.ts";

test("no em dashes anywhere in site copy", () => {
  assert.ok(!JSON.stringify(copy).includes("\u2014"), "found an em dash in copy");
});

test("three beats, each with a lowercase stage note, short headline, populated card", () => {
  assert.equal(copy.beats.length, 3);
  for (const b of copy.beats) {
    assert.ok(b.stageNote.length > 0);
    // Stage notes are sentence fragments, not category tags. An all-caps or
    // numbered label here would be decoration; this keeps them informational.
    assert.equal(b.stageNote, b.stageNote.toLowerCase(), `stage note should not shout: ${b.stageNote}`);
    assert.doesNotMatch(b.stageNote, /^\d/, `stage note should not be numbered: ${b.stageNote}`);
    assert.ok(b.headline.split(" ").length <= 6, `headline too long: ${b.headline}`);
    assert.ok(b.card.rows.length >= 3);
  }
});

test("footer discloses the fiction and credits the author", () => {
  assert.match(copy.footer.disclosure, /fictional/i);
  assert.match(copy.footer.name, /Khuzaima/);
});

test("the colophon quotes figures we actually measured", () => {
  const text = copy.footer.colophon.join(" ");
  // These come from docs/perf/2026-09-04-baseline.md. If the numbers change there,
  // they have to change here, because a portfolio that overstates its own metrics
  // is worse than one that quotes none.
  assert.match(text, /688ms/);
  assert.match(text, /60fps/);
});

test("proof strip flags its own numbers as illustrative", () => {
  assert.match(copy.proof.line, /illustrative|fictional/i);
});
