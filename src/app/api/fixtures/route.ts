import { NextResponse } from "next/server";
import { getFixtures } from "@/lib/services/FixtureService";

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
