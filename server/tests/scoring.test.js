import test from "node:test";
import assert from "node:assert/strict";
import { calculateScore } from "../src/utils/scoring.js";

test("Easy correct accusation uses 100 base points", () => {
  assert.deepEqual(calculateScore({
    difficulty: "easy", isCorrect: true, cluesDiscovered: 0, hintsUsed: 0,
  }), { basePoints: 100, cluePoints: 0, hintPenalty: 0, finalScore: 100 });
});

test("Medium scoring follows the guide formula", () => {
  assert.deepEqual(calculateScore({
    difficulty: "medium", isCorrect: true, cluesDiscovered: 5, hintsUsed: 1,
  }), { basePoints: 150, cluePoints: 25, hintPenalty: 10, finalScore: 165 });
});

test("Hard scoring follows the guide formula", () => {
  assert.deepEqual(calculateScore({
    difficulty: "hard", isCorrect: true, cluesDiscovered: 9, hintsUsed: 3,
  }), { basePoints: 200, cluePoints: 45, hintPenalty: 30, finalScore: 215 });
});

test("score cannot fall below zero", () => {
  assert.equal(calculateScore({
    difficulty: "easy", isCorrect: false, cluesDiscovered: 0, hintsUsed: 2,
  }).finalScore, 0);
});

test("incorrect accusation receives no base points in this recommended policy", () => {
  assert.deepEqual(calculateScore({
    difficulty: "easy", isCorrect: false, cluesDiscovered: 3, hintsUsed: 1,
  }), { basePoints: 0, cluePoints: 15, hintPenalty: 10, finalScore: 5 });
});

test("unsupported difficulty throws", () => {
  assert.throws(() => calculateScore({
    difficulty: "impossible", isCorrect: true, cluesDiscovered: 1, hintsUsed: 0,
  }), /Unsupported difficulty/);
});
