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

// Utility: Generate a unique gradient based on course ID
function getUniqueGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = Math.abs(hash * 13) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 70%, 65%) 0%, hsl(${h2}, 80%, 75%) 100%)`;
}

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
      <main className="min-h-screen bg-notion-background bg-gradient-to-b from-notion-background to-notion-gray-light/30 pb-24 transition-colors duration-300 dark:bg-notion-background-dark dark:from-notion-background-dark dark:to-notion-gray-dark/20">
        {/* Trainer backlink - only shown to trainers */}
        {isTrainer && (
          <div className="bg-notion-background py-4 shadow-sm backdrop-blur-sm transition-all dark:bg-notion-background-dark/90 dark:shadow-gray-900/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Link
                href={`/trainer/courses/`}
                className="flex w-fit items-center gap-2 rounded-md bg-notion-gray-light/20 px-notion-md py-notion-xs font-geist text-sm font-medium text-notion-text-light/70 transition-all hover:-translate-x-0.5 hover:bg-notion-pink-light/30 hover:text-notion-accent hover:shadow-notion-xs dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/70 dark:hover:bg-notion-pink/20 dark:hover:text-notion-accent-light"
              >
                <ChevronLeft size={16} className="animate-pulse-slow" />
                <span>Back to Courses</span>
              </Link>
            </div>
          </div>
        )}

        {/* Course Header */}
        <header className="relative mb-notion-xl overflow-hidden bg-white py-notion-xl shadow-notion transition-all dark:bg-notion-gray-dark/50 dark:shadow-none">
          <div className="absolute inset-0 z-0 opacity-20 transition-opacity duration-500 hover:opacity-25">
            {course.coverImageUrl ? (
              <Image
                src={course.coverImageUrl}
                alt=""
                fill
                className="object-cover object-center filter transition-all duration-700 hover:scale-105"
                priority
              />
            ) : (
              <div
                className="h-full w-full transition-all duration-700 hover:scale-105"
                style={{ background: getUniqueGradient(course.id) }}
              ></div>
            )}
          </div>

          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-notion-lg md:grid-cols-3">
              {/* Cover Image */}
              <div className="aspect-video overflow-hidden rounded-xl border border-notion-gray-light/10 bg-white/70 shadow-notion backdrop-blur-sm transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/40 md:col-span-1">
                {course.coverImageUrl ? (
                  <Image
                    src={course.coverImageUrl}
                    alt={course.title}
                    width={800}
                    height={450}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center transition-transform duration-500 hover:scale-105"
                    style={{ background: getUniqueGradient(course.id) }}
                  >
                    <span className="text-3xl font-bold text-white opacity-70 transition-opacity hover:opacity-90">
                      {course.title.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="md:col-span-2">
                <div className="mb-notion-sm flex flex-wrap gap-notion-xs">
                  {" "}
                  <span
                    className={`inline-flex animate-fade-in items-center rounded-full px-notion-sm py-1 text-sm font-semibold ${
                      course.status === "published"
                        ? "bg-green-100 text-green-800 shadow-sm dark:bg-green-900/40 dark:text-green-200 dark:shadow-notion-xs"
                        : "bg-yellow-100 text-yellow-800 shadow-sm dark:bg-yellow-900/40 dark:text-yellow-200 dark:shadow-notion-xs"
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
                  <span className="inline-flex animate-fade-in items-center gap-1 rounded-full bg-notion-gray-light px-notion-sm py-1 text-sm font-medium text-notion-text-light shadow-sm backdrop-blur-sm transition-all hover:bg-notion-gray dark:bg-notion-gray-dark dark:text-notion-text-dark dark:shadow-notion-xs dark:hover:bg-notion-gray-dark/80">
                    <CalendarDays size={10} className="text-notion-accent" />
                    {formattedDate}
                  </span>
                </div>
                <h1 className="mb-notion-xs animate-slide-in font-geist text-2xl font-extrabold leading-tight tracking-tight text-notion-text-light transition-colors dark:text-notion-text-dark sm:text-3xl">
                  {course.title}
                </h1>
                <p className="mb-notion-md animate-slide-in font-geist text-base leading-relaxed text-notion-text-light/80 delay-100 dark:text-notion-text-dark/80">
                  {course.shortDescription}
                </p>{" "}
                <div className="mb-notion-lg flex flex-wrap gap-notion-sm">
                  <div className="flex animate-slide-in items-center gap-1.5 rounded-md bg-notion-gray px-notion-sm py-notion-xs text-sm font-medium text-notion-text transition-all delay-200 hover:bg-notion-accent-light/30 hover:text-notion-accent dark:bg-notion-gray-dark dark:text-notion-text-dark dark:hover:bg-notion-accent/20 dark:hover:text-notion-accent-light">
                    <Clock size={16} className="text-notion-accent" />
                    <span className="capitalize">{course.skillLevel}</span>
                  </div>
                  <div className="flex animate-slide-in items-center gap-1.5 rounded-md bg-notion-gray px-notion-sm py-notion-xs text-sm font-medium text-notion-text transition-all delay-300 hover:bg-notion-accent-light/30 hover:text-notion-accent dark:bg-notion-gray-dark dark:text-notion-text-dark dark:hover:bg-notion-accent/20 dark:hover:text-notion-accent-light">
                    <BookOpen size={16} className="text-notion-accent" />
                    <span>
                      {slideCount} {slideCount === 1 ? "Slide" : "Slides"}
                    </span>
                  </div>
                </div>{" "}
                {/* Instructor info */}
                {course.trainer && (
                  <div className="delay-400 flex animate-scale-in items-center gap-notion-md rounded-lg bg-notion-gray p-notion-md backdrop-blur-sm transition-all hover:bg-notion-gray-light hover:shadow-notion-xs dark:bg-notion-gray-dark dark:hover:bg-notion-gray-dark/80 dark:hover:shadow-notion">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-notion-accent-light/20 bg-notion-gray-light shadow-notion-xs transition-transform hover:scale-105 dark:border-notion-accent/20 dark:bg-notion-gray-dark">
                      {course.trainer.image ? (
                        <Image
                          src={course.trainer.image}
                          alt={course.trainer.name ?? "Instructor"}
                          fill
                          className="object-cover transition-opacity hover:opacity-90"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-notion-accent text-sm font-bold uppercase text-white">
                          {course.trainer.name?.[0] ?? "T"}
                        </div>
                      )}
                    </div>{" "}
                    <div>
                      <p className="font-geist text-sm font-medium text-notion-text/70 transition-colors dark:text-notion-text-dark/70">
                        Course Instructor
                      </p>
                      <p className="font-geist text-base font-bold tracking-tight text-notion-text transition-colors dark:text-notion-text-dark">
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
          <div className="grid grid-cols-1 gap-notion-xl md:grid-cols-3">
            {/* Left column: Course content */}
            <div className="md:col-span-2">
              <div className="mb-notion-xl">
                <h2 className="mb-notion-md font-geist text-2xl font-bold tracking-tight text-notion-text-light transition-colors dark:text-notion-text-dark">
                  About This Course
                </h2>{" "}
                {course.description ? (
                  <div className="animate-fade-in overflow-hidden rounded-xl border border-notion-gray/20 bg-white/70 p-notion-lg shadow-notion backdrop-blur-sm transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark">
                    <div className="prose prose-notion dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap font-geist leading-relaxed text-notion-text/90 dark:text-notion-text-dark/90">
                        {course.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fade-in rounded-xl border border-dashed border-notion-gray/30 bg-white/50 p-notion-lg text-center backdrop-blur-sm transition-all dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark">
                    <p className="italic text-notion-text/60 dark:text-notion-text-dark/60">
                      No detailed description available for this course.
                    </p>
                  </div>
                )}
              </div>{" "}
              {/* Course content preview */}
              <div className="animate-slide-up delay-200">
                {session?.user ? (
                  <CoursePreview courseId={courseId} />
                ) : (
                  <div className="overflow-hidden rounded-xl border border-notion-gray/20 bg-white/70 p-notion-lg shadow-notion backdrop-blur-sm transition-all dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark">
                    <div className="flex flex-col items-center justify-center text-center">
                      <h3 className="mb-4 font-geist text-xl font-bold tracking-tight text-notion-text-light transition-colors dark:text-notion-text-dark">
                        Sign in to View Course Content
                      </h3>
                      <p className="mb-6 text-notion-text-light/80 dark:text-notion-text-dark/80">
                        Please sign in to access the course materials and
                        preview slides.
                      </p>
                      <Link
                        href="/auth/signin"
                        className="inline-block rounded-md bg-notion-pink px-notion-md py-notion-sm font-geist text-base font-semibold text-notion-background-light transition-colors hover:bg-notion-pink-light hover:text-notion-text-light dark:bg-notion-pink-dark dark:text-notion-background-dark dark:hover:bg-notion-pink"
                      >
                        Sign in
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>{" "}
            {/* Right column: Enrollment options */}
            <div className="md:col-span-1">
              {session?.user && (
                <div className="sticky top-8 animate-slide-in overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white/80 shadow-notion transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
                  <div className="border-b border-notion-gray-light/20 bg-notion-gray-light/10 p-notion-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/80">
                    <h3 className="font-geist text-xl font-bold tracking-tight text-notion-text-light transition-colors dark:text-notion-text-dark">
                      Enroll in this Course
                    </h3>
                  </div>
                  <div className="p-notion-md">
                    {/* Use our client-side EnrollButton component */}
                    <EnrollButton
                      courseId={courseId}
                      isTrainer={isTrainer}
                      isPublished={isPublished}
                      isSignedIn={!!session?.user}
                    />

                    <hr className="my-notion-md border-notion-gray-light/20 dark:border-notion-gray-dark/30" />

                    {/* Course info */}
                    <ul className="space-y-notion-sm">
                      <li className="flex items-start gap-notion-sm text-sm">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-notion-accent-light/20 text-notion-accent transition-colors dark:bg-notion-accent/20 dark:text-notion-accent-light">
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
                        <span className="font-geist text-notion-text-light/80 transition-colors dark:text-notion-text-dark/90">
                          Structured curriculum for {course.skillLevel} level
                          learners
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
