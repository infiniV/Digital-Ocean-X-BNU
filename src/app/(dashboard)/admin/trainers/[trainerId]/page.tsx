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
  params: Promise<{
    trainerId: string;
  }>;
}

export default async function TrainerProfilePage({
  params,
}: TrainerProfilePageProps) {
  const { trainerId } = await params;

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
    <main className="min-h-screen space-y-notion-xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header with improved spacing and animations */}
      <div className="animate-fade-in">
        <Link
          href="/admin/trainers"
          className="mb-notion-lg inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-all hover:scale-105 hover:text-notion-accent dark:text-notion-text-dark/70"
        >
          <ChevronLeft size={16} />
          Back to Trainers
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-notion-md">
            {trainer.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={trainer.image}
                alt={trainer.name ?? ""}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-notion-accent/20 transition-transform hover:scale-105"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-notion-gray-light/20 ring-2 ring-notion-accent/20 transition-transform hover:scale-105 dark:bg-notion-gray-dark/40">
                <Users className="h-8 w-8 text-notion-text-light/50 dark:text-notion-text-dark/50" />
              </div>
            )}
            <div className="animate-slide-in">
              <h1 className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
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

      {/* Enhanced Statistics Grid */}
      <div className="grid grid-cols-1 gap-notion-md sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: <BookOpen size={24} />,
            label: "Total Courses",
            value: stats.totalCourses,
            color: "notion-accent",
          },
          {
            icon: <Award size={24} />,
            label: "Published Courses",
            value: stats.publishedCourses,
            color: "green-500",
          },
          {
            icon: <GraduationCap size={24} />,
            label: "Total Enrollments",
            value: stats.totalEnrollments,
            color: "blue-500",
          },
          {
            icon: <BarChart size={24} />,
            label: "Content Slides",
            value: slideCount?.count ?? 0,
            color: "purple-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="group animate-fade-in rounded-xl border border-notion-gray-light/20 bg-white p-notion-md shadow-notion transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`mb-notion-md inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${stat.color}/10 text-${stat.color} transition-transform group-hover:scale-110`}
            >
              {stat.icon}
            </div>
            <p className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
              {stat.label}
            </p>
            <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Enhanced Courses List */}
      <div className="animate-slide-up rounded-xl border border-notion-gray-light/20 bg-white shadow-notion transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
        <div className="border-b border-notion-gray-light/20 px-notion-lg py-notion-md dark:border-notion-gray-dark/20">
          <h2 className="font-geist text-lg font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            Courses ({stats.totalCourses})
          </h2>
        </div>

        <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
          {trainerCourses.map((course, index) => (
            <div
              key={course.id}
              className="group flex items-center justify-between px-notion-lg py-notion-md transition-colors hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/40"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="animate-fade-in">
                <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                  {course.title}
                </h3>
                <div className="mt-1 flex items-center gap-notion-md">
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

              <div className="flex items-center gap-notion-md">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-all ${
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
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-notion-gray-light/20 px-notion-md font-geist text-sm text-notion-text-light transition-all hover:scale-105 hover:border-notion-accent hover:text-notion-accent dark:border-notion-gray-dark/30 dark:text-notion-text-dark dark:hover:border-notion-accent dark:hover:text-notion-accent"
                >
                  Review
                </Link>
              </div>
            </div>
          ))}

          {trainerCourses.length === 0 && (
            <div className="px-notion-lg py-notion-xl text-center">
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
