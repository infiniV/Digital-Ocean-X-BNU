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
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-notion-gray-light/10 dark:bg-notion-gray-dark/20">
                <Loader2 className="h-6 w-6 animate-spin text-notion-pink" />
              </div>
              <div className="h-5 w-24 animate-pulse rounded bg-notion-gray-light/10 dark:bg-notion-gray-dark/20" />
              <div className="mt-2 h-8 w-16 animate-pulse rounded bg-notion-gray-light/10 dark:bg-notion-gray-dark/20" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800/30 dark:bg-red-900/20">
        <p className="text-base text-red-600 dark:text-red-400">
          Failed to load dashboard statistics
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-notion-pink/10 text-notion-pink">
            <Users size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Total Users
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.totalUsers}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <BookOpen size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Total Courses
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.totalCourses}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100/80 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <GraduationCap size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Total Enrollments
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.totalEnrollments}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100/80 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <Award size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Course Completions
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.totalCompletions}
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* User Statistics */}
        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <h2 className="mb-6 font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
            User Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-notion-pink/10 p-2">
                  <UserCheck size={16} className="text-notion-pink" />
                </div>
                <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Total Trainers
                </span>
              </div>
              <span className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                {stats.totalTrainers}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-notion-pink/10 p-2">
                  <GraduationCap size={16} className="text-notion-pink" />
                </div>
                <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Total Trainees
                </span>
              </div>
              <span className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                {stats.totalTrainees}
              </span>
            </div>
          </div>
        </div>

        {/* Course Statistics */}
        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <h2 className="mb-6 font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
            Course Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-notion-pink/10 p-2">
                  <BookOpen size={16} className="text-notion-pink" />
                </div>
                <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Published Courses
                </span>
              </div>
              <span className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                {stats.totalPublishedCourses}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-notion-pink/10 p-2">
                  <Layers size={16} className="text-notion-pink" />
                </div>
                <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Total Content Slides
                </span>
              </div>
              <span className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                {stats.totalSlides}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
