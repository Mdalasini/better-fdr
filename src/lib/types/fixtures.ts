export interface Fixture {
  opponent_id: string;
  gameweek: number;
  home: boolean;
}

export type FixturesResponse = Record<string, Fixture[]>;
