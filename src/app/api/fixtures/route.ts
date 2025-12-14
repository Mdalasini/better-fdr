import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { getFixtures } from "@/lib/services/FixtureService";

const getCachedFixtures = unstable_cache(
  async () => getFixtures(),
  ["fixtures"],
  {
    tags: ["fixtures"],
    revalidate: 86400, // revalidation after 24 hours
  },
);

export async function GET() {
  try {
    const fixturesResponse = await getCachedFixtures();
    return NextResponse.json(fixturesResponse);
  } catch (error) {
    console.error("Error in fixtures API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures" },
      { status: 500 },
    );
  }
}
