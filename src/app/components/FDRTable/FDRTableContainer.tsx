"use client";

import { useFDRData } from "./context/FDRDataProvider";
import { useFDRControls, useIsDesktop } from "./hooks";
import { Table } from "./desktop";
import { CardList } from "./mobile";

/**
 * Main container component that handles responsive view switching
 * Renders desktop table or mobile cards based on screen size
 */
export function FDRTableContainer() {
  const {
    teams,
    fixtures,
    isLoading,
    isError,
    gameweekStats,
    currentGameweek,
  } = useFDRData();

  const isDesktop = useIsDesktop();

  const {
    tableWindow,
    sortBy,
    orderedTeamIds,
    gameweekRange,
    setOrderedTeamIds,
    handleWindowChange,
    handleSortByChange,
    handleGameweekRangeChange,
  } = useFDRControls({
    currentGameweek,
    gameweekStats,
    isDesktop,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            Fixture Difficulty
          </h1>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-pulse space-y-3 w-full max-w-md">
              <div className="h-3 bg-slate-200 rounded-full w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded-full w-1/2"></div>
              <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            Fixture Difficulty
          </h1>
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-rose-700 mt-4">
            <h2 className="font-medium mb-3">
              Something went wrong loading the fixture data.
            </h2>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!teams || teams.length === 0 || !fixtures || fixtures.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            Fixture Difficulty
          </h1>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-500">No fixtures found for this season.</p>
        </div>
      </div>
    );
  }

  // Render appropriate view based on screen size
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
          Fixture Difficulty
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Color indicates relative difficulty based on selected perspective
        </p>
      </div>

      {isDesktop ? (
        <Table
          tableWindow={tableWindow}
          sortBy={sortBy}
          orderedTeamIds={orderedTeamIds}
          gameweekRange={gameweekRange}
          onWindowChange={handleWindowChange}
          onSortByChange={handleSortByChange}
          onGameweekRangeChange={handleGameweekRangeChange}
          onOrderChange={setOrderedTeamIds}
        />
      ) : (
        <CardList
          tableWindow={tableWindow}
          sortBy={sortBy}
          orderedTeamIds={orderedTeamIds}
          gameweekRange={gameweekRange}
          onWindowChange={handleWindowChange}
          onSortByChange={handleSortByChange}
          onGameweekRangeChange={handleGameweekRangeChange}
        />
      )}
    </div>
  );
}
