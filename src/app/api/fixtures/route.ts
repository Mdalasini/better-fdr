import { NextResponse } from "next/server";
import Game from "@/lib/domain/Game";
import dbConnect from "@/lib/infra/mongoose";
import type { FixturesResponse } from "@/lib/types/fixtures";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const season = searchParams.get("season");

  if (!season) {
    return NextResponse.json(
      { error: "Season is a required parameter" },
      { status: 400 },
    );
  }

  await dbConnect();

  const games = await Game.find({ season });

  const fixtures: FixturesResponse = {};

  games.forEach((game) => {
    if (!fixtures[game.home_id]) {
      fixtures[game.home_id] = [];
    }
    if (fixtures[game.home_id]) {
      fixtures[game.home_id].push({
        opponent_id: game.away_id,
        gameweek: game.gameweek,
        home: true,
      });
    }

    if (!fixtures[game.away_id]) {
      fixtures[game.away_id] = [];
    }
    if (fixtures[game.away_id]) {
      fixtures[game.away_id].push({
        opponent_id: game.home_id,
        gameweek: game.gameweek,
        home: false,
      });
    }
  });

  return NextResponse.json(fixtures);
}
