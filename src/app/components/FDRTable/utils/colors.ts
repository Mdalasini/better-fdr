import type { Difficulty } from "../types";

/**
 * Map difficulty level to Tailwind CSS classes
 * Using subtle, modern tones for a sleek appearance
 */
export const difficultyColorMap: Record<Difficulty, string> = {
  easy: "bg-emerald-100",
  medium: "bg-slate-100",
  hard: "bg-rose-100",
  invalid: "bg-slate-50",
};

/**
 * Map difficulty level to border color classes (for legends, badges, etc.)
 */
export const difficultyBorderColorMap: Record<Difficulty, string> = {
  easy: "border-emerald-300",
  medium: "border-slate-300",
  hard: "border-rose-300",
  invalid: "border-slate-200",
};

/**
 * Map difficulty level to text color classes
 */
export const difficultyTextColorMap: Record<Difficulty, string> = {
  easy: "text-emerald-700",
  medium: "text-slate-600",
  hard: "text-rose-700",
  invalid: "text-slate-400",
};

/**
 * Map difficulty level to dot/indicator color classes
 */
export const difficultyDotColorMap: Record<Difficulty, string> = {
  easy: "bg-emerald-500",
  medium: "bg-slate-400",
  hard: "bg-rose-500",
  invalid: "bg-slate-300",
};

/**
 * Get color classes for a difficulty level
 */
export function getDifficultyColors(difficulty: Difficulty): {
  background: string;
  border: string;
  text: string;
  dot: string;
} {
  return {
    background: difficultyColorMap[difficulty],
    border: difficultyBorderColorMap[difficulty],
    text: difficultyTextColorMap[difficulty],
    dot: difficultyDotColorMap[difficulty],
  };
}
