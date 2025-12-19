import { type NextRequest, NextResponse } from "next/server";
import { updateTeamRankings } from "@/lib/services/TeamService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid input: expected an array of team rankings" },
        { status: 400 },
      );
    }

    const result = await updateTeamRankings(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Faield to update team rankings",
      },
      { status: 500 },
    );
  }
}
