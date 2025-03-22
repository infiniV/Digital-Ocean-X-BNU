import { db } from "~/server/db";
import { users, courses, slides } from "~/server/db/schema";
import { desc, eq, and, count } from "drizzle-orm";
import Link from "next/link";
import {
  ChevronLeft,
  Users,
  BookOpen,
  GraduationCap,
  BarChart,
  Award,
  Clock,
} from "lucide-react";
import { TrainerVerification } from "../_components/TrainerVerification";
import { notFound } from "next/navigation";

interface TrainerProfilePageProps {
  params: {
    trainerId: string;
  };
}

export default async function TrainerProfilePage({
  params,
}: TrainerProfilePageProps) {
  const { trainerId } = params;

  // Get trainer details
  const trainer = await db.query.users.findFirst({
    where: and(eq(users.id, trainerId), eq(users.role, "trainer")),
  });

  if (!trainer) {
    notFound();
  }

  // Get trainer's courses with enrollment counts
  const trainerCourses = await db.query.courses.findMany({
    where: eq(courses.trainerId, trainerId),
    orderBy: [desc(courses.createdAt)],
    with: {
      enrollments: {
        columns: {
          id: true,
          status: true,
        },
      },
    },
  });

  // Calculate course statistics
  const stats = {
    totalCourses: trainerCourses.length,
    publishedCourses: trainerCourses.filter(
      (course) => course.status === "published",
    ).length,
    totalEnrollments: trainerCourses.reduce(
      (acc, course) => acc + course.enrollments.length,
      0,
    ),
    completions: trainerCourses.reduce(
      (acc, course) =>
        acc + course.enrollments.filter((e) => e.status === "completed").length,
      0,
    ),
  };

  // Get total content slides
  const [slideCount] = await db
    .select({ count: count() })
    .from(slides)
    .innerJoin(courses, eq(slides.courseId, courses.id))
    .where(eq(courses.trainerId, trainerId));

  return (
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/trainers"
          className="mb-6 inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70"
        >
          <ChevronLeft size={16} />
          Back to Trainers
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {trainer.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={trainer.image}
                alt={trainer.name ?? ""}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-notion-gray-light/10 dark:bg-notion-gray-dark/30">
                <Users className="h-8 w-8 text-notion-text-light/50 dark:text-notion-text-dark/50" />
              </div>
            )}
            <div>
              <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
                {trainer.name}
              </h1>
              <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
                {trainer.email}
              </p>
            </div>
          </div>

          <TrainerVerification
            trainerId={trainer.id}
            currentStatus={trainer.verificationStatus}
          />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-notion-pink/10 text-notion-pink">
            <BookOpen size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Total Courses
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.totalCourses}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100/80 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            <Award size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Published Courses
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.publishedCourses}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100/80 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <GraduationCap size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Total Enrollments
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stats.totalEnrollments}
          </p>
        </div>

        <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100/80 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <BarChart size={24} />
          </div>
          <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Content Slides
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {slideCount?.count ?? 0}
          </p>
        </div>
      </div>

      {/* Courses List */}
      <div className="rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
        <div className="border-b border-notion-gray-light/20 px-6 py-4 dark:border-notion-gray-dark/20">
          <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
            Courses ({stats.totalCourses})
          </h2>
        </div>

        <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
          {trainerCourses.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                  {course.title}
                </h3>
                <div className="mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                    <GraduationCap size={14} />
                    {course.enrollments.length} enrolled
                  </span>
                  <span className="flex items-center gap-1 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                    <Clock size={14} />
                    {new Date(course.createdAt ?? "").toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    course.status === "published"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : course.status === "draft"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {course.status}
                </span>
                <Link
                  href={`/admin/courses/${course.id}`}
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-notion-gray-light/20 px-3 font-geist text-sm text-notion-text-light transition-all hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink"
                >
                  Review
                </Link>
              </div>
            </div>
          ))}

          {trainerCourses.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
                This trainer hasn&apos;t created any courses yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
