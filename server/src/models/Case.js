import mongoose from "mongoose";

const suspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  motive: { type: String, required: true },
  alibi: { type: String, required: true },
}, { _id: false });

const clueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  evidence: { type: String, required: true },
  discovered: { type: Boolean, default: false },
  discoveredAt: { type: Date, default: null },
}, { _id: false });

const hintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
}, { _id: false });

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  premise: { type: String, required: true },
  story: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  suspects: { type: [suspectSchema], required: true },
  clues: { type: [clueSchema], required: true },
  hints: { type: [hintSchema], required: true },
  solution: {
    culpritSuspectId: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  progress: {
    clueIdsDiscovered: { type: [String], default: [] },
    hintIdsUsed: { type: [String], default: [] },
  },
  accusation: {
    suspectId: { type: String, default: null },
    submittedAt: { type: Date, default: null },
    isCorrect: { type: Boolean, default: null },
  },
  score: {
    basePoints: { type: Number, default: 0 },
    cluePoints: { type: Number, default: 0 },
    hintPenalty: { type: Number, default: 0 },
    finalScore: { type: Number, default: 0 },
  },
  status: { type: String, enum: ["active", "completed"], default: "active" },
}, { timestamps: true, minimize: false });

export const MysteryCase = mongoose.model("MysteryCase", caseSchema);
