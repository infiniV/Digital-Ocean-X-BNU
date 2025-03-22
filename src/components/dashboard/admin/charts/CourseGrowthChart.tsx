"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAdminGrowthStats } from "~/hooks/use-admin-growth-stats";
import { BookOpen, Loader2 } from "lucide-react";

interface PeriodSelectorProps {
  selected: "day" | "week" | "month";
  onChange: (period: "day" | "week" | "month") => void;
}

function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  return (
    <div className="mb-4 flex rounded-lg border border-notion-gray-light/20 p-1 text-sm dark:border-notion-gray-dark/30">
      <button
        className={`rounded-md px-3 py-1 transition-colors ${
          selected === "day"
            ? "bg-notion-pink text-white"
            : "hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/20"
        }`}
        onClick={() => onChange("day")}
      >
        Daily
      </button>
      <button
        className={`rounded-md px-3 py-1 transition-colors ${
          selected === "week"
            ? "bg-notion-pink text-white"
            : "hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/20"
        }`}
        onClick={() => onChange("week")}
      >
        Weekly
      </button>
      <button
        className={`rounded-md px-3 py-1 transition-colors ${
          selected === "month"
            ? "bg-notion-pink text-white"
            : "hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/20"
        }`}
        onClick={() => onChange("month")}
      >
        Monthly
      </button>
    </div>
  );
}

export function CourseGrowthChart() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");
  const limit = period === "day" ? 30 : period === "week" ? 12 : 12;
  const { data, isLoading, error } = useAdminGrowthStats({ period, limit });

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-notion-pink" />
          <p className="mt-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Loading course growth data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data?.courseGrowth) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800/30 dark:bg-red-900/20">
        <p className="text-base text-red-600 dark:text-red-400">
          Failed to load course growth data
        </p>
      </div>
    );
  }

  // Format date labels based on period
  const formatXAxis = (value: string): string => {
    if (period === "day") {
      return value.split("-").slice(1).join("/"); // MM/DD format
    } else if (period === "week") {
      const parts = value.split("-");
      const year = parts[0] ?? "";
      const week = parts[1] ?? "";
      return `W${week}'${year.slice(2)}`; // W01'23 format
    } else {
      const parts = value.split("-");
      const year = parts[0] ?? "";
      const monthIndex = parseInt(parts[1] ?? "1", 10) - 1;
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[monthIndex]} ${year.slice(2)}`; // Jan'23 format
    }
  };

  return (
    <div className="rounded-lg border border-notion-gray-light/20 bg-notion-background p-6 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-dark">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-notion-pink-light p-2 dark:bg-notion-pink-dark">
            <BookOpen className="h-5 w-5 text-notion-accent" />
          </div>
          <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
            Course Growth
          </h3>
        </div>
        <PeriodSelector selected={period} onChange={setPeriod} />
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.courseGrowth}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxis}
              angle={-30}
              textAnchor="end"
              height={60}
              stroke="currentColor"
              className="text-notion-text-light/70 dark:text-notion-text-dark/70"
            />
            <YAxis
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
              formatter={(value: number) => [`${value} courses`, undefined]}
              labelFormatter={(label: string) => formatXAxis(label)}
            />
            <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
            <Area
              name="New Courses"
              type="monotone"
              dataKey="new_courses"
              stroke="#E16259"
              fill="#E16259"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              name="Published Courses"
              type="monotone"
              dataKey="published_courses"
              stroke="#FFB3D1"
              fill="#FFB3D1"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
