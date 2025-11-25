"use client";

import { useFDRData } from "../context/FDRDataProvider";
import { FixtureRow } from "./FixtureRow";
import type { SortBy } from "../types";
import {
  getOpponentsForRange,
  calculateAttackDifficulty,
  calculateDefenseDifficulty,
  getDifficultyColors,
} from "../utils";

interface TeamCardProps {
  teamId: number;
  min: number;
  max: number;
  sortBy: SortBy;
}

/**
 * Mobile card component displaying a team and all their fixtures vertically
 * Shows aggregate difficulty stats in the header with sleek, minimal styling
 */
export function TeamCard({ teamId, min, max, sortBy }: TeamCardProps) {
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

  const displayScore =
    sortBy === "offense" ? attackStats.score : defenseStats.score;
  const displayDifficulty =
    sortBy === "offense" ? attackStats.difficulty : defenseStats.difficulty;
  const colors = getDifficultyColors(displayDifficulty);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Card Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-8 rounded-full ${colors.dot}`}
              aria-hidden="true"
            />
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {team.short_name}
              </h3>
              <p className="text-xs text-slate-500">{team.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-slate-900 tabular-nums">
              {displayScore.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">
              {sortBy === "offense" ? "Attack" : "Defense"} rating
            </div>
          </div>
        </div>
      </div>

      {/* Fixtures List */}
      <div className="divide-y divide-slate-50">
        {gameweeks.map((gameweek) => (
          <FixtureRow
            key={gameweek}
            teamId={teamId}
            gameweek={gameweek}
            sortBy={sortBy}
          />
        ))}
      </div>
    </div>
  );
}
