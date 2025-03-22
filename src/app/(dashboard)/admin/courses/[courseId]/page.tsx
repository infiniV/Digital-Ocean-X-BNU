import { db } from "~/server/db";
import { courses, slides } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft, GraduationCap, Users, Clock, Layers } from "lucide-react";
import { CourseStatusSelect } from "../_components/CourseStatusSelect";
import { DeleteCourseButton } from "../_components/DeleteCourseButton";
import { notFound } from "next/navigation";

interface CourseDetailPageProps {
  params: {
    courseId: string;
  };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { courseId } = params;

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
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/courses"
          className="mb-6 inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70"
        >
          <ChevronLeft size={16} />
          Back to Courses
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
              {course.title}
            </h1>
            <p className="mt-1 font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
              {course.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-3">
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
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Course Details */}
          <div className="space-y-6">
            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-notion-pink/10 text-notion-pink">
                  <Users size={20} />
                </div>
                <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Total Enrollments
                </p>
                <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                  {stats.totalEnrollments}
                </p>
              </div>

              <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <Clock size={20} />
                </div>
                <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Active Learners
                </p>
                <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                  {stats.activeEnrollments}
                </p>
              </div>

              <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-100/80 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                  <GraduationCap size={20} />
                </div>
                <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Completions
                </p>
                <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
                  {stats.completions}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
              <h2 className="mb-4 font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
                Course Description
              </h2>
              <p className="whitespace-pre-wrap font-geist text-notion-text-light/90 dark:text-notion-text-dark/90">
                {course.description}
              </p>
            </div>

            {/* Content List */}
            <div className="rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
              <div className="border-b border-notion-gray-light/20 px-6 py-4 dark:border-notion-gray-dark/20">
                <div className="flex items-center justify-between">
                  <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
                    Course Content
                  </h2>
                  <span className="rounded-full bg-notion-pink/10 px-3 py-1 font-geist text-sm font-medium text-notion-pink">
                    {course.slides.length} slides
                  </span>
                </div>
              </div>

              <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
                {course.slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-notion-gray-light/10 dark:bg-notion-gray-dark/30">
                        <Layers className="h-4 w-4 text-notion-text-light/50 dark:text-notion-text-dark/50" />
                      </div>
                      <div>
                        <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                          {slide.title}
                        </h3>
                        {slide.description && (
                          <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
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
                  <div className="px-6 py-8 text-center">
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
          <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            <h2 className="mb-4 font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              Course Trainer
            </h2>
            <div className="flex items-center gap-4">
              {course.trainer.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.trainer.image}
                  alt={course.trainer.name ?? ""}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-notion-gray-light/10 dark:bg-notion-gray-dark/30">
                  <Users className="h-6 w-6 text-notion-text-light/50 dark:text-notion-text-dark/50" />
                </div>
              )}
              <div>
                <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                  {course.trainer.name}
                </h3>
                <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                  {course.trainer.email}
                </p>
              </div>
            </div>
            <Link
              href={`/admin/trainers/${course.trainer.id}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-notion-gray-light/20 px-4 py-2 font-geist text-sm text-notion-text-light transition-all hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink"
            >
              View Trainer Profile
            </Link>
          </div>

          {/* Course Info */}
          <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            <h2 className="mb-4 font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              Course Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Skill Level
                </p>
                <p className="font-geist text-notion-text-light dark:text-notion-text-dark">
                  {course.skillLevel}
                </p>
              </div>
              <div>
                <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Created
                </p>
                <p className="font-geist text-notion-text-light dark:text-notion-text-dark">
                  {new Date(course.createdAt ?? "").toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Last Updated
                </p>
                <p className="font-geist text-notion-text-light dark:text-notion-text-dark">
                  {new Date(course.updatedAt ?? "").toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Featured Status
                </p>
                <p className="font-geist text-notion-text-light dark:text-notion-text-dark">
                  {course.isFeatured ? "Featured" : "Not Featured"}
                </p>
              </div>
            </div>

            <hr className="my-4 border-notion-gray-light/10 dark:border-notion-gray-dark/10" />

            <Link
              href={`/courses/${course.slug}/preview`}
              className="inline-flex w-full items-center justify-center rounded-lg border border-notion-gray-light/20 px-4 py-2 font-geist text-sm text-notion-text-light transition-all hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink"
            >
              Preview Course
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
