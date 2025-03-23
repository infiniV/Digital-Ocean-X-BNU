import { db } from "~/server/db";
import { courses } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft, BookOpen, Filter } from "lucide-react";
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
    <main className="min-h-screen w-full animate-fade-in bg-notion-background-light px-4 py-notion-md dark:bg-notion-background-dark sm:px-6 sm:py-notion-lg lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-7xl space-y-notion-md">
        <Link
          href="/admin"
          className="mb-notion-sm inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/60 transition-all duration-200 hover:translate-x-[-4px] hover:text-notion-accent dark:text-notion-text-dark/60 dark:hover:text-notion-accent-light"
        >
          <ChevronLeft size={16} className="animate-slide-in" />
          <span className="animate-slide-in delay-75">Back to Dashboard</span>
        </Link>

        <div className="space-y-notion-xs">
          <h1 className="animate-slide-in font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-2xl md:text-3xl">
            Manage Courses
          </h1>
          <p className="animate-slide-in font-geist text-[15px] leading-relaxed text-notion-text-light/70 delay-100 dark:text-notion-text-dark/70">
            Review and moderate course content
          </p>
        </div>
      </div>

      {/* Courses Table */}
      <div className="mx-auto mt-notion-xl max-w-7xl animate-scale-in rounded-xl border border-notion-gray-light/30 bg-white shadow-notion transition-all duration-200 hover:shadow-notion-hover dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/30 lg:mt-notion-2xl">
        <div className="border-b border-notion-gray-light/20 px-notion-md py-notion-md dark:border-notion-gray-dark/30 sm:px-notion-lg">
          <div className="flex flex-col items-start justify-between gap-notion-sm sm:flex-row sm:items-center">
            <div className="flex items-center gap-notion-xs">
              <h2 className="font-geist text-lg font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                All Courses
              </h2>
              <span className="ml-notion-sm animate-pulse-slow rounded-full bg-notion-accent-light/15 px-notion-sm py-1 font-geist text-xs font-medium text-notion-accent-dark dark:bg-notion-accent-dark/15 dark:text-notion-accent-light sm:text-sm">
                {allCourses.length} courses
              </span>
            </div>
            <div className="flex w-full items-center gap-notion-sm sm:w-auto">
              <button className="flex items-center gap-1 rounded-lg border border-notion-gray-light/30 bg-white px-notion-sm py-1.5 text-sm font-medium text-notion-text-light/70 transition-all duration-200 hover:border-notion-accent hover:text-notion-accent dark:border-notion-gray-dark/40 dark:bg-notion-background-dark dark:text-notion-text-dark/70 dark:hover:border-notion-accent-light dark:hover:text-notion-accent-light">
                <Filter size={14} />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/20">
          {allCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-notion-2xl text-center">
              <div className="mb-notion-md rounded-full bg-notion-gray-light/20 p-notion-md dark:bg-notion-gray-dark/40">
                <BookOpen className="h-8 w-8 text-notion-accent dark:text-notion-accent-light" />
              </div>
              <h3 className="font-geist text-lg font-medium text-notion-text-light dark:text-notion-text-dark">
                No courses yet
              </h3>
              <p className="mt-2 max-w-sm font-geist text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
                When courses are created, they will appear here for review
              </p>
            </div>
          ) : (
            allCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col px-notion-md py-notion-md transition-colors duration-200 hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/40 sm:flex-row sm:items-center sm:justify-between sm:px-notion-lg"
              >
                <div className="flex items-center gap-notion-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-notion-gray-light/20 transition-transform duration-200 hover:scale-105 dark:bg-notion-gray-dark/40 sm:h-11 sm:w-11 sm:rounded-xl">
                    <BookOpen className="h-5 w-5 text-notion-accent dark:text-notion-accent-light" />
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

                <div className="mt-notion-sm flex flex-wrap items-center gap-notion-sm sm:mt-0">
                  <CourseStatusSelect
                    courseId={course.id}
                    currentStatus={course.status}
                  />
                  <div className="flex gap-notion-xs">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="inline-flex h-9 items-center justify-center rounded-lg border border-notion-gray-light/30 px-notion-md font-geist text-sm font-medium text-notion-text-light/80 transition-all duration-200 hover:border-notion-accent hover:bg-notion-accent-light/5 hover:text-notion-accent dark:border-notion-gray-dark/40 dark:text-notion-text-dark/80 dark:hover:border-notion-accent-dark dark:hover:bg-notion-accent-dark/10 dark:hover:text-notion-accent-light"
                    >
                      Review
                    </Link>
                    <DeleteCourseButton
                      courseId={course.id}
                      courseTitle={course.title}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {allCourses.length > 0 && (
        <div className="mx-auto mt-notion-lg max-w-7xl text-center font-geist text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
          Showing all {allCourses.length} courses
        </div>
      )}
    </main>
  );
}
