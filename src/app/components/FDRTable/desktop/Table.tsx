"use client";

import { useMemo } from "react";
import { useFDRData } from "../context/FDRDataProvider";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { TableControls } from "./TableControls";
import type { SortBy } from "../types";

interface TableProps {
  tableWindow: [number, number];
  sortBy: SortBy;
  orderedTeamIds: number[] | null;
  gameweekRange: number;
  onWindowChange: (direction: "next" | "prev") => void;
  onSortByChange: (sortBy: SortBy) => void;
  onGameweekRangeChange: (range: number) => void;
  onOrderChange: (teamIds: number[] | null) => void;
}

/**
 * Desktop table view for FDR
 * Displays teams in rows and gameweeks in columns with sleek, minimal styling
 */
export function Table({
  tableWindow,
  sortBy,
  orderedTeamIds,
  gameweekRange,
  onWindowChange,
  onSortByChange,
  onGameweekRangeChange,
  onOrderChange,
}: TableProps) {
  const { teams, gameweekStats } = useFDRData();

  const [tableWindowMin, tableWindowMax] = tableWindow;

  // Default team ordering (alphabetical by short name)
  const defaultTeamIds = useMemo(() => {
    if (!teams) return [];
    return [...teams]
      .sort((a, b) => a.short_name.localeCompare(b.short_name))
      .map((team) => team.id);
  }, [teams]);

  const displayedTeamIds = orderedTeamIds ?? defaultTeamIds;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 w-full">
      <TableControls
        onWindowChange={onWindowChange}
        windowMin={tableWindowMin}
        windowMax={tableWindowMax}
        minWeek={gameweekStats.min}
        maxWeek={gameweekStats.max}
        sortBy={sortBy}
        onSortByChange={onSortByChange}
        gameweekRange={gameweekRange}
        onGameweekRangeChange={onGameweekRangeChange}
      />

      <div className="overflow-x-auto mt-6">
        <table className="table-auto w-full border-separate border-spacing-x-1 border-spacing-y-1">
          <TableHeader
            min={tableWindowMin}
            max={tableWindowMax}
            sortBy={sortBy}
            onOrderChange={(ids) => onOrderChange(ids)}
            gameweekRange={gameweekRange}
          />
          <tbody>
            {displayedTeamIds.map((teamId) => (
              <TableRow
                key={teamId}
                teamId={teamId}
                min={tableWindowMin}
                max={tableWindowMax}
                sortBy={sortBy}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
