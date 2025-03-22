import { Suspense } from "react";
import Link from "next/link";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema";
import { count } from "drizzle-orm";
import { Users, BookOpen, Presentation, Settings, Loader2 } from "lucide-react";
import { DashboardStats } from "~/components/dashboard/admin/DashboardStats";
import { RecentCourses } from "~/components/dashboard/admin/RecentCourses";

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

interface Course {
  id: string;
  title: string;
  status: string;
  createdAt: Date | null;
  trainer: {
    name: string;
  };
}

// Initial courses loader
async function getInitialCourses() {
  const [totalResult] = await db.select({ count: count() }).from(courses);

  const initialCourses = await db.query.courses.findMany({
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

  // Transform to ensure non-null status and trainer name
  const transformedCourses: Course[] = initialCourses.map((course) => ({
    id: course.id,
    title: course.title ?? "",
    status: course.status ?? "draft",
    createdAt: course.createdAt,
    trainer: {
      name: course.trainer.name ?? "Unknown Trainer",
    },
  }));

  return {
    courses: transformedCourses,
    total: totalResult?.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const { courses: initialCourses, total: totalCourses } =
    await getInitialCourses();

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
        <RecentCourses
          initialCourses={initialCourses}
          totalCourses={totalCourses}
          pageSize={5}
        />
      </Suspense>
    </main>
  );
}
