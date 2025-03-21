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
    <main className="px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
          Trainer Dashboard
        </h1>
        <Link
          href="/trainer/create"
          className="flex items-center gap-2 rounded-md bg-notion-pink px-4 py-2 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md"
        >
          <PlusCircle size={16} />
          <span>Create Course</span>
        </Link>
      </div>

      {/* Stats summary */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-notion-gray-light/20 bg-notion-background p-6 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-notion-pink/10 text-notion-pink">
            <Book size={24} />
          </div>
          <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Total Courses
          </p>
          <p className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
            {totalCourses}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-notion-background p-6 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-notion-pink/10 text-notion-pink">
            <Presentation size={24} />
          </div>
          <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Total Slides
          </p>
          <p className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
            {totalSlides}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-notion-background p-6 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-notion-pink/10 text-notion-pink">
            <BarChart3 size={24} />
          </div>
          <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Published Courses
          </p>
          <p className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
            {publishedCourses}
          </p>
        </div>
      </div>

      {/* New: Skill Level Breakdown */}
      <div className="mb-8">
        <h2 className="mb-4 font-geist text-xl font-medium text-notion-text-light dark:text-notion-text-dark">
          Courses by Skill Level
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-notion-gray-light/20 bg-notion-background p-6 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Layers size={24} />
            </div>
            <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Beginner
            </p>
            <p className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              {beginnerCourses}
            </p>
          </div>

          <div className="rounded-lg border border-notion-gray-light/20 bg-notion-background p-6 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Layers size={24} />
            </div>
            <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Intermediate
            </p>
            <p className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              {intermediateCourses}
            </p>
          </div>

          <div className="rounded-lg border border-notion-gray-light/20 bg-notion-background p-6 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Layers size={24} />
            </div>
            <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Advanced
            </p>
            <p className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              {advancedCourses}
            </p>
          </div>
        </div>
      </div>

      {/* Recent courses section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-geist text-xl font-medium text-notion-text-light dark:text-notion-text-dark">
            Your Recent Courses
          </h2>
          <Link
            href="/trainer/courses"
            className="flex items-center gap-1 font-geist text-sm text-notion-pink hover:underline"
          >
            <span>View all</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {coursesWithSlideCounts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="rounded-md border border-dashed border-notion-gray-light/30 p-6 text-center dark:border-notion-gray-dark/30">
            <p className="mb-2 font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
              You haven&apos;t created any courses yet.
            </p>
            <Link
              href="/trainer/create"
              className="font-geist text-notion-pink hover:underline"
            >
              Create your first course
            </Link>
          </div>
        )}
      </div>

      {/* New: Featured Courses Section */}
      {featuredCourses.length > 0 && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-geist text-xl font-medium text-notion-text-light dark:text-notion-text-dark">
              <span className="flex items-center gap-2">
                <Award size={20} className="text-notion-pink" />
                Featured Courses
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        </div>
      )}
    </main>
  );
}
