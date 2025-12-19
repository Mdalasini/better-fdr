import type { Fixture } from "../domain/fixtures";

/**
 * Get the current gameweek based on fixture kickoff times
 * Returns the first event where at least one fixture hasn't kicked off yet
 */
export function getCurrentGameweek(fixtures: Fixture[]): number {
  const now = new Date();

  // Group fixtures by event
  const eventFixtures = new Map<number, Fixture[]>();
  for (const fixture of fixtures) {
    const existing = eventFixtures.get(fixture.event) || [];
    existing.push(fixture);
    eventFixtures.set(fixture.event, existing);
  }

  // Find the first event where not all fixtures have kicked off
  const events = Array.from(eventFixtures.keys()).sort((a, b) => a - b);

  for (const event of events) {
    const eventFixtureList = eventFixtures.get(event) || [];
    const hasUpcoming = eventFixtureList.some(
      (f) => new Date(f.kickoff_time) > now,
    );
    if (hasUpcoming) {
      return event;
    }
  }

  // If all fixtures have kicked off, return the last event
  return events[events.length - 1] || 1;
}

/**
 * Get the maximum event number from fixtures
 */
export function getMaxGameweek(fixtures: Fixture[]): number {
  if (fixtures.length === 0) return 38;
  return Math.max(...fixtures.map((f) => f.event));
}

/**
 * Get array of visible gameweeks starting from current
 */
export function getVisibleGameweeks(
  startGameweek: number,
  count: number,
  maxGameweek: number,
): number[] {
  const gameweeks: number[] = [];
  for (let i = 0; i < count; i++) {
    const gw = startGameweek + i;
    if (gw <= maxGameweek) {
      gameweeks.push(gw);
    }
  }
  return gameweeks;
}
