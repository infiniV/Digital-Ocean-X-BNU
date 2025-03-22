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
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            Manage Trainers
          </h1>
          <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
            Monitor and manage trainer activities
          </p>
        </div>
      </div>

      {/* Trainers List */}
      <div className="rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
        <div className="border-b border-notion-gray-light/20 px-6 py-4 dark:border-notion-gray-dark/20">
          <div className="flex items-center justify-between">
            <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              All Trainers
            </h2>
            <span className="rounded-full bg-notion-pink/10 px-3 py-1 font-geist text-sm font-medium text-notion-pink">
              {trainers.length} trainers
            </span>
          </div>
        </div>

        <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
          {trainerStats.map(({ trainer, stats }) => (
            <div
              key={trainer.id}
              className="flex items-start justify-between px-6 py-4"
            >
              <div className="flex items-start gap-4">
                {trainer.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trainer.image}
                    alt={trainer.name ?? ""}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-notion-gray-light/10 dark:bg-notion-gray-dark/30">
                    <Users className="h-5 w-5 text-notion-text-light/50 dark:text-notion-text-dark/50" />
                  </div>
                )}
                <div>
                  <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                    {trainer.name}
                  </h3>
                  <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                    {trainer.email}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-notion-gray-light/10 px-2 py-1 font-geist text-xs font-medium text-notion-text-light/70 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/70">
                      {stats.totalCourses} courses
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100/80 px-2 py-1 font-geist text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {stats.publishedCourses} published
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-1 font-geist text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {stats.totalSlides} slides
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <TrainerVerification
                  trainerId={trainer.id}
                  currentStatus={trainer.verificationStatus}
                />
                <Link
                  href={`/admin/trainers/${trainer.id}`}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-notion-gray-light/20 px-4 font-geist text-sm text-notion-text-light transition-all hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink"
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
