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
    <main className="min-h-screen space-y-notion-lg px-4 py-6 sm:space-y-notion-xl sm:px-6 sm:py-8 lg:px-8">
      {/* Back button - improved responsive spacing */}
      <div className="animate-fade-in">
        <Link
          href="/admin/trainers"
          className="mb-notion-md inline-flex items-center gap-2 rounded-lg px-notion-sm py-1 font-geist text-sm text-notion-text-light/70 transition-all hover:bg-notion-gray-light/30 hover:text-notion-accent dark:text-notion-text-dark/70 dark:hover:bg-notion-gray-dark/30 sm:mb-notion-lg"
        >
          <ChevronLeft size={16} />
          <span>Back to Trainers</span>
        </Link>

        {/* Profile header - improved responsive layout */}
        <div className="mt-notion-md flex flex-col items-start justify-between gap-notion-md border-b border-notion-gray-light/20 pb-notion-md dark:border-notion-gray-dark/20 sm:mt-0 sm:flex-row sm:items-center sm:pb-notion-lg">
          <div className="flex flex-col items-start gap-notion-md sm:flex-row sm:items-center">
            {trainer.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={trainer.image}
                alt={trainer.name ?? ""}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-notion-accent/20 transition-transform hover:scale-105"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-notion-gray-light/30 ring-2 ring-notion-accent/20 transition-transform hover:scale-105 dark:bg-notion-gray-dark/50">
                <Users className="h-8 w-8 text-notion-text-light/50 dark:text-notion-text-dark/70" />
              </div>
            )}
            <div className="animate-slide-in">
              <h1 className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-2xl md:text-3xl">
                {trainer.name}
              </h1>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-base">
                {trainer.email}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <TrainerVerification
              trainerId={trainer.id}
              currentStatus={trainer.verificationStatus}
            />
          </div>
        </div>
      </div>

      {/* Statistics Grid - improved responsive sizing and improved visual contrast */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-notion-md md:grid-cols-4">
        {[
          {
            icon: <BookOpen size={20} className="sm:h-6 sm:w-6" />,
            label: "Total Courses",
            value: stats.totalCourses,
            color: "notion-accent",
            bgColor: "bg-notion-accent/10 dark:bg-notion-accent/20",
            textColor: "text-notion-accent dark:text-notion-accent-light",
          },
          {
            icon: <Award size={20} className="sm:h-6 sm:w-6" />,
            label: "Published",
            value: stats.publishedCourses,
            color: "green-500",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            textColor: "text-green-700 dark:text-green-400",
          },
          {
            icon: <GraduationCap size={20} className="sm:h-6 sm:w-6" />,
            label: "Enrollments",
            value: stats.totalEnrollments,
            color: "blue-500",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            textColor: "text-blue-700 dark:text-blue-400",
          },
          {
            icon: <BarChart size={20} className="sm:h-6 sm:w-6" />,
            label: "Content Slides",
            value: slideCount?.count ?? 0,
            color: "purple-500",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            textColor: "text-purple-700 dark:text-purple-400",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="group animate-fade-in rounded-xl border border-notion-gray-light/20 bg-white p-3 shadow-notion-xs transition-all hover:shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 sm:p-notion-md"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor} ${stat.textColor} transition-transform group-hover:scale-110 sm:mb-notion-md sm:h-12 sm:w-12`}
            >
              {stat.icon}
            </div>
            <p className="font-geist text-xs font-medium text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
              {stat.label}
            </p>
            <p className="font-geist text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Courses List - improved responsive layout and visual hierarchy */}
      <div className="animate-slide-up rounded-xl border border-notion-gray-light/20 bg-white shadow-notion transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-dark dark:bg-notion-gray-dark/60">
        <div className="border-b border-notion-gray-light/20 px-4 py-notion-md dark:border-notion-gray-dark/20 sm:px-notion-lg">
          <h2 className="font-geist text-base font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-lg">
            Courses ({stats.totalCourses})
          </h2>
        </div>

        <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
          {trainerCourses.map((course, index) => (
            <div
              key={course.id}
              className="group flex flex-col gap-notion-sm p-4 transition-colors hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/40 sm:flex-row sm:items-center sm:justify-between sm:px-notion-lg sm:py-notion-md"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="animate-fade-in">
                <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                  {course.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-notion-sm sm:gap-notion-md">
                  <span className="flex items-center gap-1 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
                    <GraduationCap size={14} />
                    {course.enrollments.length} enrolled
                  </span>
                  <span className="flex items-center gap-1 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
                    <Clock size={14} />
                    {new Date(course.createdAt ?? "").toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-notion-sm flex items-center gap-notion-sm sm:mt-0 sm:gap-notion-md">
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
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-notion-gray-light/20 px-3 font-geist text-xs text-notion-text-light transition-all hover:border-notion-accent hover:bg-notion-accent/5 hover:text-notion-accent dark:border-notion-gray-dark/30 dark:text-notion-text-dark dark:hover:border-notion-accent dark:hover:bg-notion-accent/10 dark:hover:text-notion-accent sm:h-9 sm:px-notion-md sm:text-sm"
                >
                  Review
                </Link>
              </div>
            </div>
          ))}

          {trainerCourses.length === 0 && (
            <div className="px-4 py-notion-xl text-center sm:px-notion-lg">
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-base">
                This trainer hasn&apos;t created any courses yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
