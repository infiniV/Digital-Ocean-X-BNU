"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAdminEngagementStats } from "~/hooks/use-admin-engagement-stats";
import { Layers, Loader2 } from "lucide-react";
import { type DailyActivityData } from "~/types/dashboard";

interface ActivityChartData extends DailyActivityData {
  slidesViewedAvg: number;
}

export function ActivityChart() {
  const { data, isLoading, error } = useAdminEngagementStats();

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-notion-pink" />
          <p className="mt-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Loading activity data...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data?.dailyActivity) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800/30 dark:bg-red-900/20">
        <p className="text-base text-red-600 dark:text-red-400">
          Failed to load activity data
        </p>
      </div>
    );
  }

  // Format date for the x-axis
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Calculate moving average for slide views
  const movingAverageWindow = 3;
  const chartData: ActivityChartData[] = data.dailyActivity.map(
    (day, index, array) => {
      let slidesAvg = day.slides_viewed;
      let count = 1;

      // Calculate average for preceding days within the window
      for (
        let i = Math.max(0, index - movingAverageWindow + 1);
        i < index;
        i++
      ) {
        const prevDay = array[i];
        if (prevDay) {
          slidesAvg += prevDay.slides_viewed;
          count++;
        }
      }

      return {
        ...day,
        slidesViewedAvg: Math.round(slidesAvg / count),
      };
    },
  );

  return (
    <div className="rounded-lg border border-notion-gray-light/20 bg-notion-background p-3 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-dark sm:p-6">
      <div className="mb-2 sm:mb-4">
        <div className="rounded-full bg-notion-pink-light p-2 dark:bg-notion-pink-dark">
          <Layers className="h-5 w-5 text-notion-accent" />
        </div>
        <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
          Daily Platform Activity
        </h3>
      </div>

      <div className="h-[250px] sm:h-[300px]">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              No activity data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 10 }}
                stroke="currentColor"
                className="text-notion-text-light/70 dark:text-notion-text-dark/70"
                angle={-30}
                textAnchor="end"
                height={50}
                tickMargin={8}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 10 }}
                stroke="currentColor"
                className="text-notion-text-light/70 dark:text-notion-text-dark/70"
                width={30}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
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
                labelFormatter={(label: string) => {
                  const date = new Date(label);
                  return date.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
              <Bar
                name="Slides Viewed"
                dataKey="slides_viewed"
                fill="#E16259"
                yAxisId="left"
                barSize={20}
                radius={[4, 4, 0, 0]}
                fillOpacity={0.7}
              />
              <Line
                name="Slides Viewed (3-day Avg)"
                type="monotone"
                dataKey="slidesViewedAvg"
                stroke="#E16259"
                strokeWidth={2}
                yAxisId="left"
                dot={false}
              />
              <Line
                name="Notes Created"
                type="monotone"
                dataKey="notes_created"
                stroke="#FFB3D1"
                strokeWidth={2}
                yAxisId="right"
                activeDot={{ r: 6, strokeWidth: 1 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
