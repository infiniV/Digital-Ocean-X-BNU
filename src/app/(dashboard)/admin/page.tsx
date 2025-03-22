import { Suspense } from "react";
import { db } from "~/server/db";
import { courses, users, enrollments, slides } from "~/server/db/schema";
import { eq, count } from "drizzle-orm";
import Link from "next/link";
import {
  Users,
  BookOpen,
  GraduationCap,
  Presentation,
  Settings,
  UserCheck,
  Award,
  Layers,
  Loader2,
} from "lucide-react";

// Loading component for statistics
function StatisticSkeleton() {
  return (
    <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-notion-gray-light/10 dark:bg-notion-gray-dark/20">
        <Loader2 className="h-6 w-6 animate-spin text-notion-pink" />
      </div>
      <div className="h-5 w-24 animate-pulse rounded bg-notion-gray-light/10 dark:bg-notion-gray-dark/20" />
      <div className="mt-2 h-8 w-16 animate-pulse rounded bg-notion-gray-light/10 dark:bg-notion-gray-dark/20" />
    </div>
  );
}

// Loading component for recent courses
function RecentCoursesSkeleton() {
  return (
    <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between px-6 py-4">
          <div>
            <div className="h-5 w-48 animate-pulse rounded bg-notion-gray-light/10 dark:bg-notion-gray-dark/20" />
            <div className="mt-1 h-4 w-32 animate-pulse rounded bg-notion-gray-light/10 dark:bg-notion-gray-dark/20" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-notion-gray-light/10 dark:bg-notion-gray-dark/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Stats component
async function DashboardStats() {
  const stats = await db.transaction(async (tx) => {
    const [
      totalUsers,
      totalTrainers,
      totalTrainees,
      totalCourses,
      totalPublishedCourses,
      totalEnrollments,
      totalCompletions,
      totalSlides,
    ] = await Promise.all([
      tx
        .select({ count: count() })
        .from(users)
        .then((res) => res[0]?.count ?? 0),
      tx
        .select({ count: count() })
        .from(users)
        .where(eq(users.role, "trainer"))
        .then((res) => res[0]?.count ?? 0),
      tx
        .select({ count: count() })
        .from(users)
        .where(eq(users.role, "trainee"))
        .then((res) => res[0]?.count ?? 0),
      tx
        .select({ count: count() })
        .from(courses)
        .then((res) => res[0]?.count ?? 0),
      tx
        .select({ count: count() })
        .from(courses)
        .where(eq(courses.status, "published"))
        .then((res) => res[0]?.count ?? 0),
      tx
        .select({ count: count() })
        .from(enrollments)
        .then((res) => res[0]?.count ?? 0),
      tx
        .select({ count: count() })
        .from(enrollments)
        .where(eq(enrollments.status, "completed"))
        .then((res) => res[0]?.count ?? 0),
      tx
        .select({ count: count() })
        .from(slides)
        .then((res) => res[0]?.count ?? 0),
    ]);

    return {
      totalUsers,
      totalTrainers,
      totalTrainees,
      totalCourses,
      totalPublishedCourses,
      totalEnrollments,
      totalCompletions,
      totalSlides,
    };
  });

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

// Recent courses component
async function RecentCourses() {
  const recentCourses = await db.query.courses.findMany({
    orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    limit: 5,
    with: {
      trainer: {
        columns: {
          name: true,
        },
      },
    },
  });

  return (
    <div className="rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
      <div className="border-b border-notion-gray-light/20 px-6 py-4 dark:border-notion-gray-dark/20">
        <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
          Recent Courses
        </h2>
      </div>
      <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
        {recentCourses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between px-6 py-4"
          >
            <div>
              <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                {course.title}
              </h3>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                by {course.trainer.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-geist text-xs font-medium ${
                  course.status === "published"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {course.status}
              </span>
              <span className="font-geist text-sm text-notion-text-light/50 dark:text-notion-text-dark/50">
                {new Date(course.createdAt ?? "").toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  return (
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-2 font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
          Monitor and manage all aspects of the platform
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/users"
          className="group flex items-center justify-between rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:border-notion-pink/20 hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50"
        >
          <div>
            <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
              Manage Users
            </h3>
            <p className="mt-1 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              View and manage user accounts
            </p>
          </div>
          <Users className="text-notion-text-light/30 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/30" />
        </Link>

        <Link
          href="/admin/courses"
          className="group flex items-center justify-between rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:border-notion-pink/20 hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50"
        >
          <div>
            <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
              Manage Courses
            </h3>
            <p className="mt-1 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Review and moderate courses
            </p>
          </div>
          <BookOpen className="text-notion-text-light/30 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/30" />
        </Link>

        <Link
          href="/admin/trainers"
          className="group flex items-center justify-between rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:border-notion-pink/20 hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50"
        >
          <div>
            <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
              Manage Trainers
            </h3>
            <p className="mt-1 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Monitor trainer activity
            </p>
          </div>
          <Presentation className="text-notion-text-light/30 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/30" />
        </Link>

        <Link
          href="/admin/settings"
          className="group flex items-center justify-between rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:border-notion-pink/20 hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50"
        >
          <div>
            <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
              Platform Settings
            </h3>
            <p className="mt-1 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Configure platform settings
            </p>
          </div>
          <Settings className="text-notion-text-light/30 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/30" />
        </Link>
      </div>

      {/* Stats with Suspense */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <StatisticSkeleton key={i} />
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      {/* Recent Activity with Suspense */}
      <Suspense
        fallback={
          <div className="rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            <div className="border-b border-notion-gray-light/20 px-6 py-4 dark:border-notion-gray-dark/20">
              <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
                Recent Courses
              </h2>
            </div>
            <RecentCoursesSkeleton />
          </div>
        }
      >
        <RecentCourses />
      </Suspense>
    </main>
  );
}
