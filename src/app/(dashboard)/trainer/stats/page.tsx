"use client";

import { Loader2, Book, Users, CheckCircle, BarChart2, Clock } from "lucide-react";
import { useTrainerStats } from "~/hooks/use-trainer-stats";

export default function TrainerStatsPage() {
  const { data: stats, isLoading, error } = useTrainerStats();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-notion-pink" />
          <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Loading statistics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="font-geist text-lg text-red-600 dark:text-red-400">
            Failed to load trainer statistics
          </p>
          <p className="mt-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <h1 className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
          Course Statistics
        </h1>
        <p className="font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70">
          Track your course performance and student engagement
        </p>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-notion-pink/10 text-notion-pink">
            <Book size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Total Courses
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.courseStats.totalCourses}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
              {stats.courseStats.publishedCourses} published
            </span>
            <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
              {stats.courseStats.draftCourses} drafts
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Users size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Total Enrollments
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.enrollmentStats.total_enrollments}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
              {stats.enrollmentStats.completed_enrollments} completed
            </span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              {stats.enrollmentStats.active_enrollments} active
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:col-span-2 lg:col-span-1">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100/80 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <BarChart2 size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Content Engagement
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.contentStats.total_slides} slides
          </p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-notion-text-light/70 dark:text-notion-text-dark/70">
                Completion Rate
              </span>
              <span className="font-medium text-notion-text-light dark:text-notion-text-dark">
                {stats.contentStats.completion_rate}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-notion-gray-light/20 dark:bg-notion-gray-dark/30">
              <div
                className="h-full rounded-full bg-purple-500"
                style={{ width: `${stats.contentStats.completion_rate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Active Students */}
        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              Active Students
            </h3>
            <Clock className="h-5 w-5 text-notion-pink" />
          </div>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.enrollmentStats.active_enrollments}
          </p>
          <p className="mt-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Average Progress: {stats.enrollmentStats.avg_progress}%
          </p>
        </div>

        {/* Content Stats */}
        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              Content Impact
            </h3>
            <CheckCircle className="h-5 w-5 text-notion-pink" />
          </div>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.contentStats.unique_viewers}
          </p>
          <p className="mt-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Unique Content Viewers
          </p>
          <p className="mt-1 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            {stats.contentStats.total_completions} slide completions
          </p>
        </div>
      </div>
    </main>
  );
}