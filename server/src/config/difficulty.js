export const DIFFICULTIES = {
  easy: { suspects: 3, clues: 5, hints: 2, basePoints: 100 },
  medium: { suspects: 4, clues: 7, hints: 3, basePoints: 150 },
  hard: { suspects: 5, clues: 9, hints: 3, basePoints: 200 },
};

export function getDifficulty(value) {
  return DIFFICULTIES[value] ?? null;
}
