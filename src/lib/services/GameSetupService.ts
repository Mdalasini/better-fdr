import dbConnect from "../infra/libsql";
import {
  type EnrichedGameSetup,
  EnrichedGameSetupSchema,
  type EnrichedTeam,
  type FPLTeam,
  GameSetupSchema,
} from "../types/gameSetup";

const FPL_BOOTSTRAP_URL =
  "https://fantasy.premierleague.com/api/bootstrap-static/";

/**
 * Fetches game setup data from FPL API and enriches it with team ELO ratings
 */
export async function getGameSetup(): Promise<EnrichedGameSetup> {
  try {
    // Fetch data from FPL API
    const response = await fetch(FPL_BOOTSTRAP_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FPL-App/1.0)",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(
        `FPL API returned ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Validate the response
    const gameSetup = GameSetupSchema.parse(data);

    // Get ELO data from database
    const eloData = await getTeamEloData();

    // Enrich teams with ELO ratings
    const enrichedTeams = enrichTeamsWithElo(gameSetup.teams, eloData);

    // Return enriched game setup
    const enrichedGameSetup: EnrichedGameSetup = {
      ...gameSetup,
      teams: enrichedTeams,
    };

    return EnrichedGameSetupSchema.parse(enrichedGameSetup);
  } catch (error) {
    console.error("Error fetching game setup:", error);
    throw error;
  }
}

/**
 * Fetches team ELO data from the database
 */
async function getTeamEloData(): Promise<
  Map<number, { off_rating: number; def_rating: number }>
> {
  const db = await dbConnect();
  const result = await db.execute(
    `
    SELECT
      team_id,
      1700 - ((off_rank - 1) * 400 / 19) AS off_rating,
      1700 - ((def_rank - 1) * 400 / 19) AS def_rating
    FROM team_rankings
    `,
  );

  const eloMap = new Map<number, { off_rating: number; def_rating: number }>();

  for (const row of result.rows) {
    eloMap.set(row.team_id as number, {
      off_rating: (row.off_rating as number) || 0,
      def_rating: (row.def_rating as number) || 0,
    });
  }

  return eloMap;
}

/**
 * Enriches FPL teams with ELO ratings from the database
 */
function enrichTeamsWithElo(
  fplTeams: FPLTeam[],
  eloData: Map<number, { off_rating: number; def_rating: number }>,
): EnrichedTeam[] {
  return fplTeams.map((team) => {
    const elo = eloData.get(team.id);

    return {
      ...team,
      off_rating: elo?.off_rating || 0,
      def_rating: elo?.def_rating || 0,
    };
  });
}
