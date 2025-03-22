import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import {
  userAchievements,
  learningStreaks,
  enrollments,
  courses,
  slides,
  slideProgress,
} from "~/server/db/schema";
import { eq, and, count } from "drizzle-orm";
import { z } from "zod";

// Helper function to check and update all achievements for a user
async function checkAndUpdateAchievements(userId: string) {
  try {
    // Get current date for streak calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch all achievements
    const allAchievements = await db.query.achievements.findMany();

    // Fetch user's current achievement progress
    const userAchievementRecords = await db.query.userAchievements.findMany({
      where: eq(userAchievements.userId, userId),
      with: {
        achievement: true,
      },
    });

    // Create a map for easier lookup
    const userAchievementMap = new Map(
      userAchievementRecords.map((record) => [record.achievement.id, record]),
    );

    // Get user's enrollment data
    const enrolledCourses = await db.query.enrollments.findMany({
      where: eq(enrollments.traineeId, userId),
      with: {
        course: true,
      },
    });

    // Get total slides across all enrolled courses
    const totalSlidesResult = await db
      .select({ count: count() })
      .from(slides)
      .innerJoin(courses, eq(slides.courseId, courses.id))
      .innerJoin(enrollments, eq(courses.id, enrollments.courseId))
      .where(eq(enrollments.traineeId, userId));

    const totalSlides = totalSlidesResult[0]?.count ?? 0;

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

    // Get user's streak data
    let currentStreak = 0;
    const streakRecord = await db.query.learningStreaks.findFirst({
      where: eq(learningStreaks.userId, userId),
      orderBy: (streak, { desc }) => [desc(streak.lastActivityDate)],
    });

    // Calculate current streak
    if (streakRecord) {
      const lastActivity = new Date(streakRecord.lastActivityDate);
      lastActivity.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActivity.getTime() === today.getTime()) {
        // User already active today
        currentStreak = streakRecord.currentStreak ?? 0;
      } else if (lastActivity.getTime() === yesterday.getTime()) {
        // User was active yesterday, extend streak
        currentStreak = streakRecord.currentStreak ?? 0;
      } else {
        // Streak broken
        currentStreak = 0;
      }
    }

    // Calculate statistics
    const totalCourses = enrolledCourses.length;
    const completedCourses = enrolledCourses.filter(
      (enrollment) => enrollment.status === "completed",
    ).length;

    // For each achievement, check if the user has met the criteria and update accordingly
    const updatedAchievements = [];
    for (const achievement of allAchievements) {
      let currentValue = 0;
      let isUnlocked = false;
      const userRecord = userAchievementMap.get(achievement.id);

      // Calculate current value and check if achievement is unlocked based on type
      switch (achievement.type) {
        case "course_enrollment":
          currentValue = totalCourses;
          isUnlocked = currentValue >= (achievement.requiredValue ?? 1);
          break;

        case "course_completion":
          currentValue = completedCourses;
          isUnlocked = currentValue >= (achievement.requiredValue ?? 1);
          break;

        case "streak":
          currentValue = currentStreak;
          isUnlocked = currentValue >= (achievement.requiredValue ?? 1);
          break;

        case "slides_milestone":
          // For slides milestone, check if the user has completed the required percentage
          // The requiredValue represents the percentage (e.g., 50 for 50%)
          const percentComplete =
            totalSlides > 0
              ? Math.floor((completedSlides / totalSlides) * 100)
              : 0;
          currentValue = percentComplete;
          isUnlocked = currentValue >= (achievement.requiredValue ?? 50);
          break;

        case "multiple_courses":
          currentValue = totalCourses;
          isUnlocked = currentValue >= (achievement.requiredValue ?? 3);
          break;

        default:
          break;
      }

      // Calculate progress percentage
      const requiredValue = achievement.requiredValue ?? 1;
      const progress =
        requiredValue > 0
          ? Math.min(Math.floor((currentValue / requiredValue) * 100), 100)
          : 0;

      // If user doesn't have this achievement record yet, create it
      if (!userRecord) {
        const newUserAchievement = await db
          .insert(userAchievements)
          .values({
            userId,
            achievementId: achievement.id,
            progress,
            currentValue,
            isUnlocked,
            unlockedAt: isUnlocked ? new Date() : null,
          })
          .returning();

        if (newUserAchievement.length > 0) {
          updatedAchievements.push({
            ...newUserAchievement[0],
            achievement,
          });
        }
      }
      // If user has this achievement but values changed, update it
      else if (
        userRecord.currentValue !== currentValue ||
        userRecord.isUnlocked !== isUnlocked ||
        userRecord.progress !== progress
      ) {
        const updatedRecord = await db
          .update(userAchievements)
          .set({
            currentValue,
            progress,
            isUnlocked,
            unlockedAt:
              isUnlocked && !userRecord.isUnlocked
                ? new Date()
                : userRecord.unlockedAt,
            updatedAt: new Date(),
          })
          .where(eq(userAchievements.id, userRecord.id))
          .returning();

        if (updatedRecord.length > 0) {
          updatedAchievements.push({
            ...updatedRecord[0],
            achievement,
          });
        }
      }
    }

    return updatedAchievements;
  } catch (error) {
    console.error("Error updating achievements:", error);
    throw error;
  }
}

// Endpoint to get all achievements for a trainee
export async function GET() {
  try {
    const session = await auth();

    // Check if user is authenticated and is a trainee
    if (!session || session.user.role !== "trainee") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Trigger achievement check and update
    await checkAndUpdateAchievements(userId);

    // Fetch updated user achievements with detailed achievement info
    const userAchievementRecords = await db.query.userAchievements.findMany({
      where: eq(userAchievements.userId, userId),
      with: {
        achievement: true,
      },
      orderBy: (ua, { desc }) => [desc(ua.isUnlocked), desc(ua.progress)],
    });

    // Get user streak information
    const streakRecord = await db.query.learningStreaks.findFirst({
      where: eq(learningStreaks.userId, userId),
      orderBy: (streak, { desc }) => [desc(streak.lastActivityDate)],
    });

    // Return all achievements data
    return NextResponse.json({
      achievements: userAchievementRecords,
      streak: {
        current: streakRecord?.currentStreak ?? 0,
        longest: streakRecord?.longestStreak ?? 0,
        lastActivityDate: streakRecord?.lastActivityDate ?? null,
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

// Schema for updating streak
const updateStreakSchema = z.object({
  incrementStreak: z.boolean().optional(),
});

// Endpoint to update learning streak
export async function POST(request: Request) {
  try {
    const session = await auth();

    // Check if user is authenticated and is a trainee
    if (!session || session.user.role !== "trainee") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const rawBody = (await request.json()) as { incrementStreak?: boolean };
    const body: z.infer<typeof updateStreakSchema> = rawBody;

    // Validate request body
    const validatedData = updateStreakSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 },
      );
    }

    const { incrementStreak } = validatedData.data;

    // If incrementStreak is true, update the user's streak
    if (incrementStreak) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if user already has a streak record
      const existingStreak = await db.query.learningStreaks.findFirst({
        where: eq(learningStreaks.userId, userId),
        orderBy: (streak, { desc }) => [desc(streak.lastActivityDate)],
      });

      if (existingStreak) {
        const lastActivity = new Date(existingStreak.lastActivityDate);
        lastActivity.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let newCurrentStreak = existingStreak.currentStreak ?? 0;
        let newLongestStreak = existingStreak.longestStreak;

        // If last activity was before today
        if (lastActivity.getTime() !== today.getTime()) {
          // If last activity was yesterday, increment streak
          if (lastActivity.getTime() === yesterday.getTime()) {
            newCurrentStreak += 1;
          } else {
            // Streak broken, start new streak
            newCurrentStreak = 1;
          }

          // Update longest streak if current streak is longer
          if (newCurrentStreak > (newLongestStreak ?? 0)) {
            newLongestStreak = newCurrentStreak;
          }

          // Update streak record
          await db
            .update(learningStreaks)
            .set({
              currentStreak: newCurrentStreak,
              longestStreak: newLongestStreak ?? newCurrentStreak,
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
    }

    // Trigger achievement check and update
    await checkAndUpdateAchievements(userId);

    // Return updated streak info
    const updatedStreak = await db.query.learningStreaks.findFirst({
      where: eq(learningStreaks.userId, userId),
      orderBy: (streak, { desc }) => [desc(streak.lastActivityDate)],
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
