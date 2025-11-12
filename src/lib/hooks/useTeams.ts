import { useQuery } from "@tanstack/react-query";
import type { TeamsResponse } from "../types/teams";

export function useTeams(season: string) {
  return useQuery({
    queryKey: ["teams", season],
    queryFn: async () => {
      const res = await fetch(`/api/teams?season=${season}`);
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json() as Promise<TeamsResponse>;
    },
    enabled: !!season,
  });
}
