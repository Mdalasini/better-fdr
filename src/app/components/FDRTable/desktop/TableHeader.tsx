"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { SortBy, SortDirection } from "../types";
import { useFDRData } from "../context/FDRDataProvider";
import { sortByGameweek, sortByGameweekRange } from "../utils/sorting";

interface TableHeaderProps {
  min: number;
  max: number;
  sortBy: SortBy;
  onOrderChange: (
    orderedTeamIds: number[],
    column: number,
    direction: SortDirection,
  ) => void;
  gameweekRange: number;
}

/**
 * Desktop table header with sortable columns
 * Sleek, minimal styling with subtle hover states
 */
export function TableHeader({
  min,
  max,
  sortBy,
  onOrderChange,
  gameweekRange,
}: TableHeaderProps) {
  const { fixtures, teamById, leagueMean, gameweekStats } = useFDRData();

  const gameweeks = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

  const highlightedGameweeks = useMemo(() => {
    const highlighted = new Set<number>();
    for (let i = 0; i < gameweekRange; i++) {
      highlighted.add(min + i);
    }
    return highlighted;
  }, [min, gameweekRange]);

  const [sortColumn, setSortColumn] = useState<number>(-1);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [lastSortBy, setLastSortBy] = useState<SortBy>("offense");

  function handleHeaderClick(column: number) {
    if (!fixtures) return;

    const defaultDir: SortDirection = sortBy === "offense" ? "desc" : "asc";
    const nextDirection: SortDirection =
      column === sortColumn && lastSortBy === sortBy
        ? sortDirection === "asc"
          ? "desc"
          : "asc"
        : defaultDir;

    let ordered: number[] = [];
    if (column === 0) {
      // Sort by range
      const startWeek = min;
      const endWeek = Math.min(min + gameweekRange - 1, gameweekStats.max);
      ordered = sortByGameweekRange(
        fixtures,
        startWeek,
        endWeek,
        nextDirection,
        sortBy,
        teamById,
        leagueMean,
      );
    } else {
      // Sort by single gameweek
      ordered = sortByGameweek(
        fixtures,
        column,
        nextDirection,
        sortBy,
        teamById,
        leagueMean,
      );
    }

    setSortColumn(column);
    setSortDirection(nextDirection);
    setLastSortBy(sortBy);

    onOrderChange(ordered, column, nextDirection);
  }

  return (
    <thead>
      <tr>
        <th
          className="sticky left-0 z-10 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-3 py-3 cursor-pointer hover:bg-slate-100 transition-colors rounded-l-lg"
          onClick={() => handleHeaderClick(0)}
        >
          <div className="flex justify-between items-center gap-2">
            <span>Team</span>
            <div className="w-4 h-4 text-slate-400">
              {sortColumn === 0 &&
                (sortDirection === "asc" ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                ))}
            </div>
          </div>
        </th>
        {gameweeks.map((gameweek, idx) => {
          const isHighlighted = highlightedGameweeks.has(gameweek);
          const isLast = idx === gameweeks.length - 1;

          return (
            <th
              key={gameweek}
              className={[
                "text-center text-xs font-medium uppercase tracking-wider px-3 py-3 cursor-pointer transition-colors",
                isHighlighted
                  ? "bg-slate-100 text-slate-700"
                  : "bg-slate-50 text-slate-500",
                "hover:bg-slate-100",
                isLast ? "rounded-r-lg" : "",
              ].join(" ")}
              onClick={() => handleHeaderClick(gameweek)}
            >
              <div className="flex justify-center items-center gap-1">
                <span>{gameweek}</span>
                <div className="w-4 h-4 text-slate-400">
                  {sortColumn === gameweek &&
                    (sortDirection === "asc" ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronUp size={14} />
                    ))}
                </div>
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
