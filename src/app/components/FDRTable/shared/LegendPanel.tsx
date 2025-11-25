"use client";

import { getDifficultyColors } from "../utils";
import type { Difficulty } from "../types";

/**
 * Legend panel showing difficulty color meanings
 * Uses sleek, minimal styling with inline layout
 */
export function LegendPanel() {
  const legendItems: { difficulty: Difficulty; label: string }[] = [
    { difficulty: "easy", label: "Easy" },
    { difficulty: "medium", label: "Medium" },
    { difficulty: "hard", label: "Hard" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
      {legendItems.map(({ difficulty, label }) => {
        const colors = getDifficultyColors(difficulty);
        return (
          <div key={difficulty} className="flex items-center gap-1.5">
            <span
              className={`inline-block w-3 h-3 rounded-sm ${colors.background} ${colors.border} border`}
            />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
