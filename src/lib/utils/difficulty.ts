import type { Team } from "../domain/teams";

export type DifficultyMode = "offense" | "defense";
export type DifficultyLevel = "easy" | "medium" | "hard" | "invalid";

const TOTAL_TEAMS = 20;

/**
 * Calculate team strength from rank
 * Higher rank = weaker team, so we invert it
 * Formula: (N - rank + 1) / N
 */
export function calculateTeamStrength(rank: number): number {
  return (TOTAL_TEAMS - rank + 1) / TOTAL_TEAMS;
}

/**
 * Calculate offensive difficulty for a team against an opponent
 * Lower = easier, Higher = harder
 * Formula: opponent's defensive strength - team's offensive strength
 */
export function calculateOffensiveDifficulty(
  team: Team,
  opponent: Team,
): number {
  const teamOffStrength = calculateTeamStrength(team.off_rank);
  const opponentDefStrength = calculateTeamStrength(opponent.def_rank);
  return (opponentDefStrength - teamOffStrength + 1) / 2;
}

/**
 * Calculate defensive difficulty for a team against an opponent
 * Lower = easier, Higher = harder
 * Formula: opponent's offensive strength - team's defensive strength
 */
export function calculateDefensiveDifficulty(
  team: Team,
  opponent: Team,
): number {
  const teamDefStrength = calculateTeamStrength(team.def_rank);
  const opponentOffStrength = calculateTeamStrength(opponent.off_rank);
  return (opponentOffStrength - teamDefStrength + 1) / 2;
}

/**
 * Calculate difficulty for a fixture based on mode
 */
export function calculateFixtureDifficulty(
  team: Team,
  opponent: Team,
  mode: DifficultyMode,
): number {
  if (mode === "offense") {
    return calculateOffensiveDifficulty(team, opponent);
  }
  return calculateDefensiveDifficulty(team, opponent);
}

/**
 * Calculate combined difficulty for multiple fixtures in one gameweek
 * Formula: easiest_difficulty / number_of_fixtures
 */
export function calculateMultiFixtureDifficulty(
  difficulties: number[],
): number {
  if (difficulties.length === 0) return 1; // Blank gameweek = hardest
  if (difficulties.length === 1) return difficulties[0];

  const easiest = Math.min(...difficulties);
  return easiest / difficulties.length;
}

/**
 * Get difficulty level based on numeric value
 * >= 0.62: hard
 * <= 0.38: easy
 * between: medium
 * 1.0: invalid (blank gameweek)
 */
export function getDifficultyLevel(difficulty: number): DifficultyLevel {
  if (difficulty === 1) return "invalid";
  if (difficulty >= 0.62) return "hard";
  if (difficulty <= 0.38) return "easy";
  return "medium";
}

/**
 * Get Tailwind background color class for difficulty level
 */
export function getDifficultyColor(level: DifficultyLevel): string {
  switch (level) {
    case "easy":
      return "bg-emerald-100";
    case "medium":
      return "bg-slate-100";
    case "hard":
      return "bg-rose-100";
    case "invalid":
      return "bg-slate-50";
  }
}
