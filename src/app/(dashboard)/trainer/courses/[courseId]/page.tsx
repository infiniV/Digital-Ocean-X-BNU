import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
    switch (status) {
      case "draft":
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
            Draft
          </span>
        );
      case "published":
        return (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
            Published
          </span>
        );
      case "under_review":
        return (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
            Under Review
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  return (
    <main className="container px-6 py-8">
      <Link
        href="/trainer"
        className="mb-6 flex items-center gap-1 font-geist text-sm text-notion-text-light/70 hover:text-notion-pink dark:text-notion-text-dark/70 dark:hover:text-notion-pink"
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              {course.title}
            </h1>
            {getStatusBadge(course.status ?? "draft")}
          </div>
          <div className="flex items-center gap-4">
            <FinalizeCourseButton
              courseId={courseId}
              status={course.status ?? "draft"}
              slideCount={slideCount}
            />
            <DeleteCourseButton courseId={courseId} courseName={course.title} />
          </div>
        </div>

        {course.shortDescription && (
          <p className="mb-4 font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
            {course.shortDescription}
          </p>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          <div className="rounded-md bg-notion-gray-light/10 px-2 py-1 font-geist text-xs text-notion-text-light/70 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/70">
            Level: {course.skillLevel}
          </div>
          <div className="rounded-md bg-notion-gray-light/10 px-2 py-1 font-geist text-xs text-notion-text-light/70 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/70">
            {slideCount} Slides
          </div>
        </div>
      </div>

      {/* Slide Manager - handles both upload and display */}
      <SlideManager courseId={courseId} />
    </main>
  );
}
