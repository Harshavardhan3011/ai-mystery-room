import { Router } from "express";
import mongoose from "mongoose";
import { createCaseRequestSchema } from "../validators/case.js";
import {
  accuseSuspect, createCase, discoverClue, getCase, getCaseResult, requestHint,
} from "../services/caseService.js";

const router = Router();

function validObjectId(id) {
  return mongoose.isValidObjectId(id);
}

router.post("/", async (req, res, next) => {
  const parsed = createCaseRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: { code: "INVALID_REQUEST", message: parsed.error.issues[0]?.message ?? "Invalid request." },
    });
  }
  try {
    const result = await createCase(parsed.data);
    return res.status(201).json({ case: result });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid case ID." } });
  try {
    const result = await getCase(req.params.id);
    if (!result) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Mystery not found." } });
    return res.json({ case: result });
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/clues/:clueId/discover", async (req, res, next) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid case ID." } });
  try {
    const result = await discoverClue(req.params.id, req.params.clueId);
    if (result.error === "NOT_FOUND") return res.status(404).json({ error: { code: result.error, message: "Mystery not found." } });
    if (result.error === "CLUE_NOT_FOUND") return res.status(404).json({ error: { code: result.error, message: "Clue not found." } });
    if (result.error === "CASE_COMPLETED") return res.status(409).json({ error: { code: result.error, message: "This mystery is already complete." } });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/hints", async (req, res, next) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid case ID." } });
  try {
    const result = await requestHint(req.params.id);
    if (result.error === "NOT_FOUND") return res.status(404).json({ error: { code: result.error, message: "Mystery not found." } });
    if (result.error === "NO_HINTS_LEFT") return res.status(409).json({ error: { code: result.error, message: "No hints remain for this mystery." } });
    if (result.error === "CASE_COMPLETED") return res.status(409).json({ error: { code: result.error, message: "This mystery is already complete." } });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/accuse", async (req, res, next) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid case ID." } });
  if (typeof req.body?.suspectId !== "string" || !req.body.suspectId) {
    return res.status(400).json({ error: { code: "INVALID_REQUEST", message: "Select a suspect before accusing." } });
  }
  try {
    const result = await accuseSuspect(req.params.id, req.body.suspectId);
    if (result.error === "NOT_FOUND") return res.status(404).json({ error: { code: result.error, message: "Mystery not found." } });
    if (result.error === "SUSPECT_NOT_FOUND") return res.status(400).json({ error: { code: result.error, message: "That suspect does not belong to this mystery." } });
    if (result.error === "CASE_COMPLETED") return res.status(409).json({ error: { code: result.error, message: "An accusation has already been submitted." } });
    return res.json({ result });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/result", async (req, res, next) => {
  if (!validObjectId(req.params.id)) return res.status(400).json({ error: { code: "INVALID_ID", message: "Invalid case ID." } });
  try {
    const result = await getCaseResult(req.params.id);
    if (result.error === "NOT_FOUND") return res.status(404).json({ error: { code: result.error, message: "Mystery not found." } });
    if (result.error === "RESULT_NOT_READY") return res.status(409).json({ error: { code: result.error, message: "The result is available after you submit an accusation." } });
    return res.json({ result });
  } catch (error) {
    return next(error);
  }
});

export default router;
