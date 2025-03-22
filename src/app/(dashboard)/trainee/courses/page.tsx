import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { enrollments } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { EnrolledCourseCard } from "~/components/dashboard/trainee/EnrolledCourseCard";
export default async function TraineeCoursesPage() {
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

  return (
    <div className="animate-fade-in space-y-notion-xl p-4 sm:p-6 lg:col-span-2 lg:p-8">
      <div className="flex flex-col gap-notion-sm sm:flex-row sm:items-center sm:justify-between">
        <h2 className="relative font-geist text-2xl font-semibold text-notion-text-light after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-12 after:rounded-full after:bg-notion-pink after:content-[''] dark:text-notion-text-dark">
          My Courses
        </h2>
        <Link
          href="/courses"
          className="shadow-notion-xs group flex w-fit items-center gap-1.5 rounded-lg bg-gradient-to-r from-notion-pink/10 to-notion-pink/5 px-notion-md py-notion-sm font-geist text-base font-medium text-notion-pink transition-all hover:from-notion-pink hover:to-notion-pink hover:text-white hover:shadow-notion dark:from-notion-pink/20 dark:to-notion-pink/10"
        >
          Browse more courses
          <ChevronRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="grid animate-slide-in gap-notion-lg sm:grid-cols-2">
          {enrolledCourses.map((enrollment, index) => (
            <div
              key={enrollment.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EnrolledCourseCard
                course={enrollment.course}
                enrollment={{
                  status: enrollment.status ?? "pending",
                  progress: enrollment.progress ?? 0,
                  enrolledAt: enrollment.enrolledAt ?? new Date(),
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-scale-in rounded-xl border border-dashed border-notion-disabled bg-gradient-to-b from-notion-gray-light/10 to-notion-gray-light/5 p-notion-xl text-center shadow-notion transition-shadow hover:shadow-notion-hover dark:border-notion-disabled-dark dark:from-notion-gray-dark/10 dark:to-notion-gray-dark/5">
          <p className="mb-notion-md font-geist text-lg font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            You are not enrolled in any courses yet.
          </p>
          <Link
            href="/courses"
            className="group inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-notion-pink to-notion-pink/90 px-notion-md py-notion-sm font-geist text-base font-medium text-white shadow-notion transition-all hover:shadow-notion-hover"
          >
            Browse courses
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      )}
    </div>
  );
}
