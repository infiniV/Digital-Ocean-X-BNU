import { useQuery } from "@tanstack/react-query";
import { type EngagementStats } from "~/types/dashboard";

async function fetchEngagementStats(): Promise<EngagementStats> {
  const response = await fetch("/api/admin/stats/engagement");
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Failed to fetch engagement stats: ${errorText}`);
  }

  const data = (await response.json()) as unknown;

  // Type guard function to validate EngagementStats shape
  function isEngagementStats(value: unknown): value is EngagementStats {
    return (
      typeof value === "object" &&
      value !== null &&
      "achievements" in value &&
      "activity" in value &&
      Array.isArray((value as Record<string, unknown>).achievements) &&
      typeof (value as Record<string, unknown>).activity === "object"
    );
  }

  if (!isEngagementStats(data)) {
    throw new Error("Invalid engagement stats data structure");
  }

  return data;
}

export function useAdminEngagementStats() {
  return useQuery<EngagementStats, Error>({
    queryKey: ["admin", "engagement"],
    queryFn: fetchEngagementStats,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
