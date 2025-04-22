import { db } from "~/server/db";
import { users, courses, slides } from "~/server/db/schema";
import { desc, eq, and, count } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft, Users, Book, CheckCircle, Layers } from "lucide-react";
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
          className="mb-notion-md inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-all hover:scale-[1.02] hover:text-notion-accent dark:text-notion-text-dark/70"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-notion-xs">
          <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl md:text-4xl">
            Manage Trainers
          </h1>
          <p className="max-w-2xl font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-lg">
            Monitor and manage trainer activities across all courses
          </p>
        </div>
      </div>

      {/* Trainers List Card */}
      <div className="animate-scale-in overflow-hidden rounded-xl border border-notion-gray-light/30 bg-notion-background-light shadow-notion transition-all hover:shadow-notion-lg dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/90">
        <div className="border-b border-notion-gray-light/30 bg-notion-gray-light/30 px-notion-md py-notion-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/70 sm:px-notion-lg">
          <div className="flex flex-wrap items-center justify-between gap-notion-sm">
            <div className="flex items-center gap-notion-xs">
              <Users className="mr-notion-xs h-5 w-5 text-notion-accent dark:text-notion-accent-light" />
              <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-xl">
                All Trainers
              </h2>
            </div>
            <span className="animate-pulse-slow rounded-full bg-notion-accent-light/20 px-4 py-1.5 font-geist text-sm font-medium text-notion-accent-dark dark:bg-notion-accent-dark/30 dark:text-notion-accent-light">
              {trainers.length} trainers
            </span>
          </div>
        </div>

        <div className="divide-y divide-notion-gray-light/15 dark:divide-notion-gray-dark/15">
          {trainerStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-notion-xl text-center">
              <Users className="h-12 w-12 text-notion-text-light/30 dark:text-notion-text-dark/30" />
              <p className="mt-notion-md font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
                No trainers found
              </p>
            </div>
          ) : (
            trainerStats.map(({ trainer, stats }) => (
              <div
                key={trainer.id}
                className="group flex flex-col p-notion-md transition-all hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/40 sm:p-notion-lg"
              >
                <div className="flex flex-col gap-notion-md sm:flex-row sm:items-start sm:justify-between">
                  {/* Trainer info section */}
                  <div className="flex items-start gap-notion-md">
                    {trainer.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={trainer.image}
                        alt={trainer.name ?? ""}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-notion-accent-light/20 transition-all group-hover:ring-notion-accent dark:ring-notion-accent-dark/20"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-notion-gray-light/30 ring-2 ring-notion-accent-light/20 transition-all group-hover:ring-notion-accent dark:bg-notion-gray-dark/50 dark:ring-notion-accent-dark/20">
                        <Users className="h-6 w-6 text-notion-text-light/50 dark:text-notion-text-dark/50" />
                      </div>
                    )}
                    <div>
                      {" "}
                      <h3 className="font-geist text-lg font-medium text-notion-text-light dark:text-notion-text-dark">
                        {trainer.name}
                      </h3>
                      <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                        {trainer.email}
                      </p>
                      {trainer.bio && (
                        <p className="mt-notion-xs line-clamp-2 max-w-lg font-geist text-sm text-notion-text-light/80 dark:text-notion-text-dark/80">
                          {trainer.bio}
                        </p>
                      )}
                      <div className="mt-notion-sm flex flex-wrap gap-notion-xs">
                        <span className="inline-flex items-center gap-1 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs font-medium text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80">
                          <Book className="mr-0.5 h-3 w-3" />
                          {stats.totalCourses} courses
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-notion-accent-light/20 px-3 py-1 font-geist text-xs font-medium text-notion-accent-dark dark:bg-notion-accent-dark/30 dark:text-notion-accent-light">
                          <CheckCircle className="mr-0.5 h-3 w-3" />
                          {stats.publishedCourses} published
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-notion-pink-light/20 px-3 py-1 font-geist text-xs font-medium text-notion-pink-dark dark:bg-notion-pink-dark/30 dark:text-notion-pink-light">
                          <Layers className="mr-0.5 h-3 w-3" />
                          {stats.totalSlides} slides
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions section */}
                  <div className="mt-notion-md flex h-full flex-wrap items-start gap-notion-md sm:mt-0">
                    <div className="w-full sm:w-auto">
                      <TrainerVerification
                        trainerId={trainer.id}
                        currentStatus={trainer.verificationStatus}
                      />
                    </div>
                    <div className="flex h-full items-center">
                      <Link
                        href={`/admin/trainers/${trainer.id}`}
                        className="inline-flex h-10 items-center justify-center rounded-lg border border-notion-gray-light/30 bg-notion-background-light px-notion-md font-geist text-sm font-medium text-notion-text-light transition-all hover:border-notion-accent hover:bg-notion-accent-light/10 hover:text-notion-accent dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/80 dark:text-notion-text-dark dark:hover:border-notion-accent-dark dark:hover:bg-notion-accent-dark/10 dark:hover:text-notion-accent-light"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
