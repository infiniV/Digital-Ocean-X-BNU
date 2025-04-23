import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Presentation,
  Book,
  BarChart3,
  PlusCircle,
  ChevronRight,
  Award,
  Layers,
} from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses, slides } from "~/server/db/schema";
import { eq, count } from "drizzle-orm";
import { CourseCard } from "~/components/dashboard/trainer/CourseCard";

export default async function TrainerDashboard() {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Redirect if not a trainer
  if (session.user.role !== "trainer") {
    redirect("/");
  }

  // Fetch trainer's courses with slide counts
  const coursesWithSlideCounts = await db
    .select({
      course: courses,
      slideCount: count(slides.id),
    })
    .from(courses)
    .leftJoin(slides, eq(courses.id, slides.courseId))
    .where(eq(courses.trainerId, session.user.id))
    .groupBy(courses.id)
    .orderBy(courses.createdAt);

  // Get total counts for stats
  const totalCourses = coursesWithSlideCounts.length;
  const totalSlides = coursesWithSlideCounts.reduce(
    (acc, { slideCount }) => acc + Number(slideCount),
    0,
  );
  const publishedCourses = coursesWithSlideCounts.filter(
    ({ course }) => course.status === "published",
  ).length;

  // New: Get courses by skill level
  const beginnerCourses = coursesWithSlideCounts.filter(
    ({ course }) => course.skillLevel === "beginner",
  ).length;
  const intermediateCourses = coursesWithSlideCounts.filter(
    ({ course }) => course.skillLevel === "intermediate",
  ).length;
  const advancedCourses = coursesWithSlideCounts.filter(
    ({ course }) => course.skillLevel === "advanced",
  ).length;

  // New: Get featured courses
  const featuredCourses = coursesWithSlideCounts.filter(
    ({ course }) => course.isFeatured,
  );

  return (
    <main className="min-h-screen bg-notion-background p-notion-lg transition-colors duration-200 dark:bg-notion-background-dark">
      <div className="mx-auto max-w-7xl space-y-notion-xl">
        {/* Profile quick access */}
        <div className="flex justify-end">
          <Link
            href="/trainer/profile"
            className="rounded-lg bg-notion-accent/10 px-4 py-2 font-geist text-base font-medium text-notion-accent transition-all hover:bg-notion-accent hover:text-white"
          >
            Edit Profile
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            Trainer Dashboard
          </h1>
          <Link
            href="/trainer/create"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-notion-pink px-5 py-2.5 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md sm:w-auto"
          >
            <PlusCircle size={18} />
            <span>Create Course</span>
          </Link>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-notion-pink/10 text-notion-pink">
              <Book size={24} />
            </div>
            <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
              Total Courses
            </p>
            <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              {totalCourses}
            </p>
          </div>

          <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-notion-pink/10 text-notion-pink">
              <Presentation size={24} />
            </div>
            <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
              Total Slides
            </p>
            <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              {totalSlides}
            </p>
          </div>

          <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-notion-pink/10 text-notion-pink">
              <BarChart3 size={24} />
            </div>
            <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
              Published Courses
            </p>
            <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              {publishedCourses}
            </p>
          </div>
        </div>

        {/* Skill Level Breakdown */}
        <section className="space-y-4">
          <h2 className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            Courses by Skill Level
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100/80 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <Layers size={24} />
              </div>
              <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                Beginner
              </p>
              <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                {beginnerCourses}
              </p>
            </div>

            <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <Layers size={24} />
              </div>
              <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                Intermediate
              </p>
              <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                {intermediateCourses}
              </p>
            </div>

            <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100/80 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                <Layers size={24} />
              </div>
              <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                Advanced
              </p>
              <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                {advancedCourses}
              </p>
            </div>
          </div>
        </section>

        {/* Recent courses section */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              Your Recent Courses
            </h2>
            <Link
              href="/trainer/courses"
              className="flex items-center gap-1.5 font-geist text-sm font-medium text-notion-pink transition-colors hover:text-notion-pink-dark"
            >
              <span>View all courses</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {coursesWithSlideCounts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coursesWithSlideCounts
                .slice(0, 3)
                .map(({ course, slideCount }) => (
                  <CourseCard
                    key={course.id}
                    course={{
                      ...course,
                      status: course.status ?? "draft",
                      skillLevel: course.skillLevel ?? "beginner",
                      createdAt: course.createdAt ?? new Date(),
                      title: course.title ?? "",
                      slug: course.slug ?? "",
                    }}
                    slideCount={Number(slideCount)}
                  />
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-notion-gray-light/30 bg-white p-8 text-center dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
              <div className="rounded-full bg-notion-gray-light/10 p-3 dark:bg-notion-gray-dark/30">
                <Book
                  size={24}
                  className="text-notion-text-light/40 dark:text-notion-text-dark/40"
                />
              </div>
              <div>
                <p className="mb-2 font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70">
                  You haven&apos;t created any courses yet
                </p>
                <Link
                  href="/trainer/create"
                  className="font-geist text-sm font-medium text-notion-pink hover:underline"
                >
                  Create your first course
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Featured Courses Section */}
        {featuredCourses.length > 0 && (
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              <Award size={20} className="text-notion-pink" />
              Featured Courses
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map(({ course, slideCount }) => (
                <CourseCard
                  key={course.id}
                  course={{
                    ...course,
                    status: course.status ?? "draft",
                    skillLevel: course.skillLevel ?? "beginner",
                    createdAt: course.createdAt ?? new Date(),
                    title: course.title ?? "",
                    slug: course.slug ?? "",
                  }}
                  slideCount={Number(slideCount)}
                  isFeatured={true}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
