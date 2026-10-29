import test from "node:test";
import assert from "node:assert/strict";
import { validateGeneratedCase } from "../src/validators/case.js";

function makeCase(difficulty = "easy") {
  const counts = {
    easy: { suspects: 3, clues: 5, hints: 2 },
    medium: { suspects: 4, clues: 7, hints: 3 },
    hard: { suspects: 5, clues: 9, hints: 3 },
  }[difficulty];
  return {
    title: "The Midnight Archive",
    story: "A long enough mystery story. ".repeat(6),
    suspects: Array.from({ length: counts.suspects }, (_, i) => ({
      name: `Suspect ${i + 1}`,
      description: "A detailed public description.",
      motive: "A plausible motive.",
      alibi: "A stated alibi.",
    })),
    clues: Array.from({ length: counts.clues }, (_, i) => ({
      title: `Clue ${i + 1}`,
      description: "A discoverable clue description.",
      evidence: "Evidence that connects to the case timeline.",
    })),
    hints: Array.from({ length: counts.hints }, (_, i) => `Hint ${i + 1}: inspect the timeline carefully.`),
    culpritIndex: 0,
    explanation: "The evidence and timeline establish this suspect as the culprit.",
  };
}

for (const difficulty of ["easy", "medium", "hard"]) {
  test(`accepts correct ${difficulty} case counts`, () => {
    const result = validateGeneratedCase(makeCase(difficulty), difficulty);
    assert.equal(result.suspects.length, makeCase(difficulty).suspects.length);
  });
}

test("rejects the wrong number of suspects", () => {
  const data = makeCase("easy");
  data.suspects.pop();
  assert.throws(() => validateGeneratedCase(data, "easy"), /Expected 3 suspects/);
});

test("rejects a culprit index outside the suspect list", () => {
  const data = makeCase("easy");
  data.culpritIndex = 99;
  assert.throws(() => validateGeneratedCase(data, "easy"), /culpritIndex/);
});

test("rejects duplicate suspect names", () => {
  const data = makeCase("easy");
  data.suspects[1].name = data.suspects[0].name;
  assert.throws(() => validateGeneratedCase(data, "easy"), /unique/);
});

test("rejects duplicate clue titles", () => {
  const data = makeCase("easy");
  data.clues[1].title = data.clues[0].title;
  assert.throws(() => validateGeneratedCase(data, "easy"), /Clue titles must be unique/);
});

test("rejects duplicate hints", () => {
  const data = makeCase("easy");
  data.hints[1] = data.hints[0];
  assert.throws(() => validateGeneratedCase(data, "easy"), /Hints must be unique/);
});
