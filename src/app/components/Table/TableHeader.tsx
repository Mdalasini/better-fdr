"use client";

import { useMemo, useState } from "react";
import type { Fixture } from "@/lib/types/fixtures";
import type { TeamData } from "@/lib/types/teams";
import { sortByGameweek, sortByGameweekRange } from "./utils";

interface Props {
  min: number;
  max: number;
  fixtures: Fixture[];
  teams: TeamData[];
  sortBy: "offense" | "defense";
  onOrderChange: (
    orderedTeamIds: string[],
    column: number,
    direction: "asc" | "desc",
  ) => void;
}

export default function TableHeader({
  min,
  max,
  fixtures,
  teams,
  sortBy,
  onOrderChange,
}: Props) {
  const gameweeks = useMemo(
    () => Array.from({ length: max - min + 1 }, (_, i) => min + i),
    [min, max],
  );

  const [sortColumn, setSortColumn] = useState<number>(-1);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [lastSortBy, setLastSortBy] = useState<"offense" | "defense">(
    "offense",
  );

  function handleHeaderClick(column: number) {
    const defaultDir: "asc" | "desc" = sortBy === "offense" ? "desc" : "asc";
    const nextDirection: "asc" | "desc" =
      column === sortColumn && lastSortBy === sortBy
        ? sortDirection === "asc"
          ? "desc"
          : "asc"
        : defaultDir;

    const sortKey: "off" | "def" = sortBy === "offense" ? "off" : "def";

    let ordered: string[] = [];
    if (column === 0) {
      const startWeek = min;
      const overallMax =
        fixtures.length > 0
          ? Math.max(...fixtures.map((f) => f.gameweek))
          : max;
      const endWeek = Math.min(min + 5, overallMax);
      ordered = sortByGameweekRange(
        fixtures,
        startWeek,
        endWeek,
        nextDirection,
        sortKey,
      );
    } else {
      const gw = min + (column - 1);
      ordered = sortByGameweek(fixtures, gw, nextDirection, sortKey);
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
          className="px-2 py-2 text-left text-xs font-medium text-gray-600 cursor-pointer select-none"
          onClick={() => handleHeaderClick(0)}
        >
          Team
        </th>
        {gameweeks.map((gameweek) => (
          <th
            key={gameweek}
            className="px-2 py-2 text-center text-xs font-medium text-gray-600 cursor-pointer select-none"
            onClick={() => handleHeaderClick(gameweek - min + 1)}
          >
            GW {gameweek}
          </th>
        ))}
      </tr>
    </thead>
  );
}
