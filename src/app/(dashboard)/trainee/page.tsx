import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import {
  courses,
  enrollments,
  slides,
  slideProgress,
} from "~/server/db/schema";
import { eq, and, count, desc } from "drizzle-orm";
import { EnrolledCourseCard } from "~/components/dashboard/trainee/EnrolledCourseCard";
import { LearningStats } from "~/components/dashboard/trainee/LearningStats";
import { RecentProgress } from "~/components/dashboard/trainee/RecentProgress";
import { AchievementCard } from "~/components/dashboard/trainee/AchievementCard";

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

  // Fetch recent progress
  const recentProgress = await db
    .select({
      slideId: slideProgress.slideId,
      courseId: slides.courseId,
      courseTitle: courses.title,
      slideTitle: slides.title,
      completedAt: slideProgress.completedAt,
    })
    .from(slideProgress)
    .innerJoin(slides, eq(slideProgress.slideId, slides.id))
    .innerJoin(courses, eq(slides.courseId, courses.id))
    .where(
      and(
        eq(slideProgress.traineeId, session.user.id),
        eq(slideProgress.completed, true),
      ),
    )
    .orderBy(desc(slideProgress.completedAt))
    .limit(5);

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
    <main className="space-y-notion-xl p-notion-lg min-h-screen bg-notion-background dark:bg-notion-background-dark">
      {/* Welcome Header - Removed gradient, improved spacing */}
      <div className="pb-notion-lg border-b border-notion-gray-light/20 dark:border-notion-gray-dark/20">
        <div className="space-y-notion-sm">
          <h1 className="font-geist text-4xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            Welcome back, {session.user.name}
          </h1>
          <p className="font-geist text-xl text-notion-text-light/70 dark:text-notion-text-dark/70">
            Track your learning progress and continue your courses
          </p>
        </div>
      </div>

      {/* Learning Stats */}
      <LearningStats
        totalCourses={totalCourses}
        completedCourses={completedCourses}
        inProgressCourses={inProgressCourses}
        totalSlides={totalSlides[0]?.count ?? 0}
      />

      {/* Main Content Grid */}
      <div className="gap-notion-xl grid grid-cols-1 lg:grid-cols-3">
        {/* Enrolled Courses Section */}
        <div className="space-y-notion-lg lg:col-span-2">
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

        {/* Sidebar */}
        <div className="space-y-notion-lg">
          <RecentProgress
            items={
              recentProgress.filter(
                (item) => item.completedAt !== null,
              ) as Array<
                (typeof recentProgress)[number] & { completedAt: Date }
              >
            }
          />
          <AchievementCard
            completedCourses={completedCourses}
            totalSlides={totalSlides[0]?.count ?? 0}
            learningStreak={3} // You can implement streak tracking logic
          />
        </div>
      </div>
    </main>
  );
}
