import { db } from "~/server/db";
import { users, courses, slides } from "~/server/db/schema";
import { desc, eq, and, count } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft, Users } from "lucide-react";
import { TrainerVerification } from "./_components/TrainerVerification";

export default async function AdminTrainersPage() {
  // Get all trainers with their stats
  const trainers = await db.query.users.findMany({
    where: eq(users.role, "trainer"),
    orderBy: [desc(users.createdAt)],
  });

  // Get course counts for each trainer
  const trainerStats = await Promise.all(
    trainers.map(async (trainer) => {
      const [courseCount] = await db
        .select({ count: count() })
        .from(courses)
        .where(eq(courses.trainerId, trainer.id));

      const [publishedCount] = await db
        .select({ count: count() })
        .from(courses)
        .where(
          and(
            eq(courses.trainerId, trainer.id),
            eq(courses.status, "published"),
          ),
        );

      const [slideCount] = await db
        .select({ count: count() })
        .from(slides)
        .innerJoin(courses, eq(slides.courseId, courses.id))
        .where(eq(courses.trainerId, trainer.id));

      return {
        trainer,
        stats: {
          totalCourses: courseCount?.count ?? 0,
          publishedCourses: publishedCount?.count ?? 0,
          totalSlides: slideCount?.count ?? 0,
        },
      };
    }),
  );

  return (
    <main className="min-h-screen space-y-notion-xl px-4 py-notion-lg sm:px-6 lg:px-8">
      {/* Header with animation */}
      <div className="animate-fade-in">
        <Link
          href="/admin"
          className="mb-notion-md inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-colors hover:scale-[1.02] hover:text-notion-accent dark:text-notion-text-dark/70"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-notion-xs">
          <h1 className="font-geist text-3xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-4xl">
            Manage Trainers
          </h1>
          <p className="font-geist text-lg text-notion-text-light/70 dark:text-notion-text-dark/70">
            Monitor and manage trainer activities
          </p>
        </div>
      </div>

      {/* Trainers List Card */}
      <div className="bg-notion-background-light shadow-notion-lg animate-scale-in overflow-hidden rounded-xl border border-notion-gray-light/20 transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark">
        <div className="border-b border-notion-gray-light/20 bg-notion-gray-light/50 px-notion-lg py-notion-md dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/70">
          <div className="flex items-center justify-between">
            <h2 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
              All Trainers
            </h2>
            <span className="bg-notion-accent-light/20 text-notion-accent-dark dark:bg-notion-accent-dark/20 dark:text-notion-accent-light animate-pulse-slow rounded-full px-4 py-1.5 font-geist text-sm font-medium">
              {trainers.length} trainers
            </span>
          </div>
        </div>

        <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
          {trainerStats.map(({ trainer, stats }) => (
            <div
              key={trainer.id}
              className="group flex items-start justify-between p-notion-lg transition-all hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/40"
            >
              <div className="flex items-start gap-notion-md">
                {trainer.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trainer.image}
                    alt={trainer.name ?? ""}
                    className="ring-notion-accent-light/20 dark:ring-notion-accent-dark/20 h-12 w-12 rounded-full object-cover ring-2 transition-all group-hover:ring-notion-accent"
                  />
                ) : (
                  <div className="ring-notion-accent-light/20 dark:ring-notion-accent-dark/20 flex h-12 w-12 items-center justify-center rounded-full bg-notion-gray-light/20 ring-2 transition-all group-hover:ring-notion-accent dark:bg-notion-gray-dark/40">
                    <Users className="h-6 w-6 text-notion-text-light/50 dark:text-notion-text-dark/50" />
                  </div>
                )}
                <div>
                  <h3 className="font-geist text-lg font-medium text-notion-text-light dark:text-notion-text-dark">
                    {trainer.name}
                  </h3>
                  <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                    {trainer.email}
                  </p>
                  <div className="mt-notion-sm flex flex-wrap gap-notion-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-notion-gray-light/20 px-3 py-1.5 font-geist text-xs font-medium text-notion-text-light/80 dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/80">
                      {stats.totalCourses} courses
                    </span>
                    <span className="bg-notion-accent-light/20 text-notion-accent-dark dark:bg-notion-accent-dark/30 dark:text-notion-accent-light inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-geist text-xs font-medium">
                      {stats.publishedCourses} published
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-notion-pink-light/20 px-3 py-1.5 font-geist text-xs font-medium text-notion-pink-dark dark:bg-notion-pink-dark/30 dark:text-notion-pink-light">
                      {stats.totalSlides} slides
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-notion-md">
                <TrainerVerification
                  trainerId={trainer.id}
                  currentStatus={trainer.verificationStatus}
                />
                <Link
                  href={`/admin/trainers/${trainer.id}`}
                  className="bg-notion-background-light hover:bg-notion-accent-light/10 dark:hover:border-notion-accent-dark dark:hover:bg-notion-accent-dark/10 dark:hover:text-notion-accent-light inline-flex h-10 items-center justify-center rounded-lg border border-notion-gray-light/20 px-notion-md font-geist text-sm font-medium text-notion-text-light transition-all hover:border-notion-accent hover:text-notion-accent dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark dark:text-notion-text-dark"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
