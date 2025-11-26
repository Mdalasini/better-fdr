"use client";

import { useMemo } from "react";
import { useFDRData } from "../context/FDRDataProvider";
import { FixtureRow } from "./FixtureRow";
import { DifficultyBadge } from "../shared/DifficultyBadge";
import type { SortBy } from "../types";
import {
  getOpponentsForRange,
  calculateAttackDifficulty,
  calculateDefenseDifficulty,
  getDifficultyFromPercentile,
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
  const { fixtures, teamById, leagueMean, teams } = useFDRData();

  // Calculate all team scores for percentile ranking
  const allTeamScores = useMemo(() => {
    if (!teams || !fixtures || !teamById) return [];

    return teams.map((t) => {
      const opponents = getOpponentsForRange(t.id, min, max, fixtures);
      if (sortBy === "offense") {
        return calculateAttackDifficulty(
          t.off_rating,
          opponents,
          teamById,
          leagueMean,
        ).score;
      }
      return calculateDefenseDifficulty(
        t.def_rating,
        opponents,
        teamById,
        leagueMean,
      ).score;
    });
  }, [teams, fixtures, teamById, leagueMean, min, max, sortBy]);

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
  const percentileDifficulty = getDifficultyFromPercentile(
    displayScore,
    allTeamScores,
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Card Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DifficultyBadge
              difficulty={percentileDifficulty}
              className="w-2 h-8"
            />
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {team.short_name}
              </h3>
              <p className="text-xs text-slate-500">{team.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">
              {sortBy === "offense" ? "Attack" : "Defense"}
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
