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
    <main className="space-y-notion-xl p-notion-lg min-h-screen">
      {/* Back Navigation */}
      <Link
        href="/trainee"
        className="px-notion-md py-notion-sm inline-flex items-center gap-2 rounded-lg bg-notion-gray-light/10 font-geist text-base text-notion-text-light/80 transition-all hover:bg-notion-pink hover:text-white dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Course Header */}
      <div className="space-y-notion-md pb-notion-lg border-b border-notion-gray-light/20 dark:border-notion-gray-dark/20">
        <div className="gap-notion-md flex items-center">
          <span className="px-notion-md py-notion-xs inline-flex rounded-full bg-notion-pink/10 font-geist text-base font-medium capitalize text-notion-pink">
            {enrollment.status}
          </span>
          <span className="font-geist text-base text-notion-text-light/60 dark:text-notion-text-dark/60">
            {enrollment.progress}% Complete
          </span>
        </div>

        <h1 className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
          {enrollment.course.title}
        </h1>

        <div className="gap-notion-lg flex items-center">
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
      <div className="gap-notion-xl grid grid-cols-1 lg:grid-cols-3">
        {/* Content navigation and viewer - Takes up 2 columns on large screens */}
        <div className="lg:col-span-2 lg:row-span-2">
          <div className="space-y-4">
            <h2 className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              Course Content
            </h2>
            <SlideSelector slides={courseSlides} courseId={courseId} />
          </div>
        </div>
      </div>
    </main>
  );
}
