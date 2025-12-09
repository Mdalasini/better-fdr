import {
  type Fixture,
  FixturesArraySchema,
  type FixturesResponse,
} from "../types/fixtures";

const FPL_BOOTSTRAP_URL = "https://fantasy.premierleague.com/api/fixtures/";

function calculateCurrentGameweek(fixtures: Fixture[]): number {
  const now = new Date();

  // Find the first fixture that hasn't finished and has a kickoff time in the future
  const nextFixture = fixtures
    .filter(
      (fixture) => !fixture.finished && new Date(fixture.kickoff_time) > now,
    )
    .sort(
      (a, b) =>
        new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime(),
    )[0];

  if (nextFixture) {
    return nextFixture.event;
  }

  // If no future fixture found, return the highest event number (last gameweek)
  const maxEvent = Math.max(...fixtures.map((f) => f.event));
  return maxEvent;
}

export async function getFixtures(): Promise<FixturesResponse> {
  try {
    const response = await fetch(FPL_BOOTSTRAP_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FPL-App/1.0)",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(
        `FPL API returned ${response.status}: ${response.statusText}`,
      );
    }
    const data = await response.json();

    const fixtures = FixturesArraySchema.parse(data);
    const currentGameweek = calculateCurrentGameweek(fixtures);

    return {
      fixtures,
      currentGameweek,
    };
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return {
      fixtures: [],
      currentGameweek: 1, // Default fallback
    };
  }
}
