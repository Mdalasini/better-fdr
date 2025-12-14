import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { getFixtures } from "@/lib/services/FixtureService";
import type { Fixture, FixturesResponse } from "@/lib/types/fixtures";

const getCachedFixtures = unstable_cache(
  async () => getFixtures(),
  ["fixtures-v2"],
  {
    tags: ["fixtures"],
    revalidate: 86400, // revalidation after 24 hours
  },
);

function calculateCurrentGameweek(fixtures: Fixture[]): number {
  // Handle empty fixtures array
  if (!fixtures || fixtures.length === 0) {
    return 1; // Default fallback
  }

  const now = new Date();

  // Find the smallest event number where no fixtures have kickoff time before current time
  const events = [...new Set(fixtures.map((f) => f.event))].sort(
    (a, b) => a - b,
  );

  for (const event of events) {
    const eventFixtures = fixtures.filter((f) => f.event === event);
    const hasPastFixture = eventFixtures.some(
      (f) => new Date(f.kickoff_time) < now,
    );

    if (!hasPastFixture) {
      return event;
    }
  }

  // If all events have fixtures before current time, return the highest event number
  const maxEvent = Math.max(...fixtures.map((f) => f.event));
  return maxEvent;
}

export async function GET() {
  try {
    const fixtures = await getCachedFixtures();

    // Ensure fixtures is an array
    if (!Array.isArray(fixtures)) {
      console.error("Cached fixtures is not an array:", fixtures);
      return NextResponse.json(
        { error: "Invalid fixtures data" },
        { status: 500 },
      );
    }

    const currentGameweek = calculateCurrentGameweek(fixtures);

    const fixturesResponse: FixturesResponse = {
      fixtures,
      currentGameweek,
    };

    return NextResponse.json(fixturesResponse);
  } catch (error) {
    console.error("Error in fixtures API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures" },
      { status: 500 },
    );
  }
}
