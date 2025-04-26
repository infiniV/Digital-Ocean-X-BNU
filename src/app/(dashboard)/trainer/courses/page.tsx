import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, ChevronLeft } from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses, slides } from "~/server/db/schema";
import { eq, count } from "drizzle-orm";
import { CourseCard } from "~/components/dashboard/trainer/CourseCard";

export default async function TrainerCoursesPage() {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Redirect if not a trainer
  if (session.user.role !== "trainer") {
    redirect("/");
  }

  // Fetch all trainer's courses with slide counts
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

  return (
    <main className="container mx-auto min-h-screen px-4 py-8 sm:px-6 sm:py-10 md:py-12">
      <Link
        href="/trainer"
        className="group mb-6 inline-flex items-center gap-2 rounded-md p-1 font-geist text-sm text-notion-text-light/70 transition-all hover:bg-notion-gray-light/50 hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:bg-notion-gray-dark/30 dark:hover:text-notion-pink sm:mb-8"
      >
        <ChevronLeft
          size={16}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        Back to Dashboard
      </Link>

      <div className="mb-8 space-y-4 sm:mb-10 sm:flex sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
          My Courses
        </h1>
        <Link
          href="/trainer/create"
          className="dark:focus:ring-offset-notion-bg-dark group flex w-full items-center justify-center gap-2 rounded-lg bg-notion-pink px-5 py-2.5 font-geist text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-notion-pink-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-notion-pink focus:ring-offset-2 active:translate-y-0 dark:text-notion-text sm:w-auto"
        >
          <PlusCircle
            size={16}
            className="transition-transform group-hover:rotate-90"
          />
          <span>Create Course</span>
        </Link>
      </div>

      {coursesWithSlideCounts.length > 0 ? (
        <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {coursesWithSlideCounts.map(({ course, slideCount }) => (
            <div
              key={course.id}
              className="transition-transform duration-200 ease-out"
            >
              <CourseCard
                course={{
                  ...course,
                  status: course.status ?? "draft",
                  skillLevel: course.skillLevel ?? "beginner",
                  createdAt: course.createdAt ?? new Date(),
                }}
                slideCount={Number(slideCount)}
                showDeleteOption={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in rounded-xl border border-dashed border-notion-gray-light/40 bg-white/50 p-8 text-center shadow-sm transition-all hover:border-notion-pink/30 dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/10 dark:hover:border-notion-pink/20">
          <p className="mb-4 font-geist text-lg text-notion-text-light/80 dark:text-notion-text-dark/80">
            You haven&apos;t created any courses yet.
          </p>
          <Link
            href="/trainer/create"
            className="group inline-flex items-center gap-2 font-geist font-medium text-notion-pink transition-colors hover:text-notion-pink-dark"
          >
            <PlusCircle
              size={16}
              className="transition-transform group-hover:rotate-90"
            />
            Create your first course
          </Link>
        </div>
      )}
    </main>
  );
}
