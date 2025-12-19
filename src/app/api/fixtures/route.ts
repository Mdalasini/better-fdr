import { type NextRequest, NextResponse } from "next/server";
import { getFixtures, updateFixtures } from "@/lib/services/FixtureService";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid input: expected an array of fixtures" },
        { status: 400 },
      );
    }

    const result = await updateFixtures(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update fixtures",
      },
      { status: 500 },
    );
  }
}
