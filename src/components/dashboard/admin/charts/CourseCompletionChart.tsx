"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from "recharts";
import { useAdminEngagementStats } from "~/hooks/use-admin-engagement-stats";
import { GraduationCap, Loader2 } from "lucide-react";

interface ChartDataItem {
  name: string;
  completionRate: number;
  total: number;
  completed: number;
  tooltip: string;
}

export function CourseCompletionChart() {
  const { data, isLoading, error } = useAdminEngagementStats();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-notion-pink" />
          <p className="mt-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Loading course completion data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data?.courseCompletion) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800/30 dark:bg-red-900/20">
        <p className="text-base text-red-600 dark:text-red-400">
          Failed to load course completion data
        </p>
      </div>
    );
  }

  // Transform data for the bar chart
  const chartData: ChartDataItem[] = data.courseCompletion.map((course) => ({
    name:
      course.title.length > 20
        ? course.title.substring(0, 20) + "..."
        : course.title,
    completionRate: Number(course.completion_rate),
    total: course.total,
    completed: course.completed,
    tooltip: course.title,
  }));

  return (
    <div className="rounded-lg border border-notion-gray-light/20 bg-notion-background p-6 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-dark">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-full bg-notion-pink-light p-2 dark:bg-notion-pink-dark">
          <GraduationCap className="h-5 w-5 text-notion-accent" />
        </div>
        <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
          Course Completion Rates
        </h3>
      </div>

      <div className="h-[300px]">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="font-geist text-sm text-notion-disabled-text dark:text-notion-disabled-text-dark">
              No course completion data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                opacity={0.15}
                horizontal={false}
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                stroke="currentColor"
                className="text-notion-text-light/70 dark:text-notion-text-dark/70"
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
                stroke="currentColor"
                className="text-notion-text-light/70 dark:text-notion-text-dark/70"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--notion-background)",
                  borderColor: "var(--notion-disabled)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "var(--notion-shadow)",
                }}
                formatter={(value: number) => [
                  `${value.toFixed(1)}%`,
                  "Completion Rate",
                ]}
                labelFormatter={(label: string) => {
                  const course = chartData.find((c) => c.name === label);
                  return course?.tooltip ?? label;
                }}
              />
              <Bar
                dataKey="completionRate"
                fill="currentColor"
                radius={[0, 4, 4, 0]}
                barSize={20}
                className="fill-notion-accent text-notion-accent"
              >
                <LabelList
                  dataKey="completionRate"
                  position="right"
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  className="text-notion-text-light/70 dark:text-notion-text-dark/70"
                  style={{ fontSize: "12px" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
