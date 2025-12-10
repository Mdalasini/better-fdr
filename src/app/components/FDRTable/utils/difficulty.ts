import type { Fixture } from "@/lib/types/fixtures";
import type { Opponent, Difficulty, DifficultyScore } from "../types";
import type { EnrichedTeam } from "@/lib/types/gameSetup";

/**
 * Squash function: sigmoid-like transformation centered around league mean
 */
function squash(x: number, leagueMean: number, k = 0.01): number {
  return 1 / (1 + Math.exp(-k * (x - leagueMean)));
}

/**
 * Combine weighted scores using the complement product formula
 * Formula: 1 - ∏(1 - p_i)
 */
function combineWeighted(scores: number[]): number {
  if (scores.length === 0) return 0;
  return 1 - scores.reduce((acc, score) => acc * (1 - score), 1);
}

/**
 * Calculate difficulty rating from a score
 */
function getDifficultyRating(score: number): Difficulty {
  if (score === 0) return "invalid";
  if (score > 0.66) return "easy";
  if (score > 0.33) return "medium";
  return "hard";
}

/**
 * Calculate difficulty based on percentile ranking
 * Top 66 percentile = easy, bottom 33 percentile = hard
 * Higher scores are better (easier fixtures)
 */
export function getDifficultyFromPercentile(
  score: number,
  allScores: number[],
): Difficulty {
  if (score === 0 || allScores.length === 0) return "invalid";

  // Filter out invalid scores (0)
  const validScores = allScores.filter((s) => s > 0);
  if (validScores.length === 0) return "invalid";

  // Count how many scores are less than the current score
  const countBelow = validScores.filter((s) => s < score).length;
  const percentile = (countBelow / validScores.length) * 100;

  // Top 66 percentile = easy (score is better than 66% of others)
  // Bottom 33 percentile = hard (score is worse than 67% of others)
  if (percentile >= 66) return "easy";
  if (percentile <= 33) return "hard";
  return "medium";
}

/**
 * Get opponents for a team in a specific gameweek
 */
export function getOpponentsForGameweek(
  teamId: number,
  gameweek: number,
  fixtures: Fixture[],
): Opponent[] {
  return fixtures
    .filter((fixture) => fixture.event === gameweek)
    .map((fixture) => {
      if (fixture.team_h === teamId) return { id: fixture.team_a, home: true };
      if (fixture.team_a === teamId) return { id: fixture.team_h, home: false };
      return null;
    })
    .filter((opponent): opponent is Opponent => opponent !== null);
}

/**
 * Get opponents for a team in a range of gameweeks
 */
export function getOpponentsForRange(
  teamId: number,
  startWeek: number,
  endWeek: number,
  fixtures: Fixture[],
): Opponent[] {
  return fixtures
    .filter((fixture) => fixture.event >= startWeek && fixture.event <= endWeek)
    .map((fixture) => {
      if (fixture.team_h === teamId) return { id: fixture.team_a, home: true };
      if (fixture.team_a === teamId) return { id: fixture.team_h, home: false };
      return null;
    })
    .filter((opponent): opponent is Opponent => opponent !== null);
}

/**
 * Calculate attack difficulty for a team against opponents
 */
export function calculateAttackDifficulty(
  offenseRating: number,
  opponents: Opponent[],
  teamById: Record<number, EnrichedTeam>,
  leagueMean: number,
  k = 0.01,
): DifficultyScore {
  if (opponents.length === 0) {
    return { score: 0, difficulty: "invalid", opponents: [] };
  }

  const scores = opponents.map((opponent) =>
    squash(offenseRating - teamById[opponent.id].def_rating, leagueMean, k),
  );
  const score = combineWeighted(scores);
  const difficulty = getDifficultyRating(score);

  return { score, difficulty, opponents };
}

/**
 * Calculate defense difficulty for a team against opponents
 */
export function calculateDefenseDifficulty(
  defenseRating: number,
  opponents: Opponent[],
  teamById: Record<number, EnrichedTeam>,
  leagueMean: number,
  k = 0.01,
): DifficultyScore {
  if (opponents.length === 0) {
    return { score: 0, difficulty: "invalid", opponents: [] };
  }

  const scores = opponents.map((opponent) =>
    squash(defenseRating - teamById[opponent.id].off_rating, leagueMean, k),
  );
  const score = combineWeighted(scores);
  const difficulty = getDifficultyRating(score);

  return { score, difficulty, opponents };
}

/**
 * Calculate league mean from all teams
 */
export function calculateLeagueMean(teams: EnrichedTeam[]): number {
  if (teams.length === 0) return 0;

  const allScores = teams.map((t) => t.off_rating - t.def_rating);
  const sum = allScores.reduce((acc, score) => acc + score, 0);
  return sum / allScores.length;
}

/**
 * Create a team lookup object by ID
 */
export function createTeamLookup(
  teams: EnrichedTeam[],
): Record<number, EnrichedTeam> {
  const lookup: Record<number, EnrichedTeam> = {};
  teams.forEach((team) => {
    lookup[team.id] = team;
  });
  return lookup;
}
