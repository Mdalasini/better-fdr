import { z } from "zod";

export const TeamSchema = z.object({
  code: z.number(),
  id: z.number(),
  name: z.string(),
  short_name: z.string(),
  off_rank: z.number(),
  def_rank: z.number(),
});

export type Team = z.infer<typeof TeamSchema>;
