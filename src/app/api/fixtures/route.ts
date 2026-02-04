import { type NextRequest, NextResponse } from "next/server";
import { getFixtures, syncFixtures } from "@/lib/services/FixtureService";

export async function GET() {
  try {
    const fixtures = await getFixtures();
    return NextResponse.json(fixtures);
  } catch (error) {
    console.error("Error in fixtures API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch fixtures" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const result = await syncFixtures();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error syncing fixtures:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message.includes("FPL API")
            ? "Update failed because FPL API is down"
            : "Failed to update fixtures",
      },
      { status: 500 },
    );
  }
}
