import { Suspense } from "react";
import Link from "next/link";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema";
import { count } from "drizzle-orm";
import {
  Users,
  BookOpen,
  Presentation,
  Settings,
  Loader2,
  BarChart,
} from "lucide-react";
import { DashboardStats } from "~/components/dashboard/admin/DashboardStats";
import { RecentCourses } from "~/components/dashboard/admin/RecentCourses";
import { DashboardCharts } from "~/components/dashboard/admin/DashboardCharts";

// Loading component for recent courses
function RecentCoursesSkeleton() {
  return (
    <div className="divide-y divide-notion-gray-light/15 dark:divide-notion-gray-dark/20">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
        >
          <div>
            <div className="h-5 w-36 animate-pulse rounded bg-notion-gray-light/15 dark:bg-notion-gray-dark/30 sm:w-48" />
            <div className="mt-1.5 h-4 w-24 animate-pulse rounded bg-notion-gray-light/15 dark:bg-notion-gray-dark/30 sm:w-32" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 animate-pulse rounded-full bg-notion-gray-light/15 dark:bg-notion-gray-dark/30 sm:w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Charts loading component
function ChartsLoadingSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/60 sm:p-6"
        >
          <div className="mb-4 flex items-center space-x-2">
            <div className="h-7 w-36 animate-pulse rounded bg-notion-gray-light/15 dark:bg-notion-gray-dark/30 sm:h-8 sm:w-48" />
            <div className="ml-auto h-7 w-20 animate-pulse rounded bg-notion-gray-light/15 dark:bg-notion-gray-dark/30 sm:h-8 sm:w-24" />
          </div>
          <div className="h-[200px] w-full animate-pulse rounded-lg bg-notion-gray-light/15 dark:bg-notion-gray-dark/30 sm:h-[300px]" />
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
    <main className="min-h-screen space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-2xl md:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1.5 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70 sm:mt-2 sm:text-base">
          Monitor and manage all aspects of the platform
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <Link
          href="/admin/users"
          className="group flex items-center justify-between rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all hover:border-notion-pink hover:shadow-notion dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink/70 sm:p-5 md:p-6"
        >
          <div>
            <h3 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
              Manage Users
            </h3>
            <p className="mt-1 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
              View and manage user accounts
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-notion-gray-light/10 group-hover:bg-notion-pink/10 dark:bg-notion-gray-dark/40">
            <Users className="h-4 w-4 text-notion-text-light/50 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/50 dark:group-hover:text-notion-pink-light sm:h-5 sm:w-5" />
          </div>
        </Link>

        <Link
          href="/admin/courses"
          className="group flex items-center justify-between rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all hover:border-notion-pink hover:shadow-notion dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink/70 sm:p-5 md:p-6"
        >
          <div>
            <h3 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
              Manage Courses
            </h3>
            <p className="mt-1 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
              Review and moderate courses
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-notion-gray-light/10 group-hover:bg-notion-pink/10 dark:bg-notion-gray-dark/40">
            <BookOpen className="h-4 w-4 text-notion-text-light/50 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/50 dark:group-hover:text-notion-pink-light sm:h-5 sm:w-5" />
          </div>
        </Link>

        <Link
          href="/admin/trainers"
          className="group flex items-center justify-between rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all hover:border-notion-pink hover:shadow-notion dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink/70 sm:p-5 md:p-6"
        >
          <div>
            <h3 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
              Manage Trainers
            </h3>
            <p className="mt-1 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
              Monitor trainer activity
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-notion-gray-light/10 group-hover:bg-notion-pink/10 dark:bg-notion-gray-dark/40">
            <Presentation className="h-4 w-4 text-notion-text-light/50 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/50 dark:group-hover:text-notion-pink-light sm:h-5 sm:w-5" />
          </div>
        </Link>

        <Link
          href="/admin/settings"
          className="group flex items-center justify-between rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all hover:border-notion-pink hover:shadow-notion dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink/70 sm:p-5 md:p-6"
        >
          <div>
            <h3 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
              Platform Settings
            </h3>
            <p className="mt-1 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
              Configure platform settings
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-notion-gray-light/10 group-hover:bg-notion-pink/10 dark:bg-notion-gray-dark/40">
            <Settings className="h-4 w-4 text-notion-text-light/50 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/50 dark:group-hover:text-notion-pink-light sm:h-5 sm:w-5" />
          </div>
        </Link>
      </div>

      {/* Stats with Suspense */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/60 sm:p-6"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-notion-gray-light/10 dark:bg-notion-gray-dark/40 sm:mb-4 sm:h-12 sm:w-12">
                  <Loader2 className="h-5 w-5 animate-spin text-notion-pink sm:h-6 sm:w-6" />
                </div>
                <div className="h-5 w-20 animate-pulse rounded bg-notion-gray-light/15 dark:bg-notion-gray-dark/30 sm:w-24" />
                <div className="mt-2 h-7 w-14 animate-pulse rounded bg-notion-gray-light/15 dark:bg-notion-gray-dark/30 sm:h-8 sm:w-16" />
              </div>
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      {/* Dashboard Charts with Suspense */}
      <div className="rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/60 sm:p-6">
        <div className="mb-4 flex items-center space-x-3 sm:mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-notion-pink/10">
            <BarChart className="h-4 w-4 text-notion-pink sm:h-5 sm:w-5" />
          </div>
          <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-xl">
            Advanced Analytics
          </h2>
        </div>

        <Suspense fallback={<ChartsLoadingSkeleton />}>
          <DashboardCharts />
        </Suspense>
      </div>

      {/* Recent Activity with Suspense */}
      <Suspense
        fallback={
          <div className="rounded-lg border border-notion-gray-light/20 bg-white shadow-notion-xs dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/60">
            <div className="border-b border-notion-gray-light/20 px-4 py-3 dark:border-notion-gray-dark/30 sm:px-6 sm:py-4">
              <div className="flex items-center space-x-2">
                <h2 className="font-geist text-base font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-lg">
                  Recent Courses
                </h2>
                <span className="inline-flex h-5 items-center justify-center rounded-full bg-notion-gray-light/15 px-2 text-xs font-medium text-notion-text-light/70 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/70">
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Loading...
                </span>
              </div>
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
