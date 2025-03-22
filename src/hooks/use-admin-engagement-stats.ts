import { useQuery } from "@tanstack/react-query";
import { type EngagementStats } from "~/types/dashboard";

async function fetchEngagementStats(): Promise<EngagementStats> {
  const response = await fetch("/api/admin/stats/engagement");
  if (!response.ok) {
    throw new Error("Failed to fetch engagement stats");
  }
  return await response.json() as EngagementStats;
}

export function useAdminEngagementStats() {
  return useQuery<EngagementStats>({
    queryKey: ["admin", "engagement"],
    queryFn: fetchEngagementStats,
  });
}