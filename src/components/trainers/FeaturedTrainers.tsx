import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq, count, desc } from "drizzle-orm";
import { TrainerCarousel } from "./TrainerCarousel";

async function getTrainers() {
  try {
    // Get verified trainers
    const trainers = await db.query.users.findMany({
      where: eq(users.role, "trainer"),
      orderBy: [desc(users.createdAt)],
      limit: 5,
    });

    // Process trainers with stats
    const trainersWithStats = await Promise.all(
      trainers.map(async (trainer) => {
        // In production, you'd get real stats
        return {
          id: trainer.id,
          name: trainer.name,
          email: trainer.email,
          bio: trainer.bio,
          image: trainer.image,
          verificationStatus: trainer.verificationStatus,
          stats: {
            totalCourses: 0, // Will be populated with real data in production
            publishedCourses: 0,
            totalSlides: 0,
            totalStudents: 0,
            averageRating: 0,
          },
        };
      }),
    );

    return trainersWithStats;
  } catch (error) {
    console.error("Error fetching trainers:", error);
    return [];
  }
}

export async function FeaturedTrainers() {
  const trainers = await getTrainers();

  return <TrainerCarousel trainers={trainers} />;
}
