import { getDifficulty } from "../config/difficulty.js";

/**
 * [GUIDE REQUIREMENT] Correct base: Easy 100, Medium 150, Hard 200;
 * +5 per discovered clue; -10 per used hint; minimum score 0.
 *
 * [OPEN DECISION / ADDITIONAL RECOMMENDATION]
 * The guide does not define incorrect-accusation scoring. This implementation
 * awards no base points for an incorrect accusation, while retaining clue
 * points minus hint penalties, floored at zero.
 */
export function calculateScore({ difficulty, isCorrect, cluesDiscovered, hintsUsed }) {
  const config = getDifficulty(difficulty);
  if (!config) throw new Error("Unsupported difficulty");

  const cluePoints = Math.max(0, Number(cluesDiscovered) || 0) * 5;
  const hintPenalty = Math.max(0, Number(hintsUsed) || 0) * 10;
  const basePoints = isCorrect ? config.basePoints : 0;
  const finalScore = Math.max(0, basePoints + cluePoints - hintPenalty);

  return { basePoints, cluePoints, hintPenalty, finalScore };
}
