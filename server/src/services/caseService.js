import { randomUUID } from "node:crypto";
import { MysteryCase } from "../models/Case.js";
import { calculateScore } from "../utils/scoring.js";
import { generateMystery } from "./geminiService.js";

export function serializePublicCase(doc) {
  const data = typeof doc.toObject === "function" ? doc.toObject() : doc;
  const isCompleted = data.status === "completed";

  return {
    id: String(data._id),
    title: data.title,
    premise: data.premise,
    story: data.story,
    difficulty: data.difficulty,
    suspects: data.suspects.map(({ id, name, description, motive, alibi }) => ({
      id, name, description, motive, alibi,
    })),
    clues: data.clues.map((clue) => ({
      id: clue.id,
      title: clue.title,
      discovered: clue.discovered,
      ...(clue.discovered ? {
        description: clue.description,
        evidence: clue.evidence,
      } : {}),
    })),
    progress: {
      cluesDiscovered: data.progress.clueIdsDiscovered.length,
      hintsUsed: data.progress.hintIdsUsed.length,
      hintsRemaining: data.hints.length - data.progress.hintIdsUsed.length,
    },
    status: data.status,
    ...(isCompleted ? { result: buildResult(data) } : {}),
    createdAt: data.createdAt,
  };
}

function buildResult(data) {
  const culprit = data.suspects.find((s) => s.id === data.solution.culpritSuspectId);
  const accused = data.suspects.find((s) => s.id === data.accusation.suspectId);
  return {
    isCorrect: data.accusation.isCorrect,
    accusedSuspectId: data.accusation.suspectId,
    accusedName: accused?.name ?? "Unknown",
    culpritSuspectId: data.solution.culpritSuspectId,
    culpritName: culprit?.name ?? "Unknown",
    verdict: data.accusation.isCorrect ? "Correct accusation" : "Incorrect accusation",
    explanation: data.solution.explanation,
    score: data.score,
  };
}

export async function createCase({ premise, difficulty }) {
  const generated = await generateMystery({ premise, difficulty });
  const suspects = generated.suspects.map((suspect) => ({ ...suspect, id: randomUUID() }));
  const clues = generated.clues.map((clue) => ({
    ...clue, id: randomUUID(), discovered: false, discoveredAt: null,
  }));
  const hints = generated.hints.map((hint) => ({ id: randomUUID(), text: hint }));
  const culpritSuspectId = suspects[generated.culpritIndex].id;

  const saved = await MysteryCase.create({
    title: generated.title,
    premise,
    story: generated.story,
    difficulty,
    suspects,
    clues,
    hints,
    solution: { culpritSuspectId, explanation: generated.explanation },
    progress: { clueIdsDiscovered: [], hintIdsUsed: [] },
    score: { basePoints: 0, cluePoints: 0, hintPenalty: 0, finalScore: 0 },
    status: "active",
  });

  return serializePublicCase(saved);
}

export async function getCase(id) {
  const doc = await MysteryCase.findById(id);
  return doc ? serializePublicCase(doc) : null;
}

export async function discoverClue(caseId, clueId) {
  const doc = await MysteryCase.findById(caseId);
  if (!doc) return { error: "NOT_FOUND" };
  if (doc.status !== "active") return { error: "CASE_COMPLETED" };

  const clue = doc.clues.find((item) => item.id === clueId);
  if (!clue) return { error: "CLUE_NOT_FOUND" };

  if (!clue.discovered) {
    clue.discovered = true;
    clue.discoveredAt = new Date();
    doc.progress.clueIdsDiscovered.push(clue.id);
    doc.score.cluePoints = doc.progress.clueIdsDiscovered.length * 5;
    doc.score.finalScore = Math.max(0, doc.score.basePoints + doc.score.cluePoints - doc.score.hintPenalty);
    await doc.save();
  }

  return {
    clue: {
      id: clue.id, title: clue.title, description: clue.description, evidence: clue.evidence,
    },
    progress: {
      cluesDiscovered: doc.progress.clueIdsDiscovered.length,
      hintsUsed: doc.progress.hintIdsUsed.length,
      hintsRemaining: doc.hints.length - doc.progress.hintIdsUsed.length,
      currentScore: doc.score.finalScore,
    },
  };
}

export async function requestHint(caseId) {
  const doc = await MysteryCase.findById(caseId);
  if (!doc) return { error: "NOT_FOUND" };
  if (doc.status !== "active") return { error: "CASE_COMPLETED" };

  const nextHint = doc.hints.find((hint) => !doc.progress.hintIdsUsed.includes(hint.id));
  if (!nextHint) return { error: "NO_HINTS_LEFT" };

  doc.progress.hintIdsUsed.push(nextHint.id);
  doc.score.hintPenalty = doc.progress.hintIdsUsed.length * 10;
  doc.score.finalScore = Math.max(0, doc.score.basePoints + doc.score.cluePoints - doc.score.hintPenalty);
  await doc.save();

  return {
    hint: { id: nextHint.id, text: nextHint.text },
    progress: {
      cluesDiscovered: doc.progress.clueIdsDiscovered.length,
      hintsUsed: doc.progress.hintIdsUsed.length,
      hintsRemaining: doc.hints.length - doc.progress.hintIdsUsed.length,
      currentScore: doc.score.finalScore,
    },
  };
}

export async function accuseSuspect(caseId, suspectId) {
  const doc = await MysteryCase.findById(caseId);
  if (!doc) return { error: "NOT_FOUND" };
  if (doc.status !== "active") return { error: "CASE_COMPLETED" };

  const suspect = doc.suspects.find((item) => item.id === suspectId);
  if (!suspect) return { error: "SUSPECT_NOT_FOUND" };

  const isCorrect = suspectId === doc.solution.culpritSuspectId;
  const score = calculateScore({
    difficulty: doc.difficulty,
    isCorrect,
    cluesDiscovered: doc.progress.clueIdsDiscovered.length,
    hintsUsed: doc.progress.hintIdsUsed.length,
  });

  doc.accusation = { suspectId, submittedAt: new Date(), isCorrect };
  doc.score = score;
  doc.status = "completed";
  await doc.save();

  return buildResult(doc.toObject());
}

export async function getCaseResult(caseId) {
  const doc = await MysteryCase.findById(caseId);
  if (!doc) return { error: "NOT_FOUND" };
  if (doc.status !== "completed") return { error: "RESULT_NOT_READY" };
  return buildResult(doc.toObject());
}
