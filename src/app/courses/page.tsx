import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import CourseCard from "./_components/CourseCard";

export default async function CoursesPage() {
  const session = await auth();
  const isTrainer = session?.user?.role === "trainer";
  const isAdmin = session?.user?.role === "admin";

  // Fetch courses based on user role
  // - Trainees: only published courses
  // - Trainers/Admins: all courses
  const allCourses = await db.query.courses.findMany({
    where: !isTrainer && !isAdmin ? eq(courses.status, "published") : undefined,
    with: {
      trainer: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: (courses, { desc }) => [desc(courses.createdAt)],
  });

  return (
    <main className="min-h-screen bg-notion-background pb-24 dark:bg-notion-background-dark">
      {/* Header section */}
      <section className="bg-white py-12 shadow-sm dark:bg-notion-gray-dark/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-2 font-geist text-3xl font-bold text-notion-text-light dark:text-notion-text-dark sm:text-4xl">
            Explore Courses
          </h1>
          <p className="mb-6 max-w-3xl font-geist text-lg text-notion-text-light/80 dark:text-notion-text-dark/80">
            {!isTrainer && !isAdmin
              ? "Discover a variety of educational content created by our expert trainers"
              : "Browse all courses, including your own and those created by other trainers"}
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-notion-text-light/50 dark:text-notion-text-dark/50" />
            </div>
            <input
              type="search"
              className="block w-full rounded-lg border border-notion-gray-light/20 bg-white py-3 pl-10 pr-3 font-geist text-sm text-notion-text-light placeholder:text-notion-text-light/50 focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50 dark:text-notion-text-dark dark:placeholder:text-notion-text-dark/50"
              placeholder="Search for courses..."
            />
          </div>
        </div>
      </section>

      {/* Courses grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Status message for trainees */}
          {!isTrainer && !isAdmin && (
            <div className="bg-notion-blue/10 text-notion-blue dark:bg-notion-blue/20 mb-6 rounded-lg p-4 text-sm">
              <p>Showing all published courses available for enrollment.</p>
            </div>
          )}

          {/* Courses grid */}
          {allCourses.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isTrainer={isTrainer || isAdmin}
                  userId={session?.user?.id}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed border-notion-gray-light/30 bg-white p-10 text-center dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20">
              <div className="mb-4 rounded-full bg-notion-gray-light/10 p-3 dark:bg-notion-gray-dark/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-notion-text-light/50 dark:text-notion-text-dark/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="mb-1 font-geist text-lg font-bold text-notion-text-light dark:text-notion-text-dark">
                No courses available
              </h3>
              <p className="mb-6 max-w-md text-notion-text-light/70 dark:text-notion-text-dark/70">
                {isTrainer
                  ? "You haven't created any courses yet. Create your first course to get started."
                  : "There are no published courses available at the moment. Please check back later."}
              </p>

              {isTrainer && (
                <Link
                  href="/trainer/courses/new"
                  className="rounded-lg bg-notion-pink px-4 py-2 font-geist text-sm font-medium text-white hover:bg-notion-pink-dark"
                >
                  Create New Course
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
