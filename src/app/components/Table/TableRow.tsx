"use client";

import Image from "next/image";
import { useFixtures } from "@/lib/hooks/useFixtures";
import { useTeams } from "@/lib/hooks/useTeams";
import type { TeamData } from "@/lib/types/teams";
import TableCell from "./TableCell";
import { fixtureForTeamInWeek, getAttack, getDefense } from "./utils";

interface Props {
  teamId: string;
  min: number;
  max: number;
  sortBy: "offense" | "defense";
  season: string;
}

export default function TableRow({
  teamId,
  min,
  max,
  sortBy,
  season,
}: Props) {
  const teamsQuery = useTeams(season);
  const fixturesQuery = useFixtures(season);

  if (!teamsQuery.data || !fixturesQuery.data) return null;

  // team lookup table
  const teamById: Record<string, TeamData> = {};
  teamsQuery.data.forEach((team) => {
    teamById[team.team_id] = team;
  });

  // Calculate sums for first 5 gameweeks
  const weeksToSum = Math.min(5, max - min + 1);
  let totalOffense = 0;
  let totalDefense = 0;

  for (let i = 0; i < weeksToSum; i++) {
    const gameweek = min + i;
    const weekFixtures = fixtureForTeamInWeek(
      fixturesQuery.data,
      teamId,
      gameweek,
    );

    const attackStats = getAttack(
      teamById[teamId].off_rating,
      weekFixtures,
      teamById,
    );
    const defenseStats = getDefense(
      teamById[teamId].def_rating,
      weekFixtures,
      teamById,
    );
    totalOffense += attackStats.gw_attack;
    totalDefense += defenseStats.gw_defense;
  }

  const gameweeks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <tr className="align-middle">
      <td
        className="px-2 py-2 text-left min-w-48 text-sm font-semibold border-b border-gray-200"
        data-team-id={teamId}
        data-offense={totalOffense}
        data-defense={totalDefense}
      >
        <div className="flex items-center gap-3">
          <Image
            src={teamById[teamId].logo_path}
            alt={teamById[teamId].name}
            width={24}
            height={24}
          />
          <span className="text-sm">{teamById[teamId].name}</span>
        </div>
      </td>

      {gameweeks.map((gameweek) => (
        <TableCell
          key={gameweek}
          teamId={teamId}
          gameweek={gameweek}
          sortBy={sortBy}
          season={season}
        />
      ))}
    </tr>
  );
}
