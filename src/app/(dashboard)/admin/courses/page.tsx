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
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            Manage Courses
          </h1>
          <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
            Review and moderate course content
          </p>
        </div>
      </div>

      {/* Courses Table */}
      <div className="rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
        <div className="border-b border-notion-gray-light/20 px-6 py-4 dark:border-notion-gray-dark/20">
          <div className="flex items-center justify-between">
            <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              All Courses
            </h2>
            <span className="rounded-full bg-notion-pink/10 px-3 py-1 font-geist text-sm font-medium text-notion-pink">
              {allCourses.length} courses
            </span>
          </div>
        </div>

        <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
          {allCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-notion-gray-light/10 dark:bg-notion-gray-dark/30">
                  <BookOpen className="h-5 w-5 text-notion-text-light/50 dark:text-notion-text-dark/50" />
                </div>
                <div>
                  <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                    {course.title}
                  </h3>
                  <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                    by {course.trainer.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <CourseStatusSelect
                  courseId={course.id}
                  currentStatus={course.status}
                />
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-notion-gray-light/20 px-4 font-geist text-sm text-notion-text-light transition-all hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink"
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
