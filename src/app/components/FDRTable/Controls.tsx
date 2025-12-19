"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import type { DifficultyMode } from "@/lib/utils/difficulty";
import type { SortType } from "@/lib/utils/fixtures";

interface ControlsProps {
  mode: DifficultyMode;
  onModeChange: (mode: DifficultyMode) => void;
  currentGameweek: number;
  visibleRange: [number, number];
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  sortType: SortType;
  sortDirection: "asc" | "desc";
  onSortByCurrentGW: () => void;
  onSortByNext5: () => void;
}

export function Controls({
  mode,
  onModeChange,
  currentGameweek,
  visibleRange,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  sortType,
  sortDirection,
  onSortByCurrentGW,
  onSortByNext5,
}: ControlsProps) {
  const isCurrentGWSorted =
    sortType.type === "event" && sortType.event === currentGameweek;
  const isNext5Sorted =
    sortType.type === "next5" && sortType.startEvent === currentGameweek;

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center justify-between">
        {/* Mode Toggle */}
        <div className="flex rounded-md border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => onModeChange("offense")}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "offense"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Offense
          </button>
          <button
            type="button"
            onClick={() => onModeChange("defense")}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "defense"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Defense
          </button>
        </div>

        {/* Gameweek Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous gameweek"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-slate-600 min-w-[80px] text-center">
            GW {visibleRange[0]}-{visibleRange[1]}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next gameweek"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sort Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Sort by:</span>
        <button
          type="button"
          onClick={onSortByCurrentGW}
          className={`px-3 py-1.5 text-sm font-medium rounded border transition-colors flex items-center gap-1 ${
            isCurrentGWSorted
              ? "bg-slate-100 border-slate-300 text-slate-900"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          GW {currentGameweek}
          {isCurrentGWSorted && (
            <span className="text-slate-500">
              {sortDirection === "asc" ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onSortByNext5}
          className={`px-3 py-1.5 text-sm font-medium rounded border transition-colors flex items-center gap-1 ${
            isNext5Sorted
              ? "bg-slate-100 border-slate-300 text-slate-900"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Next 5
          {isNext5Sorted && (
            <span className="text-slate-500">
              {sortDirection === "asc" ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
