import { db } from "~/server/db";
import { courses } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft, BookOpen } from "lucide-react";
import { CourseStatusSelect } from "./_components/CourseStatusSelect";
import { DeleteCourseButton } from "./_components/DeleteCourseButton";

export default async function AdminCoursesPage() {
  // Get all courses with their trainers
  const allCourses = await db.query.courses.findMany({
    orderBy: [desc(courses.createdAt)],
    with: {
      trainer: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <main className="bg-notion-background-light min-h-screen animate-fade-in space-y-notion-xl px-4 py-notion-lg dark:bg-notion-background-dark sm:px-6 lg:px-8">
      {/* Header */}
      <div className="animate-slide-down space-y-notion-md">
        <Link
          href="/admin"
          className="mb-notion-md inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/60 transition-all duration-200 hover:translate-x-[-4px] hover:text-notion-accent dark:text-notion-text-dark/60"
        >
          <ChevronLeft size={16} className="animate-slide-in" />
          Back to Dashboard
        </Link>

        <div className="space-y-notion-xs">
          <h1 className="animate-slide-in font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            Manage Courses
          </h1>
          <p className="animate-slide-in font-geist text-[15px] text-notion-text-light/70 dark:text-notion-text-dark/70">
            Review and moderate course content
          </p>
        </div>
      </div>

      {/* Courses Table */}
      <div className="animate-scale-in rounded-xl border border-notion-gray-light/30 bg-white shadow-notion transition-all duration-200 hover:shadow-notion-hover dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/30">
        <div className="border-b border-notion-gray-light/20 px-notion-lg py-notion-md dark:border-notion-gray-dark/30">
          <div className="flex items-center justify-between">
            <h2 className="font-geist text-lg font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              All Courses
            </h2>
            <span className="bg-notion-accent-light/15 text-notion-accent-dark dark:bg-notion-accent-dark/15 dark:text-notion-accent-light animate-pulse-slow rounded-full px-notion-sm py-1 font-geist text-sm font-medium">
              {allCourses.length} courses
            </span>
          </div>
        </div>

        <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/20">
          {allCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between px-notion-lg py-notion-md transition-colors duration-200 hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/40"
            >
              <div className="flex items-center gap-notion-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-notion-gray-light/20 transition-transform duration-200 hover:scale-105 dark:bg-notion-gray-dark/40">
                  <BookOpen className="dark:text-notion-accent-light h-5 w-5 text-notion-accent" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-geist text-base font-medium tracking-tight text-notion-text-light dark:text-notion-text-dark">
                    {course.title}
                  </h3>
                  <p className="font-geist text-[13px] text-notion-text-light/60 dark:text-notion-text-dark/60">
                    by {course.trainer.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-notion-sm">
                <CourseStatusSelect
                  courseId={course.id}
                  currentStatus={course.status}
                />
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="hover:bg-notion-accent-light/5 dark:hover:border-notion-accent-dark dark:hover:bg-notion-accent-dark/10 dark:hover:text-notion-accent-light inline-flex h-9 items-center justify-center rounded-lg border border-notion-gray-light/30 px-notion-md font-geist text-sm font-medium text-notion-text-light/80 transition-all duration-200 hover:border-notion-accent hover:text-notion-accent dark:border-notion-gray-dark/40 dark:text-notion-text-dark/80"
                >
                  Review
                </Link>
                <DeleteCourseButton
                  courseId={course.id}
                  courseTitle={course.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
