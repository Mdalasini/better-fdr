export interface TeamData {
  team_id: string;
  name: string;
  short_name: string;
  off_rating: number;
  def_rating: number;
  logo_path: string;
}

export type TeamsResponse = TeamData[];
