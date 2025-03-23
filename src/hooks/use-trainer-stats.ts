import { useQuery } from "@tanstack/react-query";

interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
}

interface EnrollmentStats {
  total_enrollments: number;
  completed_enrollments: number;
  active_enrollments: number;
  avg_progress: number;
}

interface ContentStats {
  total_slides: number;
  unique_viewers: number;
  total_completions: number;
  completion_rate: number;
}

interface TrainerStats {
  courseStats: CourseStats;
  enrollmentStats: EnrollmentStats;
  contentStats: ContentStats;
}

async function fetchTrainerStats(): Promise<TrainerStats> {
  const response = await fetch("/api/trainer/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch trainer statistics");
  }
  const data = await response.json() as unknown;
  
  // Type guard to validate response shape
  function isTrainerStats(value: unknown): value is TrainerStats {
    const obj = value as TrainerStats;
    return (
      typeof obj === "object" &&
      obj !== null &&
      "courseStats" in obj &&
      "enrollmentStats" in obj &&
      "contentStats" in obj
    );
  }

  if (!isTrainerStats(data)) {
    throw new Error("Invalid trainer statistics data structure");
  }

  return data;
}

export function useTrainerStats() {
  return useQuery<TrainerStats, Error>({
    queryKey: ["trainer", "stats"],
    queryFn: fetchTrainerStats,
  });
}