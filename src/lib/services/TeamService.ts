import dbConnect from "../infra/libsql";
import { type TeamData, TeamDataSchema } from "../types/teams";

export async function getTeams(): Promise<TeamData[]> {
  const db = await dbConnect();
  const result = await db.execute(
    `
    SELECT t.id, t.name, t.short_name, e.off_elo AS off_rating, e.def_elo AS def_rating
    FROM teams t
    LEFT JOIN team_elos e ON t.id = e.team_id
    GROUP BY t.id, t.name, t.short_name
  `,
  );
  return result.rows.map((row) => TeamDataSchema.parse(row));
}
