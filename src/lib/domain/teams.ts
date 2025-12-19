import { z } from "zod";

export const TeamSchema = z.object({
  code: z.number(),
  id: z.number(),
  name: z.string(),
  short_name: z.string(),
  off_rank: z.number(),
  def_rank: z.number(),
});

export const TeamRankingsSchema = z.object({
  team_id: z.number().min(1).max(20),
  off_rank: z.number().min(1).max(20),
  def_rank: z.number().min(1).max(20),
});

export type TeamRankings = z.infer<typeof TeamRankingsSchema>;
export type Team = z.infer<typeof TeamSchema>;
