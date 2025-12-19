import { type Fixture, FixtureSchema } from "../domain/fixtures";
import dbConnect from "../infra/libsql";

export async function getFixtures(): Promise<Fixture[]> {
  const db = await dbConnect();
  const result = await db.execute({
    sql: "SELECT * FROM fixtures",
  });
  return FixtureSchema.array().parse(result.rows);
}
