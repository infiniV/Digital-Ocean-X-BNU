import { db } from "~/server/db";
import { courses, slides } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft, GraduationCap, Users, Clock, Layers } from "lucide-react";
import { CourseStatusSelect } from "../_components/CourseStatusSelect";
import { DeleteCourseButton } from "../_components/DeleteCourseButton";
import { notFound } from "next/navigation";

interface CourseDetailPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { courseId } = await params;

  // Get course details with related data
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    with: {
      trainer: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      slides: {
        orderBy: [desc(slides.createdAt)],
      },
      enrollments: true,
    },
  });

  if (!course) {
    notFound();
  }

  // Calculate enrollment statistics
  const stats = {
    totalEnrollments: course.enrollments.length,
    activeEnrollments: course.enrollments.filter((e) => e.status === "active")
      .length,
    completions: course.enrollments.filter((e) => e.status === "completed")
      .length,
  };

  return (
    <main className="min-h-screen animate-fade-in space-y-6 px-4 py-6 sm:space-y-notion-xl sm:px-6 sm:py-notion-lg lg:px-8">
      {/* Header */}
      <div className="space-y-4 sm:space-y-notion-md">
        <Link
          href="/admin/courses"
          className="group mb-4 inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-all duration-200 hover:text-notion-pink dark:text-notion-text-dark/70 sm:mb-notion-lg"
        >
          <ChevronLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Courses
        </Link>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:gap-notion-md">
          <div className="w-full animate-slide-in sm:w-auto">
            <h1 className="font-geist text-xl font-semibold leading-tight text-notion-text-light dark:text-notion-text-dark sm:text-2xl md:text-3xl">
              {course.title}
            </h1>
            <p className="mt-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70 sm:mt-notion-xs sm:text-base">
              {course.shortDescription}
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap sm:gap-notion-sm">
            <CourseStatusSelect
              courseId={course.id}
              currentStatus={course.status}
            />
            <DeleteCourseButton
              courseId={course.id}
              courseTitle={course.title}
            />
          </div>
        </div>
      </div>

      {/* Course Information */}
      <div className="grid grid-cols-1 gap-6 sm:gap-notion-xl lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Course Details */}
          <div className="space-y-6 sm:space-y-notion-2xl">
            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-notion-lg">
              <div className="relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white p-5 shadow-notion transition-all duration-300 hover:border-notion-pink/30 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-notion-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-notion-pink-light/20 text-notion-pink ring-2 ring-notion-pink/10 transition-all duration-300 hover:scale-105 hover:bg-notion-pink-light/30 hover:ring-notion-pink/20 dark:bg-notion-pink-dark/20 dark:ring-notion-pink-dark/10 dark:hover:bg-notion-pink-dark/30 sm:mb-notion-md sm:h-14 sm:w-14">
                  <Users className="h-6 w-6 animate-float sm:h-7 sm:w-7" />
                </div>
                <p className="font-geist text-xs font-medium tracking-wide text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70 sm:text-sm">
                  Total Enrollments
                </p>
                <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
                  {stats.totalEnrollments}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white p-5 shadow-notion transition-all duration-300 hover:border-blue-300/30 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-notion-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 ring-2 ring-blue-200/50 transition-all duration-300 hover:scale-105 hover:bg-blue-100/90 hover:ring-blue-300/50 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800/50 sm:mb-notion-md sm:h-14 sm:w-14">
                  <Clock className="h-6 w-6 animate-float sm:h-7 sm:w-7" />
                </div>
                <p className="font-geist text-xs font-medium tracking-wide text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70 sm:text-sm">
                  Active Learners
                </p>
                <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
                  {stats.activeEnrollments}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white p-5 shadow-notion transition-all duration-300 hover:border-green-300/30 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-notion-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 ring-2 ring-green-200/50 transition-all duration-300 hover:scale-105 hover:bg-green-100/90 hover:ring-green-300/50 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800/50 sm:mb-notion-md sm:h-14 sm:w-14">
                  <GraduationCap className="h-6 w-6 animate-float sm:h-7 sm:w-7" />
                </div>
                <p className="font-geist text-xs font-medium tracking-wide text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70 sm:text-sm">
                  Completions
                </p>
                <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
                  {stats.completions}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white p-5 shadow-notion transition-all duration-300 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-8">
              <h2 className="mb-4 font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark sm:mb-6 sm:text-xl">
                Course Description
              </h2>
              <p className="whitespace-pre-wrap font-geist text-sm leading-relaxed text-notion-text-light/90 dark:text-notion-text-dark/90 sm:text-base">
                {course.description}
              </p>
            </div>

            {/* Content List */}
            <div className="relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white shadow-notion transition-all duration-300 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
              <div className="border-b border-notion-gray-light/20 px-5 py-4 dark:border-notion-gray-dark/20 sm:px-8 sm:py-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-xl">
                    Course Content
                  </h2>
                  <span className="rounded-full bg-notion-pink/10 px-3 py-1 font-geist text-xs font-medium text-notion-pink ring-1 ring-notion-pink/20 dark:bg-notion-pink-dark/20 dark:text-notion-pink-dark dark:ring-notion-pink-dark/30 sm:px-4 sm:py-1.5 sm:text-sm">
                    {course.slides.length} slides
                  </span>
                </div>
              </div>

              <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
                {course.slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="relative flex flex-col px-5 py-4 transition-colors hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/30 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-notion-gray-light/10 ring-1 ring-notion-gray-light/5 transition-all duration-300 hover:bg-notion-pink/10 hover:ring-notion-pink/20 dark:bg-notion-gray-dark/30 dark:ring-notion-gray-dark/20 dark:hover:bg-notion-pink-dark/20 sm:rounded-xl sm:ring-2">
                        <Layers className="h-5 w-5 text-notion-text-light/50 transition-colors hover:text-notion-pink dark:text-notion-text-dark/50 dark:hover:text-notion-pink-dark" />
                      </div>
                      <div className="transform transition-all duration-200 hover:translate-x-1">
                        <h3 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
                          {slide.title}
                        </h3>
                        {slide.description && (
                          <p className="mt-1 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
                            {slide.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 font-geist text-xs text-notion-text-light/50 dark:text-notion-text-dark/50 sm:mt-0 sm:text-sm">
                      Slide {index + 1}
                    </p>
                  </div>
                ))}

                {course.slides.length === 0 && (
                  <div className="px-5 py-8 text-center sm:px-8 sm:py-12">
                    <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                      No content has been added to this course yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="mt-6 space-y-6 lg:mt-0">
          {/* Trainer Info */}
          <div className="relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white p-5 shadow-notion transition-all duration-300 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-6">
            <h2 className="relative mb-4 font-geist text-base font-semibold text-notion-text-light dark:text-notion-text-dark sm:mb-6 sm:text-lg">
              Course Trainer
            </h2>

            <div className="relative flex items-center gap-4">
              {course.trainer.image ? (
                <div className="relative transform transition-transform duration-300 hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.trainer.image}
                    alt={course.trainer.name ?? ""}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-notion-gray-light/10 transition-shadow dark:ring-notion-gray-dark/20 sm:h-14 sm:w-14"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-notion-gray-light/10 transition-colors hover:bg-notion-pink/10 dark:bg-notion-gray-dark/30 dark:hover:bg-notion-pink-dark/20 sm:h-14 sm:w-14">
                  <Users className="h-6 w-6 text-notion-text-light/50 transition-colors hover:text-notion-pink dark:text-notion-text-dark/50 dark:hover:text-notion-pink-dark sm:h-7 sm:w-7" />
                </div>
              )}

              <div className="transform space-y-1 transition-all duration-200 hover:translate-x-1">
                <h3 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
                  {course.trainer.name}
                </h3>
                <p className="font-geist text-xs tracking-wide text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
                  {course.trainer.email}
                </p>
              </div>
            </div>

            <div className="relative mt-4 space-y-4 sm:mt-6">
              <hr className="border-notion-gray-light/10 dark:border-notion-gray-dark/10" />
              <Link
                href={`/admin/trainers/${course.trainer.id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-notion-gray-light/20 bg-white px-3 py-2 font-geist text-xs font-medium text-notion-text-light transition-all duration-200 hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/80 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink sm:px-4 sm:py-3 sm:text-sm"
              >
                View Trainer Profile
                <span className="transform transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Course Info */}
          <div className="relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white p-5 shadow-notion transition-all duration-300 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 sm:p-6">
            <h2 className="relative mb-4 font-geist text-base font-semibold text-notion-text-light dark:text-notion-text-dark sm:mb-6 sm:text-lg">
              Course Information
            </h2>

            <div className="relative space-y-4 sm:space-y-5">
              <div className="transform transition-all duration-200 hover:translate-x-1">
                <p className="font-geist text-xs font-medium uppercase tracking-wider text-notion-text-light/60 dark:text-notion-text-dark/60 sm:text-sm">
                  Skill Level
                </p>
                <p className="mt-1 font-geist text-sm text-notion-text-light dark:text-notion-text-dark sm:text-base">
                  {course.skillLevel}
                </p>
              </div>

              <div className="transform transition-all duration-200 hover:translate-x-1">
                <p className="font-geist text-xs font-medium uppercase tracking-wider text-notion-text-light/60 dark:text-notion-text-dark/60 sm:text-sm">
                  Created
                </p>
                <p className="mt-1 font-geist text-sm text-notion-text-light dark:text-notion-text-dark sm:text-base">
                  {new Date(course.createdAt ?? "").toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>

              <div className="transform transition-all duration-200 hover:translate-x-1">
                <p className="font-geist text-xs font-medium uppercase tracking-wider text-notion-text-light/60 dark:text-notion-text-dark/60 sm:text-sm">
                  Last Updated
                </p>
                <p className="mt-1 font-geist text-sm text-notion-text-light dark:text-notion-text-dark sm:text-base">
                  {new Date(course.updatedAt ?? "").toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>

              <div className="transform transition-all duration-200 hover:translate-x-1">
                <p className="font-geist text-xs font-medium uppercase tracking-wider text-notion-text-light/60 dark:text-notion-text-dark/60 sm:text-sm">
                  Featured Status
                </p>
                <p className="mt-1 inline-flex items-center gap-2 font-geist text-sm sm:text-base">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      course.isFeatured
                        ? "bg-notion-pink dark:bg-notion-pink-dark"
                        : "bg-notion-gray-light dark:bg-notion-gray-dark"
                    }`}
                  />
                  {course.isFeatured ? "Featured" : "Not Featured"}
                </p>
              </div>
            </div>

            <hr className="my-4 border-notion-gray-light/10 dark:border-notion-gray-dark/10 sm:my-6" />

            <Link
              href={`/courses/${course.slug}/preview`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-notion-gray-light/20 bg-white px-3 py-2 font-geist text-xs font-medium text-notion-text-light transition-all duration-200 hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/80 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink sm:px-4 sm:py-3 sm:text-sm"
            >
              Preview Course
              <span className="transform transition-transform duration-200 hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
