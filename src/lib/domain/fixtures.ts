import { z } from "zod";

export const FixtureSchema = z.object({
  code: z.number(),
  id: z.number(),
  event: z.number(),
  finished: z.boolean(),
  team_h: z.number(),
  team_a: z.number(),
  kickoff_time: z.string().pipe(z.coerce.date()),
});

export type Fixture = z.infer<typeof FixtureSchema>;
