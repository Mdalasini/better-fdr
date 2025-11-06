export interface TeamData {
  team_id: string;
  name: string;
  short_name: string;
  off_rating: number | null;
  def_rating: number | null;
  logo_path: string | null;
}

export type TeamsResponse = TeamData[];
