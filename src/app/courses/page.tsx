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
    <main className="min-h-screen bg-notion-background transition-colors duration-200 ease-in-out dark:bg-notion-background-dark">
      {/* Header section with enhanced depth */}
      <section className="bg-white pb-notion-lg pt-notion-xl shadow-notion transition-all duration-200 ease-in-out dark:bg-notion-gray-dark/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="animate-slide-down font-geist text-3xl font-bold tracking-tight text-notion-text-light [animation-fill-mode:forwards] dark:text-notion-text-dark sm:text-4xl">
            Explore Courses
          </h1>
          <p className="mb-notion-lg mt-notion-xs max-w-3xl font-geist text-lg leading-relaxed text-notion-text-light/80 transition-colors duration-200 dark:text-notion-text-dark/80">
            {!isTrainer && !isAdmin
              ? "Discover a variety of educational content created by our expert trainers"
              : "Browse all courses, including your own and those created by other trainers"}
          </p>

          {/* Enhanced search bar with animation */}
          <div className="relative max-w-lg transform transition-all duration-200 hover:scale-[1.01]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-notion-sm">
              <Search className="h-5 w-5 text-notion-text-light/50 transition-colors duration-200 dark:text-notion-text-dark/50" />
            </div>
            <input
              type="search"
              className="shadow-notion-xs dark:hover:border-notion-accent-dark block w-full rounded-lg border border-notion-gray-light/20 bg-white py-notion-sm pl-notion-xl pr-notion-md font-geist text-sm text-notion-text-light transition-all duration-200 placeholder:text-notion-text-light/50 hover:border-notion-accent focus:border-notion-accent focus:outline-none focus:ring-2 focus:ring-notion-accent/20 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50 dark:text-notion-text-dark dark:placeholder:text-notion-text-dark/50"
              placeholder="Search for courses..."
            />
          </div>
        </div>
      </section>

      {/* Courses section with improved spacing and animations */}
      <section className="py-notion-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Enhanced status message */}
          {!isTrainer && !isAdmin && (
            <div className="bg-notion-accent-light/10 shadow-notion-xs dark:bg-notion-accent-dark/20 mb-notion-lg animate-fade-in rounded-lg p-notion-md text-sm text-notion-text-light transition-all duration-200 hover:shadow-notion dark:text-notion-text-dark">
              <p>Showing all published courses available for enrollment.</p>
            </div>
          )}

          {/* Courses grid with animations */}
          {allCourses.length > 0 ? (
            <div className="mt-notion-lg grid gap-notion-lg sm:grid-cols-2 lg:grid-cols-3">
              {allCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="animate-scale-in opacity-0"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  <CourseCard
                    course={course}
                    isTrainer={isTrainer || isAdmin}
                    userId={session?.user?.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-notion-xl flex animate-fade-in flex-col items-center justify-center rounded-lg border border-dashed border-notion-gray-light/30 bg-white p-notion-xl text-center shadow-notion transition-all duration-200 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20">
              <div className="mb-notion-md rounded-full bg-notion-gray-light/10 p-notion-sm transition-all duration-200 dark:bg-notion-gray-dark/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-notion-text-light/50 transition-colors duration-200 dark:text-notion-text-dark/50"
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
              <h3 className="mb-notion-xs font-geist text-xl font-bold text-notion-text-light transition-colors duration-200 dark:text-notion-text-dark">
                No courses available
              </h3>
              <p className="mb-notion-lg max-w-md text-notion-text-light/70 transition-colors duration-200 dark:text-notion-text-dark/70">
                {isTrainer
                  ? "You haven't created any courses yet. Create your first course to get started."
                  : "There are no published courses available at the moment. Please check back later."}
              </p>

              {isTrainer && (
                <Link
                  href="/trainer/courses/new"
                  className="hover:bg-notion-accent-dark transform rounded-lg bg-notion-accent px-notion-md py-notion-sm font-geist text-sm font-medium text-white shadow-notion transition-all duration-200 hover:scale-105 hover:shadow-notion-hover active:scale-95"
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
