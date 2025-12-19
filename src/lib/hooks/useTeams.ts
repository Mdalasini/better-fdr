import { useQuery } from "@tanstack/react-query";
import type { Team } from "../domain/teams";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json() as Promise<Team[]>;
    },
    enabled: true,
  });
}
