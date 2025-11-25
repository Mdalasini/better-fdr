"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SortBy } from "../types";

interface TableControlsProps {
  onWindowChange: (direction: "next" | "prev") => void;
  windowMin: number;
  windowMax: number;
  minWeek: number;
  maxWeek: number;
  sortBy: SortBy;
  onSortByChange: (sortBy: SortBy) => void;
  gameweekRange: number;
  onGameweekRangeChange: (gameweekRange: number) => void;
}

/**
 * Desktop controls for the FDR table
 * Sleek, minimal design with toggle buttons
 */
export function TableControls({
  onWindowChange,
  windowMin,
  windowMax,
  minWeek,
  maxWeek,
  sortBy,
  onSortByChange,
  gameweekRange,
  onGameweekRangeChange,
}: TableControlsProps) {
  const rangeOptions = [3, 4, 5, 6];
  const sortOptions: SortBy[] = ["offense", "defense"];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Left Controls */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Perspective Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Perspective
          </span>
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
            {sortOptions.map((value) => {
              const isActive = sortBy === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onSortByChange(value)}
                  className={[
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                    isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900",
                  ].join(" ")}
                >
                  {value === "offense" ? "Attack" : "Defense"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Range Selection */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Range
          </span>
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
                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all min-w-10",
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
      </div>

      {/* Right Controls - Navigation */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={windowMin <= minWeek}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-100 transition-colors"
          onClick={() => onWindowChange("prev")}
          aria-label="Previous gameweeks"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg min-w-[100px] text-center">
          GW {windowMin}–{windowMax}
        </div>
        <button
          type="button"
          disabled={windowMax >= maxWeek}
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-100 transition-colors"
          onClick={() => onWindowChange("next")}
          aria-label="Next gameweeks"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Legend - inline */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
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
  );
}
