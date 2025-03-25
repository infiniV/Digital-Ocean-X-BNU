import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { slideProgress } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Define request validation schemas
const updateProgressSchema = z.object({
  slideId: z.string().uuid(),
  completed: z.boolean(),
});

// POST endpoint to update slide progress and learning streak
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as z.infer<typeof updateProgressSchema>;
    const result = updateProgressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: result.error.format() },
        { status: 400 },
      );
    }

    const { slideId, completed } = result.data;

    // Update or create slide progress
    const existingProgress = await db.query.slideProgress.findFirst({
      where: and(
        eq(slideProgress.slideId, slideId),
        eq(slideProgress.traineeId, session.user.id),
      ),
    });

    if (existingProgress) {
      await db
        .update(slideProgress)
        .set({
          completed,
          completedAt: completed ? new Date() : null,
        })
        .where(
          and(
            eq(slideProgress.slideId, slideId),
            eq(slideProgress.traineeId, session.user.id),
          ),
        );
    } else {
      await db.insert(slideProgress).values({
        slideId,
        traineeId: session.user.id,
        completed,
        completedAt: completed ? new Date() : null,
      });
    }

    // If slide was completed, update learning streak
    if (completed) {
      // Call achievements API to update streak
      await fetch("/api/trainee/achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ incrementStreak: true }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating slide progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}

// GET endpoint to fetch progress for specific slides
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slideIds = request.nextUrl.searchParams.getAll("slideId");
    if (!slideIds.length) {
      return NextResponse.json(
        { error: "At least one slideId is required" },
        { status: 400 },
      );
    }

    const progress = await db.query.slideProgress.findMany({
      where: and(eq(slideProgress.traineeId, session.user.id)),
    });

    return NextResponse.json(
      progress.map((entry) => ({
        slideId: entry.slideId,
        completed: entry.completed,
        completedAt: entry.completedAt,
      })),
    );
  } catch (error) {
    console.error("Error fetching slide progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 },
    );
  }
}
