import z from "zod";
import { type Fixture, FixtureSchema } from "../domain/fixtures";
import dbConnect from "../infra/libsql";

const FixtureInputSchema = z.object({
  id: z.number(),
  code: z.number(),
  event: z.number(),
  finished: z.boolean().or(z.number()),
  team_h: z.number(),
  team_a: z.number(),
  kickoff_time: z.string(),
});

export async function getFixtures(): Promise<Fixture[]> {
  const db = await dbConnect();
  const result = await db.execute({
    sql: "SELECT * FROM fixtures",
  });
  return FixtureSchema.array().parse(result.rows);
}

async function ensureFixturesTableExists() {
  const db = await dbConnect();

  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS fixtures (
        id INTEGER PRIMARY KEY,
        code INTEGER NOT NULL,
        event INTEGER NOT NULL,
        finished INTEGER NOT NULL,
        team_h INTEGER NOT NULL,
        team_a INTEGER NOT NULL,
        kickoff_time TEXT NOT NULL
      )
    `);
  } catch (error) {
    console.error("Error ensuring fixtures table exists:", error);
    throw new Error(
      `Failed to ensure fixtures table exists: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function fetchExternalFixtures(): Promise<unknown[]> {
  const fplApiUrl = "https://fantasy.premierleague.com/api/fixtures/";

  try {
    console.log("Fetching fixtures from FPL API...");
    const response = await fetch(fplApiUrl, {
      headers: {
        // FPL API may require a user-agent header
        "User-Agent": "Mozilla/5.0 (compatible; better-fdr/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`FPL API returned status ${response.status}`);
    }

    const fixtures = await response.json();

    if (!Array.isArray(fixtures)) {
      throw new Error("FPL API did not return an array of fixtures");
    }

    console.log(
      `Successfully fetched ${fixtures.length} fixtures from FPL API`,
    );
    return fixtures;
  } catch (error) {
    console.error("Error fetching fixtures from FPL API:", error);
    throw new Error(
      `Failed to fetch fixtures from FPL API: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export async function syncFixtures(): Promise<{
  success: true;
  message: "Fixtures synced successfully";
}> {
  const externalFixtures = await fetchExternalFixtures();
  await updateFixtures(externalFixtures);
  return { success: true, message: "Fixtures synced successfully" };
}

function parseFixtures(fixtures: Array<unknown>) {
  try {
    return FixtureInputSchema.array().parse(fixtures);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorDetails = error.issues
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      throw new Error(`Invalid fixtures data: ${errorDetails}`);
    }
    throw new Error(
      `Invalid fixtures data: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

function validateFixtures(fixtures: Array<unknown>) {
  if (fixtures.length !== 380) {
    throw new Error(`Expected 380 fixtures, but received ${fixtures.length}`);
  }

  const fixturesParsed = parseFixtures(fixtures);

  const fixtureIds = fixturesParsed.map((fixture) => fixture.id);
  const uniqueFixtureIds = new Set(fixtureIds);

  if (uniqueFixtureIds.size !== 380) {
    throw new Error("Duplicate fixture ids found in input");
  }
}

export async function updateFixtures(fixtures: Array<unknown>) {
  const db = await dbConnect();

  try {
    await ensureFixturesTableExists();
    validateFixtures(fixtures);

    const fixturesParsed = parseFixtures(fixtures);

    // Delete all existing fixtures
    await db.execute("DELETE FROM fixtures");

    // Insert new fixtures
    const statements = fixturesParsed.map((fixture) => ({
      sql: `
        INSERT INTO fixtures (id, code, event, finished, team_h, team_a, kickoff_time)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        fixture.id,
        fixture.code,
        fixture.event,
        typeof fixture.finished === "boolean"
          ? fixture.finished
            ? 1
            : 0
          : fixture.finished,
        fixture.team_h,
        fixture.team_a,
        fixture.kickoff_time,
      ],
    }));

    await db.batch(statements);

    return { success: true, message: "Fixtures updated successfully" };
  } catch (error) {
    console.error("Error updating fixtures:", error);
    throw new Error(
      `Failed to update fixtures: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
