import { z } from "zod";

// Schema for chips array
export const ChipSchema = z.object({
  id: z.number(),
  name: z.string(),
  number: z.number(),
  start_event: z.number(),
  stop_event: z.number(),
  chip_type: z.string(),
});

// Schema for teams array (from FPL API)
export const FPLTeamSchema = z.object({
  code: z.number(),
  id: z.number(),
  name: z.string(),
  short_name: z.string(),
});

// Schema for enriched teams (FPL data + ELO ratings)
export const EnrichedTeamSchema = FPLTeamSchema.extend({
  off_rating: z.number(),
  def_rating: z.number(),
});

// Schema for element_stats array
export const ElementStatSchema = z.object({
  label: z.string(),
  name: z.string(),
});

// Schema for element_types array
export const ElementTypeSchema = z.object({
  id: z.number(),
  plural_name: z.string(),
  plural_name_short: z.string(),
  singular_name: z.string(),
  singular_name_short: z.string(),
  squad_select: z.number(),
  squad_min_play: z.number(),
  squad_max_play: z.number(),
});

// Schema for elements array
export const ElementSchema = z.object({
  can_transact: z.boolean(),
  can_select: z.boolean(),
  code: z.number(),
  element_type: z.number(),
  first_name: z.string(),
  id: z.number(),
  news: z.string(),
  news_added: z.string().nullable(),
  now_cost: z.number().transform((value) => value / 10),
  points_per_game: z
    .number()
    .or(z.string().transform((value) => parseFloat(value))),
  removed: z.boolean(),
  second_name: z.string(),
  selected_by_percent: z
    .number()
    .or(z.string().transform((value) => parseFloat(value))),
  status: z.string(),
  team: z.number(),
  team_code: z.number(),
  total_points: z.number(),
  web_name: z.string(),
});

// Schema for the complete bootstrap-static response
export const GameSetupSchema = z.object({
  chips: z.array(ChipSchema),
  teams: z.array(FPLTeamSchema),
  element_stats: z.array(ElementStatSchema),
  element_types: z.array(ElementTypeSchema),
  elements: z.array(ElementSchema),
});

// Schema for the enriched response (with ELO ratings)
export const EnrichedGameSetupSchema = z.object({
  chips: z.array(ChipSchema),
  teams: z.array(EnrichedTeamSchema),
  element_stats: z.array(ElementStatSchema),
  element_types: z.array(ElementTypeSchema),
  elements: z.array(ElementSchema),
});

// Types derived from schemas
export type Chip = z.infer<typeof ChipSchema>;
export type FPLTeam = z.infer<typeof FPLTeamSchema>;
export type EnrichedTeam = z.infer<typeof EnrichedTeamSchema>;
export type ElementStat = z.infer<typeof ElementStatSchema>;
export type ElementType = z.infer<typeof ElementTypeSchema>;
export type Element = z.infer<typeof ElementSchema>;
export type GameSetup = z.infer<typeof GameSetupSchema>;
export type EnrichedGameSetup = z.infer<typeof EnrichedGameSetupSchema>;
