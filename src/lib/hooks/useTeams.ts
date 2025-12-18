import { useQuery } from "@tanstack/react-query";
import type { Fixture } from "../domain/fixtures";

export function useFixtures() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const res = await fetch(
        `https://api-better-fdr.vercel.app/api/setup/teams`,
      );
      if (!res.ok) throw new Error("Failed to fetch teams");
      return res.json() as Promise<Fixture[]>;
    },
    enabled: true,
  });
}
