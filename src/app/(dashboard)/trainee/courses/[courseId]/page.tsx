import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, BookOpen, Clock } from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { slides, enrollments } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { CourseNotes } from "./_components/CourseNotes";
import { SlideSelector } from "./_components/SlideSelector";

interface TraineeCoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function TraineeCoursePage({
  params,
}: TraineeCoursePageProps) {
  const session = await auth();
  const { courseId } = await params;

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Redirect if not a trainee
  if (session.user.role !== "trainee") {
    redirect("/");
  }

  // Fetch course enrollment and details
  const enrollment = await db.query.enrollments.findFirst({
    where: and(
      eq(enrollments.courseId, courseId),
      eq(enrollments.traineeId, session.user.id),
    ),
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
  });

  // If not enrolled or course doesn't exist
  if (!enrollment) {
    notFound();
  }

  // Fetch all slides for this course with non-null values
  const courseSlides = await db
    .select({
      id: slides.id,
      title: slides.title,
      description: slides.description,
      fileUrl: slides.fileUrl,
      fileType: slides.fileType,
      originalFilename: slides.originalFilename,
      order: slides.order,
    })
    .from(slides)
    .where(eq(slides.courseId, courseId))
    .orderBy(slides.order)
    .then((slides) =>
      slides.map((slide) => ({
        ...slide,
        originalFilename: slide.originalFilename ?? "",
        order: slide.order ?? 0,
      })),
    );

  return (
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Navigation */}
      <Link
        href="/trainee"
        className="inline-flex items-center gap-1.5 rounded-lg bg-notion-gray-light/10 px-4 py-2 font-geist text-sm font-medium text-notion-text-light/80 transition-all hover:bg-notion-pink hover:text-white dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80 dark:hover:bg-notion-pink dark:hover:text-white"
      >
        <ChevronLeft size={16} className="shrink-0" />
        <span>Back to Dashboard</span>
      </Link>

      {/* Course Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
            {enrollment.status}
          </span>
          <span className="text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
            {enrollment.progress}% Complete
          </span>
        </div>

        <h1 className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
          {enrollment.course.title}
        </h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-notion-pink" />
            <span className="text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Enrolled on{" "}
              {enrollment.enrolledAt &&
                new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-notion-blue" />
            <span className="text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              {courseSlides.length}{" "}
              {courseSlides.length === 1 ? "Slide" : "Slides"}
            </span>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Content navigation and viewer - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2 lg:row-span-2">
          <div className="space-y-4">
            <h2 className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              Course Content
            </h2>
            <SlideSelector slides={courseSlides} courseId={courseId} />
          </div>
        </div>

        {/* Notes section - Takes up 1 column on large screens */}
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <h2 className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              My Notes
            </h2>
            {/* Note: slideId will be set by SlideSelector when a slide is selected */}
            <CourseNotes slideId="" />
          </div>
        </div>
      </div>
    </main>
  );
}
