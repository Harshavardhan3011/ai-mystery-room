import { z } from "zod";
import { getDifficulty } from "../config/difficulty.js";

export const createCaseRequestSchema = z.object({
  premise: z.string().trim().min(8, "Premise must contain at least 8 characters.").max(500, "Premise must be 500 characters or fewer."),
  difficulty: z.enum(["easy", "medium", "hard"]),
}).strict();

const generatedSuspectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(700),
  motive: z.string().trim().min(1).max(500),
  alibi: z.string().trim().min(1).max(500),
}).strict();

const generatedClueSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(700),
  evidence: z.string().trim().min(1).max(1000),
}).strict();

export const generatedCaseSchema = z.object({
  title: z.string().trim().min(1).max(160),
  story: z.string().trim().min(100).max(5000),
  suspects: z.array(generatedSuspectSchema),
  clues: z.array(generatedClueSchema),
  hints: z.array(z.string().trim().min(1).max(500)),
  culpritIndex: z.number().int().min(0),
  explanation: z.string().trim().min(30).max(2500),
}).strict();

export function validateGeneratedCase(value, difficulty) {
  const parsed = generatedCaseSchema.parse(value);
  const expected = getDifficulty(difficulty);
  if (!expected) throw new Error("Unsupported difficulty");

  if (parsed.suspects.length !== expected.suspects) {
    throw new Error(`Expected ${expected.suspects} suspects; received ${parsed.suspects.length}.`);
  }
  if (parsed.clues.length !== expected.clues) {
    throw new Error(`Expected ${expected.clues} clues; received ${parsed.clues.length}.`);
  }
  if (parsed.hints.length !== expected.hints) {
    throw new Error(`Expected ${expected.hints} hints; received ${parsed.hints.length}.`);
  }
  if (parsed.culpritIndex >= parsed.suspects.length) {
    throw new Error("culpritIndex does not refer to an existing suspect.");
  }

  const suspectNames = parsed.suspects.map((s) => s.name.toLocaleLowerCase());
  if (new Set(suspectNames).size !== suspectNames.length) {
    throw new Error("Suspect names must be unique.");
  }

  const clueTitles = parsed.clues.map((clue) => clue.title.toLocaleLowerCase());
  if (new Set(clueTitles).size !== clueTitles.length) {
    throw new Error("Clue titles must be unique.");
  }

  const normalizedHints = parsed.hints.map((hint) => hint.toLocaleLowerCase());
  if (new Set(normalizedHints).size !== normalizedHints.length) {
    throw new Error("Hints must be unique.");
  }

  return parsed;
}
