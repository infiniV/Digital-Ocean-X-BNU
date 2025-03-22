import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  totalUsers: number;
  totalTrainers: number;
  totalTrainees: number;
  totalCourses: number;
  totalPublishedCourses: number;
  totalEnrollments: number;
  totalCompletions: number;
  totalSlides: number;
}

async function fetchStats(): Promise<DashboardStats> {
  const response = await fetch("/api/admin/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  const data = await response.json() as DashboardStats;
  return data;
}

export function useAdminStats() {
  return useQuery<DashboardStats>({
    queryKey: ["admin", "stats"],
    queryFn: fetchStats,
  });
}