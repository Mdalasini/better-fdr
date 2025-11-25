"use client";

import type { Difficulty } from "../types";
import { getDifficultyColors } from "../utils";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

/**
 * Badge component to display difficulty level with appropriate colors
 * Uses sleek, minimal styling with subtle dot indicator
 */
export function DifficultyBadge({
  difficulty,
  className = "",
}: DifficultyBadgeProps) {
  const colors = getDifficultyColors(difficulty);

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colors.dot} ${className}`}
      title={`Difficulty: ${difficulty}`}
      role="img"
      aria-label={`Difficulty: ${difficulty}`}
    />
  );
}
