import z from "zod";

export const TeamEloSchema = z.object({
  team_id: z.number().min(1).max(20),
  off_elo: z.number().min(1300).max(1700),
  def_elo: z.number().min(1300).max(1700),
});

export const TeamRankingsSchema = z.object({
  team_id: z.number().min(1).max(20),
  off_rank: z.number().min(1).max(20),
  def_rank: z.number().min(1).max(20),
});

export const TeamRankingsArraySchema = z.array(TeamRankingsSchema);

export type TeamRankings = z.infer<typeof TeamRankingsSchema>;
export type TeamElo = z.infer<typeof TeamEloSchema>;
