"use client";

import { UserGrowthChart } from "./charts/UserGrowthChart";
import { CourseGrowthChart } from "./charts/CourseGrowthChart";
import { CourseCompletionChart } from "./charts/CourseCompletionChart";
import { ActivityChart } from "./charts/ActivityChart";
import { AchievementStats } from "./charts/AchievementStats";
import { useState } from "react";
import { Users, BookOpen, CheckCircle, BarChart, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function DashboardCharts() {
  const [expandedSections, setExpandedSections] = useState({
    userGrowth: true,
    courseGrowth: false,
    courseCompletion: false,
    activity: false,
    achievements: false,
  });

  return (
    <div className="rounded-lg bg-notion-background p-4 shadow-notion transition-all duration-300 hover:shadow-notion-lg dark:bg-notion-background-dark lg:p-6">
      {/* Responsive Header Section */}
      <div className="scrollbar-hide -mx-4 mb-4 overflow-x-auto lg:mx-0">
        <div className="flex min-w-max space-x-1 border-b border-notion-disabled px-4 dark:border-notion-disabled-dark lg:px-0">
          {[
            { id: "userGrowth", title: "User Growth", Icon: Users },
            { id: "courseGrowth", title: "Course Growth", Icon: BookOpen },
            { id: "courseCompletion", title: "Completion", Icon: CheckCircle },
            { id: "activity", title: "Activity", Icon: BarChart },
            { id: "achievements", title: "Achievements", Icon: Trophy },
          ].map(({ id, title, Icon }) => (
            <button
              key={id}
              onClick={() =>
                setExpandedSections(() => ({
                  userGrowth: false,
                  courseGrowth: false,
                  courseCompletion: false,
                  activity: false,
                  achievements: false,
                  [id]: true,
                }))
              }
              className={`group flex items-center gap-2 rounded-t-lg border-b-2 px-3 py-2.5 transition-all duration-300 ${
                expandedSections[id as keyof typeof expandedSections]
                  ? "border-notion-pink bg-notion-pink/5 text-notion-pink dark:bg-notion-pink-dark/10"
                  : "border-transparent text-notion-text-light/70 hover:bg-notion-gray-light/50 hover:text-notion-text-light dark:text-notion-text-dark/70 dark:hover:bg-notion-gray-dark/50 dark:hover:text-notion-text-dark"
              }`}
            >
              <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 lg:h-5 lg:w-5" />
              <span className="whitespace-nowrap font-geist text-sm lg:text-base">
                {title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Content Section */}
      <motion.div
        className="min-h-[300px] rounded-lg bg-notion-gray-light/20 p-4 dark:bg-notion-gray-dark/20 lg:min-h-[400px] lg:p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="h-full w-full animate-fade-in">
          {expandedSections.userGrowth && <UserGrowthChart />}
          {expandedSections.courseGrowth && <CourseGrowthChart />}
          {expandedSections.courseCompletion && <CourseCompletionChart />}
          {expandedSections.activity && <ActivityChart />}
          {expandedSections.achievements && <AchievementStats />}
        </div>
      </motion.div>
    </div>
  );
}
