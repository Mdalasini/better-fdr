import type { Fixture } from "@/lib/types/fixtures";
import type { EnrichedTeam } from "@/lib/types/gameSetup";
import type { SortDirection, SortBy } from "../types";
import {
  getOpponentsForGameweek,
  getOpponentsForRange,
  calculateAttackDifficulty,
  calculateDefenseDifficulty,
} from "./difficulty";

/**
 * Sort teams by difficulty for a single gameweek
 */
export function sortByGameweek(
  fixtures: Fixture[],
  gameweek: number,
  direction: SortDirection,
  sortBy: SortBy,
  teamById: Record<number, EnrichedTeam>,
  leagueMean: number,
): number[] {
  const teamScores: { teamId: number; score: number }[] = [];

  Object.keys(teamById).forEach((teamId) => {
    const numericTeamId = parseInt(teamId, 10);
    const opponents = getOpponentsForGameweek(
      numericTeamId,
      gameweek,
      fixtures,
    );
    const team = teamById[numericTeamId];

    let score: number;
    if (sortBy === "offense") {
      const result = calculateAttackDifficulty(
        team.off_rating,
        opponents,
        teamById,
        leagueMean,
      );
      score = result.score;
    } else {
      const result = calculateDefenseDifficulty(
        team.def_rating,
        opponents,
        teamById,
        leagueMean,
      );
      score = result.score;
    }

    teamScores.push({ teamId: numericTeamId, score });
  });

  teamScores.sort((a, b) => {
    if (direction === "asc") {
      return a.score - b.score;
    }
    return b.score - a.score;
  });

  return teamScores.map((item) => item.teamId);
}

/**
 * Sort teams by difficulty for a range of gameweeks
 */
export function sortByGameweekRange(
  fixtures: Fixture[],
  startWeek: number,
  endWeek: number,
  direction: SortDirection,
  sortBy: SortBy,
  teamById: Record<number, EnrichedTeam>,
  leagueMean: number,
): number[] {
  const teamScores: { teamId: number; score: number }[] = [];

  Object.keys(teamById).forEach((teamId) => {
    const numericTeamId = parseInt(teamId, 10);
    const opponents = getOpponentsForRange(
      numericTeamId,
      startWeek,
      endWeek,
      fixtures,
    );
    const team = teamById[numericTeamId];

    let score: number;
    if (sortBy === "offense") {
      const result = calculateAttackDifficulty(
        team.off_rating,
        opponents,
        teamById,
        leagueMean,
      );
      score = result.score;
    } else {
      const result = calculateDefenseDifficulty(
        team.def_rating,
        opponents,
        teamById,
        leagueMean,
      );
      score = result.score;
    }

    teamScores.push({ teamId: numericTeamId, score });
  });

  teamScores.sort((a, b) => {
    if (direction === "asc") {
      return a.score - b.score;
    }
    return b.score - a.score;
  });

  return teamScores.map((item) => item.teamId);
}
