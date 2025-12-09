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

export const FixturesArraySchema = z.array(FixtureSchema);

export type Fixture = z.infer<typeof FixtureSchema>;
export type FixturesArray = z.infer<typeof FixturesArraySchema>;
