import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { getGameSetup } from "@/lib/services/GameSetupService";

const getCachedGameSetup = unstable_cache(
  async () => getGameSetup(),
  ["setup"],
  {
    tags: ["setup"],
    revalidate: false, // Manual revalidation only
  },
);

export async function GET() {
  try {
    const setup = await getCachedGameSetup();
    return NextResponse.json(setup);
  } catch (error) {
    console.error("Error in setup API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch game setup" },
      { status: 500 },
    );
  }
}
