import type { Fixture } from "../domain/fixtures";
import type { Team } from "../domain/teams";
import {
  calculateFixtureDifficulty,
  calculateMultiFixtureDifficulty,
  type DifficultyMode,
  getDifficultyColor,
  getDifficultyLevel,
} from "./difficulty";

export interface FixtureDisplay {
  fixture: Fixture;
  opponent: Team;
  isHome: boolean;
  difficulty: number;
}

export interface EventData {
  event: number;
  fixtures: FixtureDisplay[];
  combinedDifficulty: number;
  difficultyLevel: ReturnType<typeof getDifficultyLevel>;
  color: string;
}

export interface TeamRowData {
  team: Team;
  events: Map<number, EventData>;
}

/**
 * Group fixtures by event number
 */
export function groupFixturesByEvent(
  fixtures: Fixture[],
): Map<number, Fixture[]> {
  const grouped = new Map<number, Fixture[]>();
  for (const fixture of fixtures) {
    const existing = grouped.get(fixture.event) || [];
    existing.push(fixture);
    grouped.set(fixture.event, existing);
  }
  return grouped;
}

/**
 * Get all fixtures for a specific team in a specific event
 */
export function getTeamFixturesForEvent(
  teamId: number,
  event: number,
  fixtures: Fixture[],
): Fixture[] {
  return fixtures.filter(
    (f) => f.event === event && (f.team_h === teamId || f.team_a === teamId),
  );
}

/**
 * Process all fixtures for a team across all events
 */
export function processTeamFixtures(
  team: Team,
  fixtures: Fixture[],
  teamsMap: Map<number, Team>,
  mode: DifficultyMode,
  events: number[],
): TeamRowData {
  const eventDataMap = new Map<number, EventData>();

  for (const event of events) {
    const teamFixtures = getTeamFixturesForEvent(team.id, event, fixtures);

    if (teamFixtures.length === 0) {
      // Blank gameweek
      eventDataMap.set(event, {
        event,
        fixtures: [],
        combinedDifficulty: 1,
        difficultyLevel: "invalid",
        color: getDifficultyColor("invalid"),
      });
      continue;
    }

    const fixtureDisplays: FixtureDisplay[] = [];
    const difficulties: number[] = [];

    for (const fixture of teamFixtures) {
      const isHome = fixture.team_h === team.id;
      const opponentId = isHome ? fixture.team_a : fixture.team_h;
      const opponent = teamsMap.get(opponentId);

      if (!opponent) continue;

      const difficulty = calculateFixtureDifficulty(team, opponent, mode);
      difficulties.push(difficulty);

      fixtureDisplays.push({
        fixture,
        opponent,
        isHome,
        difficulty,
      });
    }

    const combinedDifficulty = calculateMultiFixtureDifficulty(difficulties);
    const difficultyLevel = getDifficultyLevel(combinedDifficulty);

    eventDataMap.set(event, {
      event,
      fixtures: fixtureDisplays,
      combinedDifficulty,
      difficultyLevel,
      color: getDifficultyColor(difficultyLevel),
    });
  }

  return {
    team,
    events: eventDataMap,
  };
}

/**
 * Process all teams and their fixtures
 */
export function processAllTeams(
  teams: Team[],
  fixtures: Fixture[],
  mode: DifficultyMode,
  events: number[],
): TeamRowData[] {
  const teamsMap = new Map<number, Team>();
  for (const team of teams) {
    teamsMap.set(team.id, team);
  }

  return teams.map((team) =>
    processTeamFixtures(team, fixtures, teamsMap, mode, events),
  );
}

export type SortType =
  | { type: "none" }
  | { type: "event"; event: number }
  | { type: "next5"; startEvent: number };

/**
 * Calculate sum of difficulties for next N gameweeks
 */
function calculateNext5Difficulty(
  row: TeamRowData,
  startEvent: number,
): number {
  let sum = 0;
  for (let i = 0; i < 5; i++) {
    const eventData = row.events.get(startEvent + i);
    sum += eventData?.combinedDifficulty ?? 1;
  }
  return sum;
}

/**
 * Sort team rows by difficulty for a specific event or next 5 gameweeks
 */
export function sortTeamRows(
  rows: TeamRowData[],
  sortType: SortType,
  sortDirection: "asc" | "desc",
): TeamRowData[] {
  // Always start with alphabetical sort
  const sorted = [...rows].sort((a, b) =>
    a.team.name.localeCompare(b.team.name),
  );

  if (sortType.type === "none") {
    return sorted;
  }

  if (sortType.type === "event") {
    return sorted.sort((a, b) => {
      const aData = a.events.get(sortType.event);
      const bData = b.events.get(sortType.event);
      const aDifficulty = aData?.combinedDifficulty ?? 1;
      const bDifficulty = bData?.combinedDifficulty ?? 1;

      if (sortDirection === "asc") {
        return aDifficulty - bDifficulty;
      }
      return bDifficulty - aDifficulty;
    });
  }

  // Sort by next 5 gameweeks
  return sorted.sort((a, b) => {
    const aDifficulty = calculateNext5Difficulty(a, sortType.startEvent);
    const bDifficulty = calculateNext5Difficulty(b, sortType.startEvent);

    if (sortDirection === "asc") {
      return aDifficulty - bDifficulty;
    }
    return bDifficulty - aDifficulty;
  });
}
