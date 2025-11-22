import { NextResponse } from "next/server";
import { getTeams } from "@/lib/services/TeamService";

export async function GET() {
  const teams = await getTeams();

  return NextResponse.json(teams);
}
