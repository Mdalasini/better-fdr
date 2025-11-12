export interface Fixture {
  home_id: string;
  away_id: string;
  gameweek: number;
  season: string;
  home_xg: string | null;
  away_xg: string | null;
}

export type FixturesResponse = Fixture[];
