import z from "zod";
import {
  type Team,
  type TeamRankings,
  TeamRankingsSchema,
  TeamSchema,
} from "../domain/teams";
import dbConnect from "../infra/libsql";

export async function getTeams(): Promise<Team[]> {
  const db = await dbConnect();
  const result = await db.execute(
    `
    SELECT
      id,
      code,
      name,
      short_name,
      off_rank,
      def_rank
    FROM teams
    JOIN team_rankings ON teams.id = team_rankings.team_id
    `,
  );

  return TeamSchema.array().parse(result.rows);
}

async function ensureTeamRankingsTableExists() {
  const db = await dbConnect();

  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS team_rankings (
        team_id INTEGER PRIMARY KEY,
        off_rank REAL NOT NULL,
        def_rank REAL NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `);
  } catch (error) {
    console.error("Error ensuring team_rankings table exists:", error);
    throw new Error(
      `Failed to ensure team_rankings table exists: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

function parseTeamRankings(teamRankings: Array<unknown>): TeamRankings[] {
  try {
    return TeamRankingsSchema.array().parse(teamRankings);
  } catch (error) {
    // !FIX: Improve the error handling here
    if (error instanceof z.ZodError) {
      const errorDetails = error.issues
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      throw new Error(`Invalid team rankings data: ${errorDetails}`);
    }
    throw new Error(
      `Invalid team rankings data: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

function inputsAreValid(teamRankings: Array<unknown>) {
  if (teamRankings.length !== 20) {
    throw new Error(`Expected 20 teams, but received ${teamRankings.length}`);
  }

  const teamRankingsParsed = parseTeamRankings(teamRankings);

  const teamIds = teamRankingsParsed.map((team) => team.team_id);
  const uniqueTeamIds = new Set(teamIds);

  if (uniqueTeamIds.size !== 20) {
    throw new Error("Duplicate team_ids found in input");
  }

  // Validate off_rank and def_rank values are unique across teams
  const offRankValues = teamRankingsParsed.map((team) => team.off_rank);
  const defRankValues = teamRankingsParsed.map((team) => team.def_rank);

  if (new Set(offRankValues).size !== 20) {
    throw new Error("Duplicate off_rank values found across teams");
  }

  if (new Set(defRankValues).size !== 20) {
    throw new Error("Duplicate def_rank values found across teams");
  }
}

export async function updateTeamRankings(teamRankings: TeamRankings[]) {
  const db = await dbConnect();

  try {
    // Ensure table exists before inserting data
    await ensureTeamRankingsTableExists();

    // Validate input data
    inputsAreValid(teamRankings);

    // Create batch statements for updating all 20 rankings
    const statements = teamRankings.map((team) => ({
      sql: `
        INSERT OR REPLACE INTO team_rankings (team_id, off_rank, def_rank, updated_at)
        VALUES (?, ?, ?, datetime('now'))
      `,
      args: [team.team_id, team.off_rank, team.def_rank],
    }));

    // Execute all updates in a single batch
    await db.batch(statements);

    return { success: true, message: "Team rankings updated successfully" };
  } catch (error) {
    console.error("Error updating team rankings:", error);
    throw new Error(
      `Failed to update team rankings: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
