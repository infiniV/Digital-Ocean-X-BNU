import { db } from "~/server/db";
import { users, courses, slides } from "~/server/db/schema";
import { and, eq, count, desc } from "drizzle-orm";
import { Suspense } from "react";
import { TrainerCardsGrid } from "~/components/trainers/TrainerCardsGrid";

// Loading component
function TrainersLoading() {
  return (
    <div className="space-y-notion-xl">
      <div className="h-24 w-full max-w-md animate-pulse rounded-lg bg-notion-gray-light/30 dark:bg-notion-gray-dark/30"></div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-xl border border-notion-gray-light/20 bg-notion-gray-light/30 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/30"
          ></div>
        ))}
      </div>
    </div>
  );
}

// Fetching trainers with stats
async function fetchTrainers() {
  // Get all trainers
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
        id: trainer.id,
        name: trainer.name,
        email: trainer.email || "",
        bio: trainer.bio,
        image: trainer.image,
        verificationStatus: trainer.verificationStatus,
        stats: {
          totalCourses: courseCount?.count ?? 0,
          publishedCourses: publishedCount?.count ?? 0,
          totalSlides: slideCount?.count ?? 0,
        },
      };
    }),
  );

  // Sort by number of published courses (highest first)
  return trainerStats.sort(
    (a, b) => b.stats.publishedCourses - a.stats.publishedCourses,
  );
}

// Trainers component that renders the grid
async function TrainersContent() {
  const trainers = await fetchTrainers();

  return <TrainerCardsGrid trainers={trainers} />;
}

export default function TrainersPage() {
  return (
    <main className="min-h-screen space-y-notion-xl px-4 py-notion-lg sm:px-6 lg:px-8">
      {/* Header with animation */}
      <div className="animate-fade-in">
        <div className="flex flex-col gap-notion-xs">
          <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl md:text-4xl">
            Our Trainers
          </h1>
          <p className="max-w-2xl font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-lg">
            Discover our expert trainers who are passionate about women
            empowerment and digital skills
          </p>
        </div>
      </div>

      {/* Trainers grid with Suspense */}
      <div className="animate-scale-in">
        <Suspense fallback={<TrainersLoading />}>
          <TrainersContent />
        </Suspense>
      </div>
    </main>
  );
}
