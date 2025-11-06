export interface GameweekUpdateRequest {
  home_id: string;
  away_id: string;
  gameweek: number;
}

export interface GameweekUpdateResponse {
  success?: boolean;
  error?: string;
}
