import { type NextRequest, NextResponse } from "next/server";
import { updateTeamRankings } from "@/lib/services/TeamService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate that we received an array
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Request body must be an array of team rankings" },
        { status: 400 },
      );
    }

    // Call the service to update rankings
    const result = await updateTeamRankings(body);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update team rankings",
      },
      { status: 500 },
    );
  }
}
