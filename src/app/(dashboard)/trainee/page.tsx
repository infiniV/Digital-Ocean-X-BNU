import { redirect } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Clock,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses, enrollments, slides } from "~/server/db/schema";
import { eq, and, count } from "drizzle-orm";

export default async function TraineeDashboard() {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Redirect if not a trainee
  if (session.user.role !== "trainee") {
    redirect("/");
  }

  // Fetch trainee's enrollments with course details
  const enrolledCourses = await db.query.enrollments.findMany({
    where: eq(enrollments.traineeId, session.user.id),
    with: {
      course: {
        with: {
          trainer: {
            columns: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: (enrollments, { desc }) => [desc(enrollments.enrolledAt)],
  });

  // Get total slides across all enrolled courses
  const totalSlides = await db
    .select({ count: count() })
    .from(slides)
    .where(
      and(
        eq(courses.trainerId, session.user.id),
        eq(enrollments.traineeId, session.user.id),
      ),
    )
    .innerJoin(courses, eq(slides.courseId, courses.id))
    .innerJoin(enrollments, eq(courses.id, enrollments.courseId));

  // Calculate statistics
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (enrollment) => enrollment.status === "completed",
  ).length;
  const inProgressCourses = enrolledCourses.filter(
    (enrollment) => enrollment.status === "active",
  ).length;

  return (
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
          My Learning Dashboard
        </h1>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-notion-pink/10 text-notion-pink">
            <GraduationCap size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Enrolled Courses
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {totalCourses}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100/80 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <Trophy size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Completed
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {completedCourses}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Clock size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            In Progress
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {inProgressCourses}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100/80 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <BookOpen size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Total Slides
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {totalSlides[0]?.count ?? 0}
          </p>
        </div>
      </div>

      {/* Enrolled Courses */}
      <section className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            My Courses
          </h2>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 font-geist text-sm font-medium text-notion-pink transition-colors hover:text-notion-pink-dark"
          >
            <span>Browse more courses</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/trainee/courses/${enrollment.courseId}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:border-notion-pink/20 hover:shadow-md dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50"
              >
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                      {enrollment.status}
                    </span>
                    <span className="text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
                      {enrollment.progress}% Complete
                    </span>
                  </div>
                  <h3 className="font-geist text-lg font-semibold text-notion-text-light transition-colors group-hover:text-notion-pink dark:text-notion-text-dark">
                    {enrollment.course.title}
                  </h3>
                  <p className="mt-1 text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                    by {enrollment.course.trainer?.name ?? "Unknown Trainer"}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-notion-gray-light/20 dark:bg-notion-gray-dark/40">
                    <div
                      className="h-full bg-notion-pink transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-notion-gray-light/30 bg-white p-8 text-center dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            <div className="rounded-full bg-notion-gray-light/10 p-3 dark:bg-notion-gray-dark/30">
              <BookOpen
                size={24}
                className="text-notion-text-light/40 dark:text-notion-text-dark/40"
              />
            </div>
            <div>
              <p className="mb-2 font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70">
                You haven&apos;t enrolled in any courses yet
              </p>
              <Link
                href="/courses"
                className="font-geist text-sm font-medium text-notion-pink hover:underline"
              >
                Browse available courses
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}