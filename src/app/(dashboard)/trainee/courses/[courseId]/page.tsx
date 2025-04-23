import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, BookOpen, Clock } from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { slides, enrollments } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
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
  const enrollment = await db.query.enrollments
    .findFirst({
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
    })
    .catch((error: Error) => {
      if (error.message.includes("FUNCTION_PAYLOAD_TOO_LARGE")) {
        throw new Error(
          "Course content is too large to load. Please contact support.",
        );
      }
      throw error;
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
    <main className="min-h-screen bg-notion-background px-3 py-4 transition-colors duration-200 dark:bg-notion-background-dark sm:px-4 sm:py-6 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-2 lg:grid-cols-5 lg:grid-rows-7">
        {/* div1: Top Navigation Bar - full width on desktop */}
        <div className="mb-2 flex flex-col gap-3 rounded-lg bg-white/80 px-4 py-3 shadow-notion dark:bg-notion-dark/80 sm:flex-row sm:items-center sm:justify-between lg:col-span-5 lg:row-span-1 lg:row-start-1">
          <Link
            href="/trainee"
            className="group inline-flex w-fit items-center gap-1.5 rounded-lg bg-notion-gray-light/80 px-3 py-2 font-geist text-sm text-notion-text-light/80 transition-all hover:bg-notion-pink hover:text-white dark:bg-notion-gray-dark/80 dark:text-notion-text-dark/80 sm:text-base"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back
          </Link>

          <div className="flex items-center gap-3">
            <span className="inline-flex rounded-full bg-notion-pink/10 px-3 py-1 text-sm font-medium capitalize text-notion-pink sm:text-base">
              {enrollment.status}
            </span>
            <span className="text-sm text-notion-text-light/60 dark:text-notion-text-dark/60 sm:text-base">
              {enrollment.progress}% Complete
            </span>
          </div>
        </div>

        {/* div2: Course Information - right sidebar on desktop */}
        <div className="flex h-full flex-col rounded-lg bg-white p-4 shadow-notion dark:bg-notion-dark lg:col-start-5 lg:row-span-5 lg:row-start-2">
          <div className="space-y-notion-md">
            <h2 className="font-geist text-lg font-medium text-notion-text-light dark:text-notion-text-dark">
              Course Information
            </h2>
            <div className="space-y-notion-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-notion-pink" />
                <span className="text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Enrolled on{" "}
                  {enrollment.enrolledAt &&
                    new Date(enrollment.enrolledAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
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
        </div>

        {/* div3: Slides Section - main content area */}
        <div className="flex flex-col space-y-4 lg:col-span-4 lg:row-span-6 lg:row-start-2">
          {/* Course Title - Mobile */}
          <div className="block sm:hidden">
            <h1 className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              {enrollment.course.title}
            </h1>
          </div>
          {/* Course Title - Desktop */}
          <div className="hidden sm:block">
            <h1 className="mb-4 font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              {enrollment.course.title}
            </h1>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-notion transition-shadow hover:shadow-notion-hover dark:bg-notion-dark">
            <SlideSelector slides={courseSlides} courseId={courseId} />
          </div>
        </div>
        {/* div6: Bottom right for future actions/info */}
        <div className="lg:col-start-5 lg:row-span-1 lg:row-start-7"></div>
      </div>
    </main>
  );
}
