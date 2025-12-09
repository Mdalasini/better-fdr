import { type Fixture, FixturesArraySchema } from "../types/fixtures";

const FPL_BOOTSTRAP_URL = "https://fantasy.premierleague.com/api/fixtures/";

export async function getFixtures(): Promise<Fixture[]> {
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
    return fixtures;
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return [];
  }
}
