import { NextResponse } from "next/server";
import { getTeams } from "@/lib/services/TeamService";

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
