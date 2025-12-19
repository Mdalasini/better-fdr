"use client";

import type { Team } from "@/lib/domain/teams";

interface TeamFilterProps {
  teams: Team[];
  hiddenTeamIds: Set<number>;
  onToggleTeam: (teamId: number) => void;
}

export function TeamFilter({
  teams,
  hiddenTeamIds,
  onToggleTeam,
}: TeamFilterProps) {
  // Sort teams alphabetically by short name
  const sortedTeams = [...teams].sort((a, b) =>
    a.short_name.localeCompare(b.short_name),
  );

  return (
    <div className="mt-6 pt-4 border-t border-slate-200">
      <p className="text-sm text-slate-500 mb-3">Toggle teams:</p>
      <div className="flex flex-wrap gap-2">
        {sortedTeams.map((team) => {
          const isHidden = hiddenTeamIds.has(team.id);
          return (
            <button
              key={team.id}
              type="button"
              onClick={() => onToggleTeam(team.id)}
              className={`px-2.5 py-1 text-sm rounded border transition-colors ${
                isHidden
                  ? "bg-slate-100 text-slate-400 border-slate-200 line-through"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              {team.short_name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
