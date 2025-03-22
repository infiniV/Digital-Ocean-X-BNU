"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useAdminEngagementStats } from "~/hooks/use-admin-engagement-stats";
import { Award, Loader2 } from "lucide-react";

// Achievement type colors
const ACHIEVEMENT_COLORS = {
  course_enrollment: "#fc76a1", // notion-pink
  course_completion: "#0ea5e9", // sky blue
  streak: "#f59e0b", // amber
  slides_milestone: "#10b981", // emerald
  multiple_courses: "#8b5cf6", // violet
  other: "#64748b", // slate
};

export function AchievementStats() {
  const { data, isLoading, error } = useAdminEngagementStats();

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-notion-pink" />
          <p className="mt-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Loading achievement data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data?.achievements || !data?.activity) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800/30 dark:bg-red-900/20">
        <p className="text-base text-red-600 dark:text-red-400">
          Failed to load achievement data
        </p>
      </div>
    );
  }

  interface ChartDataItem {
    type: string;
    value: number;
    name: string;
  }

  // Group achievements by type for pie chart
  const achievementTypeData = data.achievements.reduce(
    (acc: ChartDataItem[], achievement) => {
      const existing = acc.find((item) => item.type === achievement.type);
      if (existing) {
        existing.value += Number(achievement.total_earners);
      } else {
        acc.push({
          type: achievement.type,
          value: Number(achievement.total_earners),
          name: formatAchievementType(achievement.type),
        });
      }
      return acc;
    },
    [],
  );

  // Format achievement type for display
  function formatAchievementType(type: string): string {
    switch (type) {
      case "course_enrollment":
        return "Course Enrollment";
      case "course_completion":
        return "Course Completion";
      case "streak":
        return "Streak";
      case "slides_milestone":
        return "Slides Milestone";
      case "multiple_courses":
        return "Multiple Courses";
      default:
        return type
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  }

  // Helper function to safely format numbers
  const formatNumber = (value: unknown, decimals = 1): string => {
    if (typeof value === "number") {
      return value.toFixed(decimals);
    }
    return "0";
  };

  return (
    <div className="rounded-lg border border-notion-gray-light/20 bg-notion-background p-6 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-dark">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-full bg-notion-pink-light p-2 dark:bg-notion-pink-dark">
          <Award className="h-5 w-5 text-notion-accent" />
        </div>
        <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
          Achievement Analytics
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Achievement metrics */}
        <div className="space-y-4 rounded-lg border border-notion-gray-light/20 bg-notion-gray-light/5 p-4 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <h4 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
            Trainee Engagement Metrics
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Average Streak
              </p>
              <p className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                {formatNumber(data.activity.average_streak)} days
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Longest Streak
              </p>
              <p className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                {data.activity.max_streak || "0"} days
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Avg. Notes per Trainee
              </p>
              <p className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                {formatNumber(data.activity.average_notes)}
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Avg. Slides Completed
              </p>
              <p className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                {formatNumber(data.activity.average_slides_completed)}
              </p>
            </div>
          </div>
        </div>

        {/* Achievement pie chart */}
        <div className="h-[240px]">
          {achievementTypeData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                No achievement data available
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={achievementTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  labelLine={false}
                >
                  {achievementTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ACHIEVEMENT_COLORS[
                          entry.type as keyof typeof ACHIEVEMENT_COLORS
                        ] || ACHIEVEMENT_COLORS.other
                      }
                      opacity={0.8}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} earners`, undefined]}
                  contentStyle={{
                    backgroundColor: "var(--notion-background)",
                    borderColor: "var(--notion-disabled)",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "var(--notion-shadow)",
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top achievements table */}
      <div className="mt-6">
        <h4 className="mb-3 font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
          Top Achievements
        </h4>
        <div className="max-h-[240px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-notion-background dark:bg-notion-dark">
              <tr className="border-b border-notion-gray-light/20 dark:border-notion-gray-dark/30">
                <th className="pb-2 pl-2 font-geist text-xs font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Achievement
                </th>
                <th className="pb-2 text-right font-geist text-xs font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Earners
                </th>
                <th className="pb-2 pr-2 text-right font-geist text-xs font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Avg. Progress
                </th>
              </tr>
            </thead>
            <tbody>
              {data.achievements.slice(0, 5).map((achievement) => (
                <tr
                  key={achievement.id}
                  className="border-b border-notion-gray-light/10 transition-colors hover:bg-notion-gray-light/5 dark:border-notion-gray-dark/20 dark:hover:bg-notion-gray-dark/20"
                >
                  <td className="py-2 pl-2 font-geist text-sm text-notion-text-light dark:text-notion-text-dark">
                    {achievement.title}
                  </td>
                  <td className="py-2 text-right font-geist text-sm text-notion-text-light dark:text-notion-text-dark">
                    {achievement.total_earners}
                  </td>
                  <td className="py-2 pr-2 text-right font-geist text-sm text-notion-text-light dark:text-notion-text-dark">
                    {achievement.average_progress}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
