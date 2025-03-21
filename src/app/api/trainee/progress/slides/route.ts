import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { slideProgress } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Define request validation schemas
const getProgressSchema = z.object({
  courseId: z.string().uuid(),
});

// GET endpoint to fetch all slide progress for a course
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseId = request.nextUrl.searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }

    const result = getProgressSchema.safeParse({ courseId });
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: result.error.format() },
        { status: 400 },
      );
    }

    // Get all slide progress entries for the trainee in this course
    const progress = await db.query.slideProgress.findMany({
      where: and(eq(slideProgress.traineeId, session.user.id)),
      with: {
        slide: true,
      },
    });

    // Only return progress for slides in the requested course
    const courseProgress = progress.filter(
      (entry) => entry.slide.courseId === courseId,
    );

    return NextResponse.json(
      courseProgress.map((entry) => ({
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