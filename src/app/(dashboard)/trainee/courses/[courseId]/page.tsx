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
    <main className="bg-notion-background-light min-h-screen px-notion-md py-notion-lg dark:bg-notion-background-dark sm:px-notion-lg">
      <div className="mx-auto max-w-[1400px] space-y-notion-lg">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/trainee"
            className="shadow-notion-xs group inline-flex items-center gap-2 rounded-lg bg-notion-gray-light px-notion-md py-notion-sm font-geist text-base text-notion-text-light/80 transition-all hover:bg-notion-pink hover:text-white hover:shadow-notion dark:bg-notion-gray-dark dark:text-notion-text-dark/80"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-notion-md">
            <span className="shadow-notion-xs inline-flex rounded-full bg-notion-pink/10 px-notion-md py-notion-xs font-geist text-base font-medium capitalize text-notion-pink">
              {enrollment.status}
            </span>
            <span className="font-geist text-base text-notion-text-light/60 dark:text-notion-text-dark/60">
              {enrollment.progress}% Complete
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid gap-notion-lg lg:grid-cols-12">
          {/* Slides Section - Expanded to take more space */}
          <div className="space-y-notion-lg rounded-xl bg-white p-notion-lg shadow-notion transition-shadow hover:shadow-notion-hover dark:bg-notion-dark lg:col-span-9">
            <div className="space-y-notion-md">
              <h1 className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
                {enrollment.course.title}
              </h1>
              <div className="rounded-lg bg-notion-gray-light/30 p-notion-md dark:bg-notion-gray-dark/30">
                <SlideSelector slides={courseSlides} courseId={courseId} />
              </div>
            </div>
          </div>

          {/* Course Info Sidebar */}
          <div className="space-y-notion-lg lg:col-span-3">
            <div className="rounded-xl bg-white p-notion-lg shadow-notion dark:bg-notion-dark">
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
          </div>
        </div>
      </div>
    </main>
  );
}
