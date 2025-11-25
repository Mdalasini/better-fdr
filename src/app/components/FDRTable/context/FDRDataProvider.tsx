"use client";

import { createContext, useContext, useMemo } from "react";
import type React from "react";
import { useTeams } from "@/lib/hooks/useTeams";
import { useFixtures } from "@/lib/hooks/useFixtures";
import { useCurrentGameweek } from "@/lib/hooks/useCurrentGameweek";
import type { Fixture } from "@/lib/types/fixtures";
import type { FDRDataContextValue, GameweekStats } from "../types";
import { useDifficultyScores } from "../hooks/useDifficultyScores";
import { createTeamLookup, calculateLeagueMean } from "../utils";

const FDRDataContext = createContext<FDRDataContextValue | undefined>(
  undefined,
);

/**
 * Get min and max gameweek from fixtures
 */
function getGameweekStats(fixtures: Fixture[]): GameweekStats {
  if (fixtures.length === 0) {
    return { min: 0, max: 0 };
  }

  const gameweeks = fixtures.map((fixture) => fixture.event);
  return {
    min: Math.min(...gameweeks),
    max: Math.max(...gameweeks),
  };
}

interface FDRDataProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that fetches and manages all FDR data
 * This eliminates prop drilling and ensures single source of truth
 */
export function FDRDataProvider({ children }: FDRDataProviderProps) {
  const teamsQuery = useTeams();
  const fixturesQuery = useFixtures();
  const gameweekQuery = useCurrentGameweek();

  // Precompute all difficulty scores
  const difficultyScores = useDifficultyScores(
    teamsQuery.data,
    fixturesQuery.data,
  );

  // Memoize derived values
  const teamById = useMemo(() => {
    if (!teamsQuery.data) return {};
    return createTeamLookup(teamsQuery.data);
  }, [teamsQuery.data]);

  const leagueMean = useMemo(() => {
    if (!teamsQuery.data) return 0;
    return calculateLeagueMean(teamsQuery.data);
  }, [teamsQuery.data]);

  const gameweekStats = useMemo(() => {
    if (!fixturesQuery.data) return { min: 0, max: 0 };
    return getGameweekStats(fixturesQuery.data);
  }, [fixturesQuery.data]);

  const value: FDRDataContextValue = {
    teams: teamsQuery.data,
    fixtures: fixturesQuery.data,
    currentGameweek: gameweekQuery.data?.gameweek,
    difficultyScores,
    gameweekStats,
    isLoading: teamsQuery.isLoading || fixturesQuery.isLoading,
    isError: teamsQuery.isError || fixturesQuery.isError,
    teamById,
    leagueMean,
  };

  return (
    <FDRDataContext.Provider value={value}>{children}</FDRDataContext.Provider>
  );
}

/**
 * Hook to access FDR data from context
 */
export function useFDRData(): FDRDataContextValue {
  const context = useContext(FDRDataContext);
  if (context === undefined) {
    throw new Error("useFDRData must be used within a FDRDataProvider");
  }
  return context;
}
