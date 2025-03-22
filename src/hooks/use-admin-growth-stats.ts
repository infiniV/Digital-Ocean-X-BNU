import { useQuery } from "@tanstack/react-query";
import { type GrowthStats } from "~/types/dashboard";

interface UseAdminGrowthStatsParams {
  period?: "day" | "week" | "month";
  limit?: number;
}

async function fetchGrowthStats({ 
  period = "month", 
  limit = 12 
}: UseAdminGrowthStatsParams): Promise<GrowthStats> {
  const response = await fetch(`/api/admin/stats/growth?period=${period}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch growth stats");
  }
  return await response.json() as GrowthStats;
}

export function useAdminGrowthStats(params: UseAdminGrowthStatsParams = {}) {
  return useQuery<GrowthStats>({
    queryKey: ["admin", "growth", params],
    queryFn: () => fetchGrowthStats(params),
  });
}