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
    <main className="container px-6 py-8">
      <Link
        href="/trainer"
        className="mb-6 flex items-center gap-1 font-geist text-sm text-notion-text-light/70 hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink"
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
          My Courses
        </h1>
        <Link
          href="/trainer/create"
          className="flex items-center gap-2 rounded-md bg-notion-pink px-4 py-2 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md"
        >
          <PlusCircle size={16} />
          <span>Create Course</span>
        </Link>
      </div>

      {coursesWithSlideCounts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </main>
  );
}
