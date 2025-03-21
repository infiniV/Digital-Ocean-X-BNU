import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Clock, BookOpen, CalendarDays } from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses, slides } from "~/server/db/schema";
import { eq, count } from "drizzle-orm";
import { CoursePreview } from "./_components/CoursePreview";
import { EnrollButton } from "./_components/EnrollButton";

// Default gradient for courses without cover images
const defaultCoverGradient =
  "linear-gradient(135deg, #8a63d2 0%, #e23a3a 100%)";

interface CoursePreviewPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePreviewPage({
  params,
}: CoursePreviewPageProps) {
  const { courseId } = await params;
  const session = await auth();
  const isTrainer = session?.user?.role === "trainer";

  // Fetch course data with related information
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      trainer: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // If course doesn't exist, show a 404 page
  if (!course) {
    notFound();
  }

  // Get slide count
  const slideCountResult = await db
    .select({ count: count() })
    .from(slides)
    .where(eq(slides.courseId, courseId));

  const slideCount = slideCountResult[0]?.count ?? 0;

  // Format date
  const formattedDate = course.createdAt
    ? new Date(course.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Date not available";

  // Check if course is published
  const isPublished = course.status === "published";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="min-h-screen bg-notion-background pb-24 dark:bg-notion-background-dark">
        {/* Trainer backlink - only shown to trainers */}
        {isTrainer && (
          <div className="bg-notion-background py-4 shadow-sm dark:bg-notion-background-dark dark:shadow-gray-900/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                href={`/trainer/courses/${courseId}`}
                className="flex w-fit items-center gap-2 rounded-md bg-notion-gray-light/10 px-4 py-2 font-geist text-sm font-medium text-notion-text-light/70 transition-all hover:bg-notion-pink/10 hover:text-notion-pink dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/70 dark:hover:bg-notion-pink/20 dark:hover:text-notion-pink"
              >
                <ChevronLeft size={16} />
                <span>Back to Course Management</span>
              </Link>
            </div>
          </div>
        )}

        {/* Course Header */}
        <header className="relative mb-12 overflow-hidden bg-white py-16 shadow-sm dark:bg-notion-gray-dark/30">
          <div className="absolute inset-0 z-0 opacity-20">
            {course.coverImageUrl ? (
              <Image
                src={course.coverImageUrl}
                alt=""
                fill
                className="object-cover object-center"
                priority
              />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: defaultCoverGradient }}
              ></div>
            )}
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Cover Image */}
              <div className="aspect-video overflow-hidden rounded-lg border border-notion-gray-light/10 bg-white shadow-md dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/40 md:col-span-1">
                {course.coverImageUrl ? (
                  <Image
                    src={course.coverImageUrl}
                    alt={course.title}
                    width={800}
                    height={450}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ background: defaultCoverGradient }}
                  >
                    <span className="text-3xl font-bold text-white opacity-70">
                      {course.title.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="md:col-span-2">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      course.status === "published"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                    }`}
                  >
                    {course.status === "published"
                      ? "Published"
                      : course.status
                        ? course.status
                            .replace("_", " ")
                            .charAt(0)
                            .toUpperCase() +
                          course.status.replace("_", " ").slice(1)
                        : "Draft"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-notion-gray-light/10 px-2.5 py-1 text-xs font-medium text-notion-text-light/70 dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/70">
                    <CalendarDays size={10} />
                    {formattedDate}
                  </span>
                </div>

                <h1 className="mb-3 font-geist text-2xl font-bold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
                  {course.title}
                </h1>

                <p className="mb-4 font-geist text-base text-notion-text-light/80 dark:text-notion-text-dark/80">
                  {course.shortDescription}
                </p>

                <div className="mb-6 flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 rounded-md bg-notion-gray-light/10 px-3 py-1.5 text-sm text-notion-text-light/80 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80">
                    <Clock size={16} className="text-notion-pink" />
                    <span className="capitalize">{course.skillLevel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-md bg-notion-gray-light/10 px-3 py-1.5 text-sm text-notion-text-light/80 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80">
                    <BookOpen size={16} className="text-notion-blue" />
                    <span>
                      {slideCount} {slideCount === 1 ? "Slide" : "Slides"}
                    </span>
                  </div>
                </div>

                {/* Instructor info */}
                {course.trainer && (
                  <div className="flex items-center gap-4 rounded-lg bg-notion-gray-light/10 p-4 dark:bg-notion-gray-dark/20">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-notion-gray-light/20 bg-notion-gray-light/10 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/40">
                      {course.trainer.image ? (
                        <Image
                          src={course.trainer.image}
                          alt={course.trainer.name ?? "Instructor"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-notion-pink text-sm font-semibold uppercase text-white">
                          {course.trainer.name?.[0] ?? "T"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-geist text-sm font-medium text-notion-text-light/60 dark:text-notion-text-dark/60">
                        Course Instructor
                      </p>
                      <p className="font-geist text-base font-semibold text-notion-text-light dark:text-notion-text-dark">
                        {course.trainer.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main course content */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Left column: Course content */}
            <div className="md:col-span-2">
              <div className="mb-12">
                <h2 className="mb-6 font-geist text-2xl font-bold text-notion-text-light dark:text-notion-text-dark">
                  About This Course
                </h2>
                {course.description ? (
                  <div className="overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
                    <div className="prose prose-notion dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap font-geist text-notion-text-light/80 dark:text-notion-text-dark/80">
                        {course.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-notion-gray-light/30 bg-white p-6 text-center dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20">
                    <p className="italic text-notion-text-light/60 dark:text-notion-text-dark/60">
                      No detailed description available for this course.
                    </p>
                  </div>
                )}
              </div>

              {/* Course content preview */}
              <CoursePreview courseId={courseId} />
            </div>

            {/* Right column: Enrollment options */}
            <div className="md:col-span-1">
              <div className="sticky top-8 overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
                <div className="border-b border-notion-gray-light/20 bg-notion-gray-light/5 p-6 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/80">
                  <h3 className="font-geist text-xl font-bold text-notion-text-light dark:text-notion-text-dark">
                    Enroll in this Course
                  </h3>
                </div>

                <div className="p-6">
                  {/* Use our client-side EnrollButton component */}
                  <EnrollButton
                    courseId={courseId}
                    isTrainer={isTrainer}
                    isPublished={isPublished}
                  />

                  <hr className="my-6 border-notion-gray-light/20 dark:border-notion-gray-dark/20" />

                  {/* Course info */}
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-notion-pink/10 text-notion-pink">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span className="text-notion-text-light/80 dark:text-notion-text-dark/80">
                        Structured curriculum for {course.skillLevel} level
                        learners
                      </span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-notion-pink/10 text-notion-pink">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span className="text-notion-text-light/80 dark:text-notion-text-dark/80">
                        Downloadable resources and materials
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
