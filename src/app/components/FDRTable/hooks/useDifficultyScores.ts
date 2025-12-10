"use client";

import { useMemo } from "react";
import type { Fixture } from "@/lib/types/fixtures";
import type { DifficultyScores, GameweekScore } from "../types";
import {
  getOpponentsForGameweek,
  calculateAttackDifficulty,
  calculateDefenseDifficulty,
  createTeamLookup,
  calculateLeagueMean,
} from "../utils";
import { sortByGameweek } from "../utils/sorting";
import type { EnrichedTeam } from "@/lib/types/gameSetup";

/**
 * Hook that precomputes ALL difficulty scores for all teams and gameweeks
 * This eliminates duplicate calculations across components
 */
export function useDifficultyScores(
  teams: EnrichedTeam[] | undefined,
  fixtures: Fixture[] | undefined,
): DifficultyScores | null {
  return useMemo(() => {
    if (!teams || !fixtures || teams.length === 0 || fixtures.length === 0) {
      return null;
    }

    const teamById = createTeamLookup(teams);
    const leagueMean = calculateLeagueMean(teams);

    // Get all unique gameweeks
    const gameweeks = Array.from(new Set(fixtures.map((f) => f.event))).sort(
      (a, b) => a - b,
    );

    const difficultyScores: DifficultyScores = {
      byTeam: {},
      byGameweek: {},
    };

    // Initialize team data structures
    teams.forEach((team) => {
      difficultyScores.byTeam[team.id] = {};
    });

    // Calculate scores for each team and gameweek
    gameweeks.forEach((gameweek) => {
      teams.forEach((team) => {
        const opponents = getOpponentsForGameweek(team.id, gameweek, fixtures);

        const attack = calculateAttackDifficulty(
          team.off_rating,
          opponents,
          teamById,
          leagueMean,
        );

        const defense = calculateDefenseDifficulty(
          team.def_rating,
          opponents,
          teamById,
          leagueMean,
        );

        const gameweekScore: GameweekScore = {
          attack,
          defense,
        };

        difficultyScores.byTeam[team.id][gameweek] = gameweekScore;
      });

      // Precompute sorted team IDs for this gameweek
      const sortedByAttack = sortByGameweek(
        fixtures,
        gameweek,
        "desc",
        "offense",
        teamById,
        leagueMean,
      );

      const sortedByDefense = sortByGameweek(
        fixtures,
        gameweek,
        "asc",
        "defense",
        teamById,
        leagueMean,
      );

      difficultyScores.byGameweek[gameweek] = {
        sortedByAttack,
        sortedByDefense,
      };
    });

    return difficultyScores;
  }, [teams, fixtures]);
}
