"use client";

import type { SortBy } from "../types";
import { useFDRData } from "../context/FDRDataProvider";
import { TableCell } from "./TableCell";
import {
  getOpponentsForRange,
  calculateAttackDifficulty,
  calculateDefenseDifficulty,
} from "../utils";

interface TableRowProps {
  teamId: number;
  min: number;
  max: number;
  sortBy: SortBy;
}

/**
 * Desktop table row displaying a team and all their fixtures in the visible window
 * Sleek, minimal styling with subtle hover states
 */
export function TableRow({ teamId, min, max, sortBy }: TableRowProps) {
  const { fixtures, teamById, leagueMean } = useFDRData();

  if (!fixtures || !teamById) return null;

  const team = teamById[teamId];
  if (!team) return null;

  const gameweeks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  // Calculate aggregate stats for the range
  const opponents = getOpponentsForRange(teamId, min, max, fixtures);
  const attackStats = calculateAttackDifficulty(
    team.off_rating,
    opponents,
    teamById,
    leagueMean,
  );
  const defenseStats = calculateDefenseDifficulty(
    team.def_rating,
    opponents,
    teamById,
    leagueMean,
  );

  return (
    <tr className="group">
      <td
        className="sticky left-0 z-10 bg-white px-3 py-2 text-sm font-medium text-slate-800 group-hover:bg-slate-50 transition-colors rounded-l-lg"
        data-team-id={teamId}
        data-offense={attackStats.score.toFixed(3)}
        data-defense={defenseStats.score.toFixed(3)}
      >
        <div className="flex items-center gap-2">
          <span className="text-slate-800 font-medium">{team.short_name}</span>
        </div>
      </td>

      {gameweeks.map((gameweek, idx) => (
        <TableCell
          key={gameweek}
          teamId={teamId}
          gameweek={gameweek}
          sortBy={sortBy}
          isLast={idx === gameweeks.length - 1}
        />
      ))}
    </tr>
  );
}
