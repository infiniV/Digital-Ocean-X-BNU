import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import {
  userAchievements,
  learningStreaks,
  enrollments,
  slideProgress,
} from "~/server/db/schema";
import { eq, and, count } from "drizzle-orm";
import { z } from "zod";

// Schema for updating streak
const updateStreakSchema = z.object({
  incrementStreak: z.boolean().optional(),
});

// Helper function to check and update achievement progress
async function checkAndUpdateAchievements(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get current enrollments and progress
    const enrolledCourses = await db.query.enrollments.findMany({
      where: eq(enrollments.traineeId, userId),
    });

    const totalCourses = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(
      (enrollment) => enrollment.status === "completed",
    ).length;

    // Get completed slides count
    const completedSlidesResult = await db
      .select({ count: count() })
      .from(slideProgress)
      .where(
        and(
          eq(slideProgress.traineeId, userId),
          eq(slideProgress.completed, true),
        ),
      );

    const completedSlides = completedSlidesResult[0]?.count ?? 0;

    // Get current streak
    const streakData = await db.query.learningStreaks.findFirst({
      where: eq(learningStreaks.userId, userId),
      orderBy: (streak, { desc }) => [desc(streak.lastActivityDate)],
    });

    // Get all available achievements
    const allAchievements = await db.query.achievements.findMany();

    // Get user's current achievements
    const userAchievementRecords = await db.query.userAchievements.findMany({
      where: eq(userAchievements.userId, userId),
    });

    const userAchievementMap = new Map(
      userAchievementRecords.map((record) => [record.achievementId, record]),
    );

    // Check and update each achievement
    for (const achievement of allAchievements) {
      let currentValue = 0;
      let isUnlocked = false;
      const userRecord = userAchievementMap.get(achievement.id);

      // Calculate progress based on achievement type
      switch (achievement.type) {
        case "course_completion":
          currentValue = completedCourses;
          isUnlocked = currentValue >= (achievement.requiredValue ?? 1);
          break;

        case "streak":
          currentValue = streakData?.currentStreak ?? 0;
          isUnlocked = currentValue >= (achievement.requiredValue ?? 1);
          break;

        case "slides_milestone":
          currentValue = completedSlides;
          isUnlocked = currentValue >= (achievement.requiredValue ?? 1);
          break;

        case "multiple_courses":
          currentValue = totalCourses;
          isUnlocked = currentValue >= (achievement.requiredValue ?? 1);
          break;
      }

      // Calculate progress percentage
      const progress = Math.min(
        Math.round((currentValue / (achievement.requiredValue ?? 1)) * 100),
        100,
      );

      // Create or update achievement record
      if (!userRecord) {
        await db.insert(userAchievements).values({
          userId,
          achievementId: achievement.id,
          currentValue,
          progress,
          isUnlocked,
          unlockedAt: isUnlocked ? new Date() : null,
        });
      } else if (
        userRecord.currentValue !== currentValue ||
        userRecord.isUnlocked !== isUnlocked ||
        userRecord.progress !== progress
      ) {
        await db
          .update(userAchievements)
          .set({
            currentValue,
            progress,
            isUnlocked,
            unlockedAt:
              isUnlocked && !userRecord.isUnlocked
                ? new Date()
                : userRecord.unlockedAt,
          })
          .where(eq(userAchievements.id, userRecord.id));
      }
    }
  } catch (error) {
    console.error("Error updating achievements:", error);
    throw error;
  }
}

// GET endpoint to fetch achievements
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "trainee") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    await checkAndUpdateAchievements(userId);

    const achievements = await db.query.userAchievements.findMany({
      where: eq(userAchievements.userId, userId),
      with: {
        achievement: true,
      },
      orderBy: (ua, { desc }) => [desc(ua.isUnlocked), desc(ua.progress)],
    });

    const streak = await db.query.learningStreaks.findFirst({
      where: eq(learningStreaks.userId, userId),
      orderBy: (streak, { desc }) => [desc(streak.lastActivityDate)],
    });

    return NextResponse.json({
      achievements,
      streak: {
        current: streak?.currentStreak ?? 0,
        longest: streak?.longestStreak ?? 0,
        lastActivityDate: streak?.lastActivityDate ?? null,
      },
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST endpoint to update streak
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "trainee") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as z.infer<typeof updateStreakSchema>;
    const result = updateStreakSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: result.error.format() },
        { status: 400 },
      );
    }

    const userId = session.user.id;
    const { incrementStreak } = result.data;

    if (incrementStreak) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingStreak = await db.query.learningStreaks.findFirst({
        where: eq(learningStreaks.userId, userId),
      });

      if (existingStreak) {
        const lastActivity = new Date(existingStreak.lastActivityDate);
        lastActivity.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let newStreak = existingStreak.currentStreak ?? 0;
        let newLongestStreak = existingStreak.longestStreak ?? 0;

        if (lastActivity.getTime() !== today.getTime()) {
          if (lastActivity.getTime() === yesterday.getTime()) {
            // Increment streak if last activity was yesterday
            newStreak += 1;
          } else {
            // Reset streak if there was a gap
            newStreak = 1;
          }

          // Update longest streak if current streak is longer
          if (newStreak > newLongestStreak) {
            newLongestStreak = newStreak;
          }

          await db
            .update(learningStreaks)
            .set({
              currentStreak: newStreak,
              longestStreak: newLongestStreak,
              date: today,
              lastActivityDate: new Date(),
            })
            .where(eq(learningStreaks.id, existingStreak.id));
        }
      } else {
        // Create new streak record
        await db.insert(learningStreaks).values({
          userId,
          date: today,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: new Date(),
        });
      }

      // Update achievements after streak change
      await checkAndUpdateAchievements(userId);
    }

    const updatedStreak = await db.query.learningStreaks.findFirst({
      where: eq(learningStreaks.userId, userId),
    });

    return NextResponse.json({
      streak: {
        current: updatedStreak?.currentStreak ?? 0,
        longest: updatedStreak?.longestStreak ?? 0,
        lastActivityDate: updatedStreak?.lastActivityDate ?? null,
      },
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
