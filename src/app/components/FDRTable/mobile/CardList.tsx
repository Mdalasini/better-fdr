"use client";

import { useMemo, useState, useCallback } from "react";
import { useFDRData } from "../context/FDRDataProvider";
import { TeamCard } from "./TeamCard";
import { MobileControls } from "./MobileControls";
import type { SortBy, MobileSortMode, SortDirection } from "../types";
import { sortByGameweek, sortByGameweekRange } from "../utils";

interface CardListProps {
  tableWindow: [number, number];
  sortBy: SortBy;
  orderedTeamIds: number[] | null;
  gameweekRange: number;
  onWindowChange: (direction: "next" | "prev") => void;
  onSortByChange: (sortBy: SortBy) => void;
  onGameweekRangeChange: (range: number) => void;
}

interface SortState {
  teamIds: number[] | null;
  direction: SortDirection;
  sortBy: SortBy;
  mode: MobileSortMode;
}

/**
 * Mobile card list view for FDR
 * Displays teams as vertical cards with sleek, minimal styling
 */
export function CardList({
  tableWindow,
  sortBy,
  orderedTeamIds,
  gameweekRange,
  onWindowChange,
  onSortByChange,
  onGameweekRangeChange,
}: CardListProps) {
  const { teams, fixtures, teamById, leagueMean, gameweekStats } = useFDRData();

  const [tableWindowMin, tableWindowMax] = tableWindow;
  const [mobileSortMode, setMobileSortMode] = useState<MobileSortMode>("range");
  const [sortState, setSortState] = useState<SortState>({
    teamIds: null,
    direction: "desc",
    sortBy: "offense",
    mode: "range",
  });

  // Default team ordering (alphabetical by short name)
  const defaultTeamIds = useMemo(() => {
    if (!teams) return [];
    return [...teams]
      .sort((a, b) => a.short_name.localeCompare(b.short_name))
      .map((team) => team.id);
  }, [teams]);

  // Handle mobile sort
  const handleSort = useCallback(() => {
    if (!fixtures || !teamById) return;

    // Determine if we should reverse the direction
    // Reverse if same sortBy and same mode as last sort
    const shouldReverse =
      sortState.teamIds !== null &&
      sortState.sortBy === sortBy &&
      sortState.mode === mobileSortMode;

    // Calculate new direction
    let newDirection: SortDirection;
    if (shouldReverse) {
      // Toggle direction
      newDirection = sortState.direction === "desc" ? "asc" : "desc";
    } else {
      // Default direction based on sortBy
      newDirection = sortBy === "offense" ? "desc" : "asc";
    }

    let sorted: number[];

    if (mobileSortMode === "current") {
      sorted = sortByGameweek(
        fixtures,
        tableWindowMin,
        newDirection,
        sortBy,
        teamById,
        leagueMean,
      );
    } else {
      const startWeek = tableWindowMin;
      const endWeek = Math.min(
        tableWindowMin + gameweekRange - 1,
        gameweekStats.max,
      );
      sorted = sortByGameweekRange(
        fixtures,
        startWeek,
        endWeek,
        newDirection,
        sortBy,
        teamById,
        leagueMean,
      );
    }

    setSortState({
      teamIds: sorted,
      direction: newDirection,
      sortBy,
      mode: mobileSortMode,
    });
  }, [
    fixtures,
    teamById,
    leagueMean,
    mobileSortMode,
    tableWindowMin,
    gameweekRange,
    gameweekStats.max,
    sortBy,
    sortState,
  ]);

  const displayedTeamIds =
    sortState.teamIds ?? orderedTeamIds ?? defaultTeamIds;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <MobileControls
          sortBy={sortBy}
          onSortByChange={onSortByChange}
          gameweekRange={gameweekRange}
          onGameweekRangeChange={onGameweekRangeChange}
          windowMin={tableWindowMin}
          windowMax={tableWindowMax}
          minWeek={gameweekStats.min}
          maxWeek={gameweekStats.max}
          onWindowChange={onWindowChange}
          mobileSortMode={mobileSortMode}
          onMobileSortModeChange={setMobileSortMode}
          onSort={handleSort}
        />
      </div>

      {/* Team Cards */}
      <div className="space-y-3">
        {displayedTeamIds.map((teamId) => (
          <TeamCard
            key={teamId}
            teamId={teamId}
            min={tableWindowMin}
            max={tableWindowMax}
            sortBy={sortBy}
          />
        ))}
      </div>
    </div>
  );
}
