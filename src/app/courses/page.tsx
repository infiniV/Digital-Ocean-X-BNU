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
    <main className="min-h-screen bg-notion-background/80 transition-colors duration-300 ease-in-out dark:bg-notion-background-dark">
      {/* Enhanced header section with layered design */}
      <section className="relative bg-gradient-to-b from-white to-notion-gray-light/30 pb-notion-lg pt-notion-xl shadow-notion-xs transition-all duration-300 ease-in-out dark:from-notion-dark dark:to-notion-gray-dark/50 dark:shadow-none md:pb-notion-xl md:pt-notion-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="animate-slide-down font-geist text-2xl font-bold tracking-tight text-notion-text-light [animation-fill-mode:forwards] dark:text-notion-text-dark sm:text-3xl md:text-4xl">
            Explore Courses
          </h1>
          <p className="mb-notion-md mt-notion-xs max-w-3xl font-geist text-base leading-relaxed text-notion-text-light/75 transition-colors duration-300 dark:text-notion-text-dark/75 md:text-lg">
            {!isTrainer && !isAdmin
              ? "Discover a variety of educational content created by our expert trainers"
              : "Browse all courses, including your own and those created by other trainers"}
          </p>

          {/* Enhanced responsive search bar */}
          <div className="relative mt-notion-md max-w-full transform transition-all duration-300 hover:scale-[1.01] sm:max-w-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-notion-sm">
              <Search className="h-4 w-4 text-notion-text-light/40 transition-colors duration-300 dark:text-notion-text-dark/40 sm:h-5 sm:w-5" />
            </div>
            <input
              type="search"
              className="block w-full rounded-lg border border-notion-gray-light/30 bg-white py-2.5 pl-notion-xl pr-notion-md font-geist text-sm text-notion-text-light shadow-notion-xs transition-all duration-300 placeholder:text-notion-text-light/50 focus:border-notion-accent focus:outline-none focus:ring-2 focus:ring-notion-accent/20 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/70 dark:text-notion-text-dark dark:placeholder:text-notion-text-dark/50 dark:focus:border-notion-accent-dark dark:focus:ring-notion-accent-dark/20"
              placeholder="Search for courses..."
            />
          </div>
        </div>

        {/* Subtle decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-notion-accent-light/20 to-transparent dark:via-notion-accent-dark/20"></div>
      </section>

      {/* Enhanced courses section with consistent grid */}
      <section className="py-notion-lg md:py-notion-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Enhanced status message with better mobile layout */}
          {!isTrainer && !isAdmin && (
            <div className="mb-notion-lg animate-fade-in rounded-lg border border-notion-accent-light/20 bg-notion-accent-light/5 p-notion-sm text-sm text-notion-text-light shadow-notion-xs transition-all duration-300 hover:shadow-notion dark:border-notion-accent-dark/20 dark:bg-notion-accent-dark/10 dark:text-notion-text-dark md:p-notion-md">
              <p className="flex items-center">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-notion-accent"></span>
                Showing all published courses available for enrollment.
              </p>
            </div>
          )}

          {/* Improved grid layout for consistent card sizes */}
          {allCourses.length > 0 ? (
            <div className="mt-notion-md grid auto-rows-fr gap-4 sm:grid-cols-2 sm:gap-6 md:mt-notion-lg lg:grid-cols-3 lg:gap-notion-lg">
              {allCourses.map((course, index) => (
                <div
                  key={course.id}
                  className="h-full animate-scale-in opacity-0"
                  style={{
                    animationDelay: `${Math.min(index * 0.1, 0.5)}s`,
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
            <div className="mt-notion-lg flex animate-fade-in flex-col items-center justify-center rounded-lg border border-dashed border-notion-gray-light/40 bg-white/90 p-4 text-center shadow-notion-xs transition-all duration-300 hover:shadow-notion dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/20 sm:p-notion-lg md:mt-notion-xl md:p-notion-xl">
              <div className="mb-notion-md rounded-full bg-notion-gray-light/20 p-notion-sm transition-all duration-300 dark:bg-notion-gray-dark/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-notion-text-light/40 transition-colors duration-300 dark:text-notion-text-dark/40 sm:h-12 sm:w-12"
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
              <h3 className="mb-notion-xs font-geist text-lg font-bold text-notion-text-light transition-colors duration-300 dark:text-notion-text-dark sm:text-xl">
                No courses available
              </h3>
              <p className="mb-notion-lg max-w-md text-sm text-notion-text-light/70 transition-colors duration-300 dark:text-notion-text-dark/70 sm:text-base">
                {isTrainer
                  ? "You haven't created any courses yet. Create your first course to get started."
                  : "There are no published courses available at the moment. Please check back later."}
              </p>

              {isTrainer && (
                <Link
                  href="/trainer/courses/new"
                  className="group inline-flex transform items-center rounded-lg bg-notion-accent px-notion-sm py-2 font-geist text-sm font-medium text-white shadow-notion-xs transition-all duration-300 hover:bg-notion-accent-dark hover:shadow-notion active:scale-95 dark:bg-notion-accent-dark"
                >
                  <span>Create New Course</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
