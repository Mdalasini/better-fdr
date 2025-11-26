"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { SortBy, GameweekStats } from "../types";

const DESKTOP_WINDOW_SIZE = 10;

interface UseFDRControlsOptions {
  currentGameweek: number | undefined;
  gameweekStats: GameweekStats;
  isDesktop?: boolean;
}

interface UseFDRControlsReturn {
  tableWindow: [number, number];
  sortBy: SortBy;
  orderedTeamIds: number[] | null;
  gameweekRange: number;
  setTableWindow: (window: [number, number]) => void;
  setSortBy: (sortBy: SortBy) => void;
  setOrderedTeamIds: (teamIds: number[] | null) => void;
  setGameweekRange: (range: number) => void;
  handleWindowChange: (direction: "next" | "prev") => void;
  handleSortByChange: (newSortBy: SortBy) => void;
  handleGameweekRangeChange: (range: number) => void;
}

/**
 * Hook for managing FDR table UI state and controls
 * On mobile, window size matches the gameweek range
 * On desktop, window size is fixed at 10
 */
export function useFDRControls({
  currentGameweek,
  gameweekStats,
  isDesktop = true,
}: UseFDRControlsOptions): UseFDRControlsReturn {
  const [tableWindow, setTableWindow] = useState<[number, number]>([1, 1]);
  const [sortBy, setSortBy] = useState<SortBy>("offense");
  const [orderedTeamIds, setOrderedTeamIds] = useState<number[] | null>(null);
  const [gameweekRange, setGameweekRange] = useState(5);

  // Track if initial window has been set
  const initializedRef = useRef(false);
  // Track previous isDesktop value to detect changes
  const prevIsDesktopRef = useRef(isDesktop);

  // Calculate window size based on device type
  const windowSize = isDesktop ? DESKTOP_WINDOW_SIZE : gameweekRange;

  // Set initial window only once when currentGameweek and gameweekStats are both available
  useEffect(() => {
    if (currentGameweek && gameweekStats.max > 0 && !initializedRef.current) {
      const endWeek = Math.min(
        currentGameweek + windowSize - 1,
        gameweekStats.max,
      );
      setTableWindow([currentGameweek, endWeek]);
      initializedRef.current = true;
    }
  }, [currentGameweek, windowSize, gameweekStats.max]);

  // Handle switching between mobile and desktop
  useEffect(() => {
    if (initializedRef.current && prevIsDesktopRef.current !== isDesktop) {
      const newWindowSize = isDesktop ? DESKTOP_WINDOW_SIZE : gameweekRange;
      setTableWindow(([min]) => {
        const newMax = Math.min(min + newWindowSize - 1, gameweekStats.max);
        return [min, newMax];
      });
    }
    prevIsDesktopRef.current = isDesktop;
  }, [isDesktop, gameweekRange, gameweekStats.max]);

  // Update window size when gameweek range changes on mobile (preserve current position)
  useEffect(() => {
    if (!isDesktop && initializedRef.current) {
      setTableWindow(([min]) => {
        const newMax = Math.min(min + gameweekRange - 1, gameweekStats.max);
        return [min, newMax];
      });
    }
  }, [gameweekRange, isDesktop, gameweekStats.max]);

  const handleWindowChange = useCallback(
    (direction: "next" | "prev") => {
      setTableWindow(([min, max]) => {
        const currentWindowSize = max - min + 1;
        if (direction === "next") {
          const nextMax = Math.min(gameweekStats.max, max + 1);
          const nextMin = Math.min(min + 1, nextMax - currentWindowSize + 1);
          return [nextMin, nextMax];
        }
        const nextMin = Math.max(gameweekStats.min, min - 1);
        const nextMax = Math.max(nextMin + currentWindowSize - 1, min - 1);
        return [nextMin, nextMax];
      });
    },
    [gameweekStats],
  );

  const handleSortByChange = useCallback((newSortBy: SortBy) => {
    setSortBy(newSortBy);
  }, []);

  const handleGameweekRangeChange = useCallback((range: number) => {
    setGameweekRange(range);
  }, []);

  return {
    tableWindow,
    sortBy,
    orderedTeamIds,
    gameweekRange,
    setTableWindow,
    setSortBy,
    setOrderedTeamIds,
    setGameweekRange,
    handleWindowChange,
    handleSortByChange,
    handleGameweekRangeChange,
  };
}
