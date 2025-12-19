"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFixtures } from "@/lib/hooks/useFixtures";
import { useTeams } from "@/lib/hooks/useTeams";
import type { DifficultyMode } from "@/lib/utils/difficulty";
import {
  processAllTeams,
  type SortType,
  sortTeamRows,
} from "@/lib/utils/fixtures";
import {
  getCurrentGameweek,
  getMaxGameweek,
  getVisibleGameweeks,
} from "@/lib/utils/gameweek";
import { Controls } from "./Controls";
import { DesktopTable } from "./DesktopTable";
import { MobileCards } from "./MobileCards";
import { TeamFilter } from "./TeamFilter";

const STORAGE_KEY = "fdr-hidden-teams";

// Responsive breakpoints for gameweek count
// Desktop: 10 -> 9 -> 8 -> 7 -> 6, then switch to mobile at 5
function useResponsiveGameweekCount() {
  const [count, setCount] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // sm breakpoint - switch to mobile
        setIsMobile(true);
        setCount(5);
      } else if (width < 768) {
        // md breakpoint
        setIsMobile(false);
        setCount(6);
      } else if (width < 1024) {
        // lg breakpoint
        setIsMobile(false);
        setCount(7);
      } else if (width < 1280) {
        // xl breakpoint
        setIsMobile(false);
        setCount(8);
      } else if (width < 1536) {
        // 2xl breakpoint
        setIsMobile(false);
        setCount(9);
      } else {
        setIsMobile(false);
        setCount(10);
      }
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  return { count, isMobile };
}

export default function FDRTable() {
  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
  } = useTeams();
  const {
    data: fixtures,
    isLoading: fixturesLoading,
    error: fixturesError,
  } = useFixtures();

  const { count: gameweekCount, isMobile } = useResponsiveGameweekCount();

  // State
  const [mode, setMode] = useState<DifficultyMode>("offense");
  const [startGameweek, setStartGameweek] = useState<number | null>(null);
  const [sortType, setSortType] = useState<SortType>({ type: "none" });
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [hiddenTeamIds, setHiddenTeamIds] = useState<Set<number>>(new Set());

  // Load hidden teams from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as number[];
        setHiddenTeamIds(new Set(ids));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save hidden teams to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...hiddenTeamIds]));
    } catch {
      // Ignore localStorage errors
    }
  }, [hiddenTeamIds]);

  // Calculate current gameweek on initial load
  useEffect(() => {
    if (fixtures && fixtures.length > 0 && startGameweek === null) {
      const current = getCurrentGameweek(fixtures);
      setStartGameweek(current);
    }
  }, [fixtures, startGameweek]);

  const maxGameweek = useMemo(() => {
    if (!fixtures || fixtures.length === 0) return 38;
    return getMaxGameweek(fixtures);
  }, [fixtures]);

  const visibleGameweeks = useMemo(() => {
    if (startGameweek === null) return [];
    return getVisibleGameweeks(startGameweek, gameweekCount, maxGameweek);
  }, [startGameweek, gameweekCount, maxGameweek]);

  // Process team data
  const processedTeams = useMemo(() => {
    if (!teams || !fixtures || visibleGameweeks.length === 0) return [];
    return processAllTeams(teams, fixtures, mode, visibleGameweeks);
  }, [teams, fixtures, mode, visibleGameweeks]);

  // Filter hidden teams
  const filteredTeams = useMemo(() => {
    return processedTeams.filter((row) => !hiddenTeamIds.has(row.team.id));
  }, [processedTeams, hiddenTeamIds]);

  // Sort teams
  const sortedTeams = useMemo(() => {
    return sortTeamRows(filteredTeams, sortType, sortDirection);
  }, [filteredTeams, sortType, sortDirection]);

  // Handlers
  const handleSort = useCallback(
    (event: number) => {
      if (sortType.type === "event" && sortType.event === event) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortType({ type: "event", event });
        setSortDirection("asc");
      }
    },
    [sortType],
  );

  const handleSortByCurrentGW = useCallback(() => {
    if (startGameweek === null) return;
    if (sortType.type === "event" && sortType.event === startGameweek) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortType({ type: "event", event: startGameweek });
      setSortDirection("asc");
    }
  }, [sortType, startGameweek]);

  const handleSortByNext5 = useCallback(() => {
    if (startGameweek === null) return;
    if (sortType.type === "next5" && sortType.startEvent === startGameweek) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortType({ type: "next5", startEvent: startGameweek });
      setSortDirection("asc");
    }
  }, [sortType, startGameweek]);

  const handlePrevious = useCallback(() => {
    setStartGameweek((prev) => (prev !== null && prev > 1 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setStartGameweek((prev) =>
      prev !== null && prev < maxGameweek - gameweekCount + 1 ? prev + 1 : prev,
    );
  }, [maxGameweek, gameweekCount]);

  const handleToggleTeam = useCallback((teamId: number) => {
    setHiddenTeamIds((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) {
        next.delete(teamId);
      } else {
        next.add(teamId);
      }
      return next;
    });
  }, []);

  // Loading state
  if (teamsLoading || fixturesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  // Error state
  if (teamsError || fixturesError) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">
          Error loading data. Please try again.
        </div>
      </div>
    );
  }

  // No data state
  if (!teams || !fixtures || visibleGameweeks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-500">No data available.</div>
      </div>
    );
  }

  const visibleRange: [number, number] = [
    visibleGameweeks[0],
    visibleGameweeks[visibleGameweeks.length - 1],
  ];

  return (
    <div>
      <Controls
        mode={mode}
        onModeChange={setMode}
        currentGameweek={startGameweek ?? 1}
        visibleRange={visibleRange}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={startGameweek !== null && startGameweek > 1}
        canGoNext={
          startGameweek !== null &&
          startGameweek < maxGameweek - gameweekCount + 1
        }
        sortType={sortType}
        sortDirection={sortDirection}
        onSortByCurrentGW={handleSortByCurrentGW}
        onSortByNext5={handleSortByNext5}
      />

      {sortedTeams.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          No teams selected. Use the filter below to show teams.
        </div>
      ) : isMobile ? (
        <MobileCards
          teamRows={sortedTeams}
          visibleGameweeks={visibleGameweeks}
        />
      ) : (
        <DesktopTable
          teamRows={sortedTeams}
          visibleGameweeks={visibleGameweeks}
          sortType={sortType}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      <TeamFilter
        teams={teams}
        hiddenTeamIds={hiddenTeamIds}
        onToggleTeam={handleToggleTeam}
      />
    </div>
  );
}
