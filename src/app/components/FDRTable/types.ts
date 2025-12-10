import type { Fixture } from "@/lib/types/fixtures";
import type { EnrichedTeam } from "@/lib/types/gameSetup";

export interface Opponent {
  id: number;
  home: boolean;
}

export type Difficulty = "easy" | "medium" | "hard" | "invalid";

export interface DifficultyScore {
  score: number;
  difficulty: Difficulty;
  opponents: Opponent[];
}

export interface GameweekScore {
  attack: DifficultyScore;
  defense: DifficultyScore;
}

export interface TeamGameweekData {
  [gameweek: number]: GameweekScore;
}

export interface DifficultyScores {
  byTeam: {
    [teamId: number]: TeamGameweekData;
  };
  byGameweek: {
    [gameweek: number]: {
      sortedByAttack: number[];
      sortedByDefense: number[];
    };
  };
}

export interface GameweekStats {
  min: number;
  max: number;
}

export type SortBy = "offense" | "defense";
export type SortDirection = "asc" | "desc";

/**
 * Mobile sorting mode options
 * - "current": Sort by the current gameweek
 * - "range": Sort by the selected gameweek range
 */
export type MobileSortMode = "current" | "range";

export interface FDRControls {
  tableWindow: [number, number];
  sortBy: SortBy;
  orderedTeamIds: number[] | null;
  gameweekRange: number;
}

export interface FDRDataContextValue {
  teams: EnrichedTeam[] | undefined;
  fixtures: Fixture[] | undefined;
  currentGameweek: number | undefined;
  difficultyScores: DifficultyScores | null;
  gameweekStats: GameweekStats;
  isLoading: boolean;
  isError: boolean;
  teamById: Record<number, EnrichedTeam>;
  leagueMean: number;
}
