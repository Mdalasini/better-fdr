import type { Fixture, FixturesResponse } from "@/lib/types/fixtures";
import type { TeamData } from "@/lib/types/teams";

let LEAGUE_MEAN = 0;

export function initDifficultyModel(allTeams: TeamData[]): void {
  if (allTeams.length === 0) {
    return;
  }

  const allScores = allTeams.map((t) => t.off_rating + t.def_rating);
  const sum = allScores.reduce((acc, score) => acc + score, 0);
  const mean = sum / allScores.length;
  LEAGUE_MEAN = mean;
}

export function fixtureForTeamInWeek(
  src: FixturesResponse,
  teamId: string,
  gameweek: number,
): Fixture[] {
  return (src[teamId] || []).filter((f) => f.gameweek === gameweek);
}

function squash(x: number, k = 0.01): number {
  return 1 / (1 + Math.exp(-k * (x - LEAGUE_MEAN)));
}

function combineWeightedOffense(scores: number[]): number {
  if (scores.length === 0) return 0;
  return 1 - scores.reduce((acc, score) => acc * (1 - score), 1);
}

function combineWeightedDefense(scores: number[]): number {
  if (scores.length === 0) return 0;
  return 1 - scores.reduce((acc, score) => acc * score, 1);
}

export function getAttack(
  offenseA: number,
  fixtures: Fixture[],
  teamById: Record<string, TeamData>,
  k = 0.01,
): { gw_attack: number; difficulty: "easy" | "medium" | "hard" | "invalid" } {
  if (fixtures.length === 0) return { gw_attack: 0, difficulty: "invalid" };

  const scores = fixtures.map((f) =>
    squash(offenseA + teamById[f.opponent_id].def_rating, k),
  );
  const gw_attack = combineWeightedOffense(scores);

  const difficulty =
    gw_attack > 0.66 ? "easy" : gw_attack > 0.33 ? "medium" : "hard";

  return { gw_attack, difficulty };
}

export function getDefense(
  defenseA: number,
  fixtures: Fixture[],
  teamById: Record<string, TeamData>,
  k = 0.01,
): {
  gw_defense: number;
  difficulty: "easy" | "medium" | "hard" | "invalid";
} {
  if (fixtures.length === 0) return { gw_defense: 0, difficulty: "invalid" };

  const scores = fixtures.map((f) =>
    squash(defenseA + teamById[f.opponent_id].off_rating, k),
  );
  const gw_defense = combineWeightedDefense(scores);

  const difficulty =
    gw_defense > 0.66 ? "easy" : gw_defense > 0.33 ? "medium" : "hard";

  return { gw_defense, difficulty };
}
