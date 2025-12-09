import { useQuery } from "@tanstack/react-query";
import type { EnrichedGameSetup } from "../types/gameSetup";

export function useSetup() {
  return useQuery({
    queryKey: ["setup"],
    queryFn: async () => {
      const res = await fetch(`/api/setup`);
      if (!res.ok) throw new Error("Failed to fetch game setup");
      return res.json() as Promise<EnrichedGameSetup>;
    },
    enabled: true,
  });
}
