import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Book, Clock, Book as BookIcon } from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses, slides } from "~/server/db/schema";
import { and, eq, count } from "drizzle-orm";
import { SlideManager } from "./_components/SlideManager";
import { DeleteCourseButton } from "../_components/DeleteCourseButton";
import { FinalizeCourseButton } from "./_components/FinalizeCourseButton";

interface CourseDetailPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const session = await auth();
  const { courseId } = await params;

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Redirect if not a trainer
  if (session.user.role !== "trainer") {
    redirect("/");
  }

  // Fetch course data and verify ownership
  const course = await db.query.courses.findFirst({
    where: and(
      eq(courses.id, courseId),
      eq(courses.trainerId, session.user.id),
    ),
  });

  // If course doesn't exist or doesn't belong to the trainer
  if (!course) {
    notFound();
  }

  // Get slide count
  const slideCountResult = await db
    .select({ count: count() })
    .from(slides)
    .where(eq(slides.courseId, courseId));

  const slideCount = slideCountResult[0]?.count ?? 0;

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-geist text-sm font-medium tracking-tight";
    switch (status) {
      case "draft":
        return (
          <span
            className={`${baseClasses} bg-yellow-100/90 text-yellow-900 backdrop-blur-sm dark:bg-yellow-900/30 dark:text-yellow-200`}
          >
            Draft
          </span>
        );
      case "published":
        return (
          <span
            className={`${baseClasses} bg-green-100/80 text-green-900 dark:bg-green-900/30 dark:text-green-200`}
          >
            Published
          </span>
        );
      case "under_review":
        return (
          <span
            className={`${baseClasses} bg-blue-100/80 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200`}
          >
            Under Review
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} bg-gray-100/80 text-gray-900 dark:bg-gray-800 dark:text-gray-200`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-10 lg:px-8 lg:py-10">
      {/* Back Navigation */}
      <Link
        href="/trainer"
        className="group inline-flex items-center gap-2 rounded-lg bg-notion-gray-light/10 px-4 py-2.5 font-geist text-sm font-medium text-notion-text-light/80 transition-all duration-200 hover:bg-notion-pink hover:text-white dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/90 dark:hover:bg-notion-pink dark:hover:text-white"
      >
        <ChevronLeft
          size={16}
          className="shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span>Back to Dashboard</span>
      </Link>

      <div className="space-y-8 lg:space-y-10">
        {/* Course Header Card */}
        <section className="animate-smooth-appear overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white/80 shadow-notion-xs backdrop-blur-sm transition-all duration-300 hover:shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
          <div className="border-b border-notion-gray-light/20 bg-notion-gray-light/5 px-5 py-6 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/90 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3">
                <h1 className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-2xl">
                  {course.title}
                </h1>
                {getStatusBadge(course.status ?? "draft")}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <FinalizeCourseButton
                  courseId={courseId}
                  status={course.status ?? "draft"}
                  slideCount={slideCount}
                />
                <DeleteCourseButton
                  courseId={courseId}
                  courseName={course.title}
                  variant="button"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-8">
            {course.shortDescription && (
              <p className="font-geist text-base leading-relaxed text-notion-text-light/90 dark:text-notion-text-dark/90">
                {course.shortDescription}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {/* Course Metrics */}
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-notion-gray-light/15 px-3 py-2 font-geist text-sm text-notion-text-light/90 transition-all hover:bg-notion-gray-light/25 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/90 dark:hover:bg-notion-gray-dark/50">
                <Clock size={15} className="shrink-0 text-notion-pink" />
                <span className="capitalize">{course.skillLevel}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-notion-gray-light/15 px-3 py-2 font-geist text-sm text-notion-text-light/90 transition-all hover:bg-notion-gray-light/25 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/90 dark:hover:bg-notion-gray-dark/50">
                <BookIcon size={15} className="shrink-0 text-notion-pink" />
                <span>
                  {slideCount} {slideCount === 1 ? "Slide" : "Slides"}
                </span>
              </div>
              {course.createdAt && (
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-notion-gray-light/15 px-3 py-2 font-geist text-sm text-notion-text-light/90 transition-all hover:bg-notion-gray-light/25 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/90 dark:hover:bg-notion-gray-dark/50">
                  <span>
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Course Content Section */}
        <section className="animate-slide-in-bottom overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white/80 shadow-notion-xs backdrop-blur-sm transition-all duration-300 hover:shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
          <div className="border-b border-notion-gray-light/20 bg-notion-gray-light/5 px-5 py-6 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/90 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-geist text-lg font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-xl">
                Course Content
              </h2>
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-notion-gray-light/15 px-3 py-2 font-geist text-sm text-notion-text-light/90 transition-all hover:bg-notion-gray-light/25 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/90 dark:hover:bg-notion-gray-dark/50">
                <Book size={15} className="shrink-0 text-notion-pink" />
                <span>
                  {slideCount} {slideCount === 1 ? "Slide" : "Slides"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <SlideManager courseId={courseId} />
          </div>
        </section>
      </div>
    </main>
  );
}
