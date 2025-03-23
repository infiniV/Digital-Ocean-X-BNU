"use client";

import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  UserCheck,
  Layers,
  Loader2,
} from "lucide-react";
import { useAdminStats } from "~/hooks/use-admin-stats";

export function DashboardStats() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-notion-gray-light/20 bg-white p-5 transition-shadow duration-200 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-6"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-notion-gray-light/10 dark:bg-notion-gray-dark/20 sm:h-12 sm:w-12">
              <Loader2 className="h-5 w-5 animate-spin text-notion-pink sm:h-6 sm:w-6" />
            </div>
            <div className="h-4 w-20 animate-pulse rounded bg-notion-gray-light/10 dark:bg-notion-gray-dark/20 sm:h-5 sm:w-24" />
            <div className="mt-2 h-7 w-14 animate-pulse rounded bg-notion-gray-light/10 dark:bg-notion-gray-dark/20 sm:h-8 sm:w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center shadow-sm transition-all duration-200 dark:border-red-800/30 dark:bg-red-900/20 sm:p-6">
        <p className="text-sm text-red-600 dark:text-red-400 sm:text-base">
          Failed to load dashboard statistics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Statistics Grid */}
      <div className="xs:grid-cols-2 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="group rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all duration-200 hover:shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-6">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-notion-pink/10 text-notion-pink transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12">
            <Users size={24} />
          </div>
          <p className="font-geist text-xs font-medium text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
            Total Users
          </p>
          <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            {stats.totalUsers}
          </p>
        </div>

        <div className="group rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all duration-200 hover:shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-6">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600 transition-transform duration-200 group-hover:scale-105 dark:bg-blue-900/20 dark:text-blue-400 sm:h-12 sm:w-12">
            <BookOpen size={24} />
          </div>
          <p className="font-geist text-xs font-medium text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
            Total Courses
          </p>
          <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            {stats.totalCourses}
          </p>
        </div>

        <div className="group rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all duration-200 hover:shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-6">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100/80 text-green-600 transition-transform duration-200 group-hover:scale-105 dark:bg-green-900/20 dark:text-green-400 sm:h-12 sm:w-12">
            <GraduationCap size={24} />
          </div>
          <p className="font-geist text-xs font-medium text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
            Total Enrollments
          </p>
          <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            {stats.totalEnrollments}
          </p>
        </div>

        <div className="group rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all duration-200 hover:shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-6">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100/80 text-purple-600 transition-transform duration-200 group-hover:scale-105 dark:bg-purple-900/20 dark:text-purple-400 sm:h-12 sm:w-12">
            <Award size={24} />
          </div>
          <p className="font-geist text-xs font-medium text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
            Course Completions
          </p>
          <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            {stats.totalCompletions}
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* User Statistics */}
        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all duration-200 hover:shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-6">
          <h2 className="mb-4 font-geist text-base font-semibold text-notion-text-light dark:text-notion-text-dark sm:mb-6 sm:text-lg">
            User Statistics
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between rounded-md px-2 py-2 transition-colors duration-200 hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/70">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-full bg-notion-pink/10 p-1.5 sm:p-2">
                  <UserCheck size={16} className="text-notion-pink" />
                </div>
                <span className="font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
                  Total Trainers
                </span>
              </div>
              <span className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
                {stats.totalTrainers}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md px-2 py-2 transition-colors duration-200 hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/70">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-full bg-notion-pink/10 p-1.5 sm:p-2">
                  <GraduationCap size={16} className="text-notion-pink" />
                </div>
                <span className="font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
                  Total Trainees
                </span>
              </div>
              <span className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
                {stats.totalTrainees}
              </span>
            </div>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all duration-200 hover:shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-6">
          <h2 className="mb-4 font-geist text-base font-semibold text-notion-text-light dark:text-notion-text-dark sm:mb-6 sm:text-lg">
            Course Statistics
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between rounded-md px-2 py-2 transition-colors duration-200 hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/70">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-full bg-notion-pink/10 p-1.5 sm:p-2">
                  <BookOpen size={16} className="text-notion-pink" />
                </div>
                <span className="font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
                  Published Courses
                </span>
              </div>
              <span className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
                {stats.totalPublishedCourses}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md px-2 py-2 transition-colors duration-200 hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/70">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-full bg-notion-pink/10 p-1.5 sm:p-2">
                  <Layers size={16} className="text-notion-pink" />
                </div>
                <span className="font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
                  Total Content Slides
                </span>
              </div>
              <span className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
                {stats.totalSlides}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
