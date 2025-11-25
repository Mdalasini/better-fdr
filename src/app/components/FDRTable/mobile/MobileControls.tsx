"use client";

import type { SortBy, MobileSortMode } from "../types";

interface MobileControlsProps {
  sortBy: SortBy;
  onSortByChange: (sortBy: SortBy) => void;
  gameweekRange: number;
  onGameweekRangeChange: (range: number) => void;
  windowMin: number;
  windowMax: number;
  minWeek: number;
  maxWeek: number;
  onWindowChange: (direction: "next" | "prev") => void;
  mobileSortMode: MobileSortMode;
  onMobileSortModeChange: (mode: MobileSortMode) => void;
  onSort: () => void;
}

/**
 * Mobile controls with sleek, minimal design
 * Includes sorting by current gameweek or range
 */
export function MobileControls({
  sortBy,
  onSortByChange,
  gameweekRange,
  onGameweekRangeChange,
  windowMin,
  windowMax,
  minWeek,
  maxWeek,
  onWindowChange,
  mobileSortMode,
  onMobileSortModeChange,
  onSort,
}: MobileControlsProps) {
  const rangeOptions = [3, 4, 5, 6];
  const sortOptions: SortBy[] = ["offense", "defense"];
  const sortModeOptions: { value: MobileSortMode; label: string }[] = [
    { value: "current", label: `GW ${windowMin}` },
    {
      value: "range",
      label: `GW ${windowMin}–${windowMin + gameweekRange - 1}`,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Perspective Toggle */}
      <div>
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
          Perspective
        </div>
        <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
          {sortOptions.map((value) => {
            const isActive = sortBy === value;
            return (
              <button
                key={value}
                type="button"
                className={[
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
                onClick={() => onSortByChange(value)}
              >
                {value === "offense" ? "Attack" : "Defense"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gameweek Range */}
      <div>
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
          Window Size
        </div>
        <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
          {rangeOptions.map((n) => {
            const isActive = gameweekRange === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={isActive}
                onClick={() => onGameweekRangeChange(n)}
                className={[
                  "px-4 py-2 text-sm font-medium rounded-md transition-all min-w-11",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900",
                ].join(" ")}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div>
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
          Gameweeks
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={windowMin <= minWeek}
            className="flex-1 h-10 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => onWindowChange("prev")}
          >
            ←
          </button>
          <div className="flex-2 h-10 flex items-center justify-center text-sm font-medium text-slate-700 bg-slate-50 rounded-lg">
            GW {windowMin}–{windowMax}
          </div>
          <button
            type="button"
            disabled={windowMax >= maxWeek}
            className="flex-1 h-10 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            onClick={() => onWindowChange("next")}
          >
            →
          </button>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="pt-2 border-t border-slate-100">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
          Sort Teams By
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 inline-flex rounded-lg bg-slate-100 p-0.5">
            {sortModeOptions.map(({ value, label }) => {
              const isActive = mobileSortMode === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onMobileSortModeChange(value)}
                  className={[
                    "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all",
                    isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onSort}
            className="h-10 px-4 text-sm font-medium rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            Sort
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-100">
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
          Legend
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300" />
            <span>Easy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-300" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-100 border border-rose-300" />
            <span>Hard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
