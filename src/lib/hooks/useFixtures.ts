import { useQuery } from "@tanstack/react-query";
import type { FixturesResponse } from "../types/fixtures";

export function useFixtures(season: string) {
  return useQuery({
    queryKey: ["fixtures", season],
    queryFn: async () => {
      const res = await fetch(`/api/fixtures?season=${season}`);
      if (!res.ok) throw new Error("Failed to fetch fixtures");
      return res.json() as Promise<FixturesResponse>;
    },
    enabled: !!season,
  });
}
