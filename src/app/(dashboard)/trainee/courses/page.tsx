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
    <div className="space-y-notion-lg p-8 lg:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
          My Courses
        </h2>
        <Link
          href="/courses"
          className="px-notion-md py-notion-sm group flex items-center gap-1.5 rounded-lg bg-notion-pink/5 font-geist text-base font-medium text-notion-pink transition-all hover:bg-notion-pink hover:text-white"
        >
          Browse more courses
          <ChevronRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      {enrolledCourses.length > 0 ? (
        <div className="gap-notion-md grid sm:grid-cols-2">
          {enrolledCourses.map((enrollment) => (
            <EnrolledCourseCard
              key={enrollment.id}
              course={enrollment.course}
              enrollment={{
                status: enrollment.status ?? "pending",
                progress: enrollment.progress ?? 0,
                enrolledAt: enrollment.enrolledAt ?? new Date(),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="gap-notion-md border-notion-disabled p-notion-xl dark:border-notion-disabled-dark flex flex-col items-center rounded-xl border border-dashed bg-notion-gray-light/5 text-center dark:bg-notion-gray-dark/5">
          <p className="font-geist text-lg text-notion-text-light/70 dark:text-notion-text-dark/70">
            You are not enrolled in any courses yet.
          </p>
          <Link
            href="/courses"
            className="px-notion-md py-notion-sm group flex items-center gap-1.5 rounded-lg bg-notion-pink/5 font-geist text-base font-medium text-notion-pink transition-all hover:bg-notion-pink hover:text-white"
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
