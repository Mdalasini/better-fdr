"use client";

import type { SortBy } from "../types";
import { useFDRData } from "../context/FDRDataProvider";
import { getDifficultyColors } from "../utils";
import { OpponentChip } from "../shared";

interface TableCellProps {
  teamId: number;
  gameweek: number;
  sortBy: SortBy;
  isLast?: boolean;
}

/**
 * Desktop table cell displaying fixtures for a team in a specific gameweek
 * Uses sleek, minimal styling with subtle difficulty coloring
 */
export function TableCell({
  teamId,
  gameweek,
  sortBy,
  isLast,
}: TableCellProps) {
  const { difficultyScores, teamById } = useFDRData();

  if (!difficultyScores || !teamById) return null;

  const gameweekScore = difficultyScores.byTeam[teamId]?.[gameweek];
  if (!gameweekScore) {
    return (
      <td
        className={[
          "h-12 px-2 py-1 text-center text-sm align-middle bg-slate-50/50",
          isLast ? "rounded-r-lg" : "",
        ].join(" ")}
      >
        <span className="text-slate-300">—</span>
      </td>
    );
  }

  const { attack, defense } = gameweekScore;
  const difficulty =
    sortBy === "offense" ? attack.difficulty : defense.difficulty;
  const colors = getDifficultyColors(difficulty);
  const opponents = attack.opponents;

  return (
    <td
      className={[
        "h-12 px-2 py-1 text-center text-sm align-middle transition-colors",
        colors.background,
        isLast ? "rounded-r-lg" : "",
      ].join(" ")}
      data-offense={attack.score.toFixed(3)}
      data-defense={defense.score.toFixed(3)}
      data-offense-difficulty={attack.difficulty}
      data-defense-difficulty={defense.difficulty}
    >
      <div className="flex flex-col items-center justify-center w-full h-full gap-0.5">
        {opponents && opponents.length > 0 ? (
          opponents.map((opp) => {
            const opponentTeam = teamById[opp.id];
            if (!opponentTeam) return null;

            return (
              <OpponentChip
                key={opp.id}
                opponent={opp}
                team={opponentTeam}
                className="w-full px-1"
              />
            );
          })
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </div>
    </td>
  );
}
