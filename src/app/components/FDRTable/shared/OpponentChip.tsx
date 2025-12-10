"use client";

import type { EnrichedTeam } from "@/lib/types/gameSetup";
import type { Opponent } from "../types";

interface OpponentChipProps {
  opponent: Opponent;
  team: EnrichedTeam;
  className?: string;
}

/**
 * Chip component to display opponent information with home/away indicator
 * Uses sleek, minimal styling to fit the updated design
 */
export function OpponentChip({
  opponent,
  team,
  className = "",
}: OpponentChipProps) {
  const isHome = opponent.home;

  return (
    <div
      className={`text-sm truncate flex items-center gap-1 ${className}`}
      title={`${isHome ? "Home" : "Away"} vs ${team.name}`}
    >
      <span className="text-slate-800 font-medium">{team.short_name}</span>
      <span
        className={[
          "text-xs font-medium px-1 py-0.5 rounded",
          isHome
            ? "text-emerald-700 bg-emerald-50"
            : "text-slate-500 bg-slate-50",
        ].join(" ")}
      >
        {isHome ? "H" : "A"}
      </span>
    </div>
  );
}
