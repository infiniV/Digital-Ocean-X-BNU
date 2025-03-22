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
    <main className="min-h-screen animate-fade-in space-y-notion-xl px-4 py-notion-lg sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-notion-md">
        <Link
          href="/admin/courses"
          className="group mb-notion-lg inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-all duration-200 hover:text-notion-pink dark:text-notion-text-dark/70"
        >
          <ChevronLeft
            size={16}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to Courses
        </Link>

        <div className="flex items-start justify-between gap-notion-md">
          <div className="animate-slide-in">
            <h1 className="font-geist text-2xl font-semibold leading-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
              {course.title}
            </h1>
            <p className="mt-notion-xs font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70">
              {course.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-notion-sm">
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
      <div className="grid grid-cols-1 gap-notion-xl lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Course Details */}
          <div className="space-y-notion-2xl">
            {/* Statistics */}
            <div className="grid grid-cols-1 gap-notion-lg sm:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-gradient-to-br from-white to-notion-gray-light/5 p-notion-lg shadow-notion transition-all duration-300 hover:border-notion-pink/30 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-gradient-to-br dark:from-notion-gray-dark/50 dark:to-notion-gray-dark/30">
                <div className="absolute inset-0 bg-gradient-to-br from-notion-pink/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-notion-pink-dark/10" />
                <div className="mb-notion-md inline-flex h-14 w-14 items-center justify-center rounded-xl bg-notion-pink-light/20 text-notion-pink ring-2 ring-notion-pink/10 transition-all duration-300 group-hover:scale-105 group-hover:bg-notion-pink-light/30 group-hover:ring-notion-pink/20 dark:bg-notion-pink-dark/20 dark:ring-notion-pink-dark/10 dark:group-hover:bg-notion-pink-dark/30">
                  <Users className="h-7 w-7 animate-float" />
                </div>
                <p className="font-geist text-sm font-medium tracking-wide text-notion-text-light/70 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/70 dark:group-hover:text-notion-pink-dark">
                  Total Enrollments
                </p>
                <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light transition-colors group-hover:text-notion-pink dark:text-notion-text-dark dark:group-hover:text-notion-pink-dark">
                  {stats.totalEnrollments}
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-gradient-to-br from-white to-notion-gray-light/5 p-notion-lg shadow-notion transition-all duration-300 hover:border-blue-300/30 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-gradient-to-br dark:from-notion-gray-dark/50 dark:to-notion-gray-dark/30">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-900/10" />
                <div className="mb-notion-md inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100/90 text-blue-600 ring-2 ring-blue-200/50 transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-100 group-hover:ring-blue-300/50 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800/50">
                  <Clock className="h-7 w-7 animate-float" />
                </div>
                <p className="font-geist text-sm font-medium tracking-wide text-notion-text-light/70 transition-colors group-hover:text-blue-600 dark:text-notion-text-dark/70 dark:group-hover:text-blue-400">
                  Active Learners
                </p>
                <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light transition-colors group-hover:text-blue-600 dark:text-notion-text-dark dark:group-hover:text-blue-400">
                  {stats.activeEnrollments}
                </p>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-gradient-to-br from-white to-notion-gray-light/5 p-notion-lg shadow-notion transition-all duration-300 hover:border-green-300/30 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-gradient-to-br dark:from-notion-gray-dark/50 dark:to-notion-gray-dark/30">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-green-900/10" />
                <div className="mb-notion-md inline-flex h-14 w-14 items-center justify-center rounded-xl bg-green-100/90 text-green-600 ring-2 ring-green-200/50 transition-all duration-300 group-hover:scale-105 group-hover:bg-green-100 group-hover:ring-green-300/50 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800/50">
                  <GraduationCap className="h-7 w-7 animate-float" />
                </div>
                <p className="font-geist text-sm font-medium tracking-wide text-notion-text-light/70 transition-colors group-hover:text-green-600 dark:text-notion-text-dark/70 dark:group-hover:text-green-400">
                  Completions
                </p>
                <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light transition-colors group-hover:text-green-600 dark:text-notion-text-dark dark:group-hover:text-green-400">
                  {stats.completions}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="group relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white p-8 shadow-notion transition-all duration-300 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
              <div className="absolute inset-0 bg-gradient-to-br from-notion-pink/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-notion-pink-dark/10" />
              <h2 className="mb-6 font-geist text-xl font-semibold text-notion-text-light transition-colors group-hover:text-notion-pink dark:text-notion-text-dark dark:group-hover:text-notion-pink-dark">
                Course Description
              </h2>
              <p className="whitespace-pre-wrap font-geist leading-relaxed text-notion-text-light/90 dark:text-notion-text-dark/90">
                {course.description}
              </p>
            </div>

            {/* Content List */}
            <div className="group relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white shadow-notion transition-all duration-300 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
              <div className="absolute inset-0 bg-gradient-to-br from-notion-pink/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-notion-pink-dark/10" />
              <div className="border-b border-notion-gray-light/20 px-8 py-6 dark:border-notion-gray-dark/20">
                <div className="flex items-center justify-between">
                  <h2 className="font-geist text-xl font-semibold text-notion-text-light transition-colors group-hover:text-notion-pink dark:text-notion-text-dark dark:group-hover:text-notion-pink-dark">
                    Course Content
                  </h2>
                  <span className="animate-pulse-slow rounded-full bg-notion-pink/10 px-4 py-1.5 font-geist text-sm font-medium text-notion-pink ring-1 ring-notion-pink/20 transition-colors group-hover:bg-notion-pink/20 group-hover:ring-notion-pink/30 dark:bg-notion-pink-dark/20 dark:text-notion-pink-dark dark:ring-notion-pink-dark/30">
                    {course.slides.length} slides
                  </span>
                </div>
              </div>

              <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
                {course.slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="group/slide relative flex items-center justify-between px-8 py-6 transition-colors hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/30"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-notion-gray-light/10 ring-2 ring-notion-gray-light/5 transition-all duration-300 group-hover/slide:bg-notion-pink/10 group-hover/slide:ring-notion-pink/20 dark:bg-notion-gray-dark/30 dark:ring-notion-gray-dark/20 dark:group-hover/slide:bg-notion-pink-dark/20">
                        <Layers className="h-5 w-5 text-notion-text-light/50 transition-colors group-hover/slide:text-notion-pink dark:text-notion-text-dark/50 dark:group-hover/slide:text-notion-pink-dark" />
                      </div>
                      <div className="transform transition-all duration-200 group-hover/slide:translate-x-1">
                        <h3 className="font-geist text-base font-medium text-notion-text-light transition-colors group-hover/slide:text-notion-pink dark:text-notion-text-dark dark:group-hover/slide:text-notion-pink-dark">
                          {slide.title}
                        </h3>
                        {slide.description && (
                          <p className="mt-1 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                            {slide.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-geist text-sm text-notion-text-light/50 dark:text-notion-text-dark/50">
                      Slide {index + 1}
                    </p>
                  </div>
                ))}

                {course.slides.length === 0 && (
                  <div className="px-8 py-12 text-center">
                    <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
                      No content has been added to this course yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trainer Info */}
          <div className="group relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-notion transition-all duration-300 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-notion-pink/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-notion-pink-dark/10" />

            <h2 className="relative mb-6 font-geist text-lg font-semibold text-notion-text-light transition-colors dark:text-notion-text-dark">
              Course Trainer
            </h2>

            <div className="relative flex items-center gap-4">
              {course.trainer.image ? (
                <div className="group/image relative transform transition-transform duration-300 group-hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.trainer.image}
                    alt={course.trainer.name ?? ""}
                    className="h-full w-full rounded-full object-cover ring-2 ring-notion-gray-light/10 transition-shadow dark:ring-notion-gray-dark/20"
                  />
                  <div className="absolute inset-0 rounded-full bg-notion-pink/10 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100 dark:bg-notion-pink-dark/20" />
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-notion-gray-light/10 transition-colors group-hover:bg-notion-pink/10 dark:bg-notion-gray-dark/30 dark:group-hover:bg-notion-pink-dark/20">
                  <Users className="h-7 w-7 text-notion-text-light/50 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/50 dark:group-hover:text-notion-pink-dark" />
                </div>
              )}

              <div className="transform space-y-1 transition-all duration-200 group-hover:translate-x-1">
                <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                  {course.trainer.name}
                </h3>
                <p className="font-geist text-sm tracking-wide text-notion-text-light/70 dark:text-notion-text-dark/70">
                  {course.trainer.email}
                </p>
              </div>
            </div>

            <div className="relative mt-6 space-y-4">
              <hr className="border-notion-gray-light/10 dark:border-notion-gray-dark/10" />
              <Link
                href={`/admin/trainers/${course.trainer.id}`}
                className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-lg border border-notion-gray-light/20 bg-white px-4 py-3 font-geist text-sm font-medium text-notion-text-light transition-all duration-200 hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/80 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink"
              >
                View Trainer Profile
                <span className="transform transition-transform duration-200 group-hover/btn:translate-x-0.5">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Course Info */}
          <div className="group relative overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-notion transition-all duration-300 hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-notion-pink/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-notion-pink-dark/10" />

            <h2 className="relative mb-6 font-geist text-lg font-semibold text-notion-text-light transition-colors dark:text-notion-text-dark">
              Course Information
            </h2>

            <div className="relative space-y-5">
              <div className="transform transition-all duration-200 hover:translate-x-1">
                <p className="font-geist text-sm font-medium uppercase tracking-wider text-notion-text-light/60 dark:text-notion-text-dark/60">
                  Skill Level
                </p>
                <p className="mt-1 font-geist text-base text-notion-text-light dark:text-notion-text-dark">
                  {course.skillLevel}
                </p>
              </div>

              <div className="transform transition-all duration-200 hover:translate-x-1">
                <p className="font-geist text-sm font-medium uppercase tracking-wider text-notion-text-light/60 dark:text-notion-text-dark/60">
                  Created
                </p>
                <p className="mt-1 font-geist text-base text-notion-text-light dark:text-notion-text-dark">
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
                <p className="font-geist text-sm font-medium uppercase tracking-wider text-notion-text-light/60 dark:text-notion-text-dark/60">
                  Last Updated
                </p>
                <p className="mt-1 font-geist text-base text-notion-text-light dark:text-notion-text-dark">
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
                <p className="font-geist text-sm font-medium uppercase tracking-wider text-notion-text-light/60 dark:text-notion-text-dark/60">
                  Featured Status
                </p>
                <p className="mt-1 inline-flex items-center gap-2 font-geist text-base">
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

            <hr className="my-6 border-notion-gray-light/10 dark:border-notion-gray-dark/10" />

            <Link
              href={`/courses/${course.slug}/preview`}
              className="group/btn relative inline-flex w-full items-center justify-center gap-2 rounded-lg border border-notion-gray-light/20 bg-white px-4 py-3 font-geist text-sm font-medium text-notion-text-light transition-all duration-200 hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/80 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink"
            >
              Preview Course
              <span className="transform transition-transform duration-200 group-hover/btn:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
