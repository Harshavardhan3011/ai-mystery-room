import test from "node:test";
import assert from "node:assert/strict";
import { serializePublicCase } from "../src/services/caseService.js";

test("active public case omits solution and hidden clue content", () => {
  const result = serializePublicCase({
    _id: "case-id",
    title: "Test case",
    premise: "A museum mystery",
    story: "A sufficiently long public story.",
    difficulty: "easy",
    suspects: [{ id: "suspect-id", name: "Alex", description: "Profile", motive: "Motive", alibi: "Alibi" }],
    clues: [{
      id: "clue-id",
      title: "Locked clue",
      description: "Secret description",
      evidence: "Secret evidence",
      discovered: false,
    }],
    hints: [{ id: "hint-id", text: "Hint" }],
    solution: { culpritSuspectId: "suspect-id", explanation: "Private explanation" },
    accusation: { suspectId: null, isCorrect: null },
    progress: { clueIdsDiscovered: [], hintIdsUsed: [] },
    status: "active",
    createdAt: new Date(),
  });

  assert.equal("solution" in result, false);
  assert.equal("culpritSuspectId" in result, false);
  assert.equal("explanation" in result, false);
  assert.equal("description" in result.clues[0], false);
  assert.equal("evidence" in result.clues[0], false);
});
