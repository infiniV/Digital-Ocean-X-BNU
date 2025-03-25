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
    <main className="min-h-screen bg-notion-background p-notion-lg transition-colors duration-200 dark:bg-notion-background-dark">
      <div className="mx-auto max-w-7xl space-y-notion-xl">
        {/* Welcome Header - Clean and minimal */}
        <div className="border-b border-notion-gray-light/20 pb-notion-lg transition-colors dark:border-notion-gray-dark/20">
          <div className="space-y-notion-sm">
            <h1 className="font-geist text-3xl font-bold tracking-tight text-notion-text-light transition-colors dark:text-notion-text-dark sm:text-4xl">
              Welcome back, {session.user.name}
            </h1>
            <p className="font-geist text-lg text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70 sm:text-xl">
              Track your learning progress and continue your courses
            </p>
          </div>
        </div>

        {/* Learning Stats with enhanced animation */}
        <div className="animate-fade-in">
          <LearningStats
            totalCourses={totalCourses}
            completedCourses={completedCourses}
            inProgressCourses={inProgressCourses}
            totalSlides={totalSlides[0]?.count ?? 0}
          />
        </div>

        {/* Main Content Grid - Responsive layout */}
        <div className="grid gap-notion-xl md:grid-cols-2 lg:grid-cols-3">
          {/* Enrolled Courses Section */}
          <div className="space-y-notion-lg md:col-span-2">
            <div className="flex flex-col justify-between gap-notion-sm sm:flex-row sm:items-center">
              <h2 className="font-geist text-2xl font-semibold text-notion-text-light transition-colors dark:text-notion-text-dark">
                My Courses
              </h2>
              <Link
                href="/courses"
                className="group inline-flex items-center gap-1.5 rounded-lg bg-notion-accent/10 px-notion-md py-notion-sm font-geist text-base font-medium text-notion-accent transition-all hover:bg-notion-accent hover:text-white"
              >
                Browse more courses
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="grid animate-slide-in gap-notion-md sm:grid-cols-2">
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
              <div className="flex animate-scale-in flex-col items-center gap-notion-md rounded-xl border border-dashed border-notion-disabled bg-notion-gray-light/5 p-notion-xl text-center transition-colors dark:border-notion-disabled-dark dark:bg-notion-gray-dark/5">
                <p className="font-geist text-lg text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70">
                  You are not enrolled in any courses yet.
                </p>
                <Link
                  href="/courses"
                  className="group inline-flex items-center gap-1.5 rounded-lg bg-notion-accent/10 px-notion-md py-notion-sm font-geist text-base font-medium text-notion-accent transition-all hover:bg-notion-accent hover:text-white"
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
        </div>
        {/* Sidebar with enhanced animations */}
        <div className="space-y-notion-lg">
          <div className="animate-slide-in [animation-delay:200ms]">
            <RecentProgress
              items={
                recentProgress.filter(
                  (item) => item.completedAt !== null,
                ) as Array<
                  (typeof recentProgress)[number] & { completedAt: Date }
                >
              }
            />
          </div>
          <div className="animate-slide-in [animation-delay:400ms]">
            <AchievementCard
              completedCourses={completedCourses}
              totalSlides={totalSlides[0]?.count ?? 0}
              learningStreak={3}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
