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
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 md:py-10">
      <Link
        href="/trainer"
        className="mb-4 flex items-center gap-1 font-geist text-sm text-notion-text-light/70 transition-colors duration-200 hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink sm:mb-6"
      >
        <ChevronLeft
          size={16}
          className="transition-transform group-hover:-translate-x-1"
        />
        Back to Dashboard
      </Link>

      <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
        <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
          My Courses
        </h1>
        <Link
          href="/trainer/create"
          className="dark:focus:ring-offset-notion-bg-dark flex items-center justify-center gap-2 rounded-md bg-notion-pink px-4 py-2.5 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-notion-pink focus:ring-offset-2 active:translate-y-0.5"
        >
          <PlusCircle size={16} />
          <span>Create Course</span>
        </Link>
      </div>

      {coursesWithSlideCounts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {coursesWithSlideCounts.map(({ course, slideCount }) => (
            <CourseCard
              key={course.id}
              course={{
                ...course,
                status: course.status ?? "draft",
                skillLevel: course.skillLevel ?? "beginner",
                createdAt: course.createdAt ?? new Date(),
              }}
              slideCount={Number(slideCount)}
              showDeleteOption={true}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-notion-gray-light/30 bg-white/50 p-8 text-center shadow-sm transition-all dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/10">
          <p className="mb-3 font-geist text-lg text-notion-text-light/80 dark:text-notion-text-dark/80">
            You haven&apos;t created any courses yet.
          </p>
          <Link
            href="/trainer/create"
            className="inline-flex items-center gap-1.5 font-geist font-medium text-notion-pink transition-colors hover:underline"
          >
            <PlusCircle size={16} />
            Create your first course
          </Link>
        </div>
      )}
    </main>
  );
}
