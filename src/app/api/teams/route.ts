import { type NextRequest, NextResponse } from "next/server";
import { getTeams, updateTeams } from "@/lib/services/TeamService";

export async function GET() {
  try {
    const teams = await getTeams();
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error in teams API route:", error);
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
        { error: "Invalid input: expected an array of teams" },
        { status: 400 },
      );
    }

    const result = await updateTeams(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update teams",
      },
      { status: 500 },
    );
  }
}
