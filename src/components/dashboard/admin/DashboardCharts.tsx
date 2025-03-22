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
    <div className="hover:shadow-notion-lg rounded-lg bg-notion-background p-notion-md shadow-notion transition-all duration-300 dark:bg-notion-background-dark lg:p-notion-lg">
      {/* Header Section with Enhanced Responsiveness */}
      <div className="mb-notion-md overflow-x-auto">
        <div className="flex min-w-max space-x-2 border-b border-notion-disabled dark:border-notion-disabled-dark md:space-x-notion-md">
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
              className={`group flex items-center space-x-2 border-b-2 px-notion-sm py-notion-sm transition-all duration-300 md:px-notion-md ${
                expandedSections[id as keyof typeof expandedSections]
                  ? "border-notion-accent-dark text-notion-accent-dark dark:border-notion-accent-light dark:text-notion-accent-light"
                  : "hover:text-notion-text border-transparent text-notion-text-light hover:border-notion-disabled-text hover:bg-notion-gray-light dark:text-notion-text-dark dark:hover:bg-notion-gray-dark"
              }`}
            >
              <Icon className="h-4 w-4 transition-transform group-hover:scale-110 md:h-5 md:w-5" />
              <span className="font-geist text-sm md:text-base">{title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Section with Enhanced Animation */}
      <motion.div
        className="min-h-[300px] rounded-md bg-notion-gray-light/30 p-notion-sm dark:bg-notion-gray-dark/30 md:min-h-[400px] md:p-notion-md"
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
