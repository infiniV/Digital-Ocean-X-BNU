import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { enrollments, slides } from "~/server/db/schema";
import { eq, and, count } from "drizzle-orm";
import { z } from "zod";

// Define request validation schemas
const updateProgressSchema = z.object({
  courseId: z.string().uuid(),
  slideId: z.string().uuid(),
  completed: z.boolean(),
});

// Endpoint to update slide progress and calculate overall course progress
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

    const { courseId } = result.data;

    // Verify enrollment
    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.courseId, courseId),
        eq(enrollments.traineeId, session.user.id),
      ),
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 404 },
      );
    }

    // Get total number of slides
    const totalSlides = await db
      .select({ value: count() })
      .from(slides)
      .where(eq(slides.courseId, courseId));

    // Get completed slides count
    const completedSlides = await db
      .select({ value: count() })
      .from(slides)
      .where(
        and(
          eq(slides.courseId, courseId),
          // Track completed slides in separate table or use a different approach
          // This needs to be fixed based on your actual database schema
        ),
      );

    // Calculate new progress percentage
    const progress = Math.round(
      (completedSlides[0]!.value / totalSlides[0]!.value) * 100,
    );

    // Update enrollment progress
    const updatedEnrollment = await db
      .update(enrollments)
      .set({
        progress,
        status: progress === 100 ? "completed" : "active",
        lastAccessedAt: new Date(),
      })
      .where(
        and(
          eq(enrollments.courseId, courseId),
          eq(enrollments.traineeId, session.user.id),
        ),
      )
      .returning();

    return NextResponse.json(updatedEnrollment[0]);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}

// GET endpoint to fetch progress for a course
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

    // Get enrollment progress
    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.courseId, courseId),
        eq(enrollments.traineeId, session.user.id),
      ),
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      progress: enrollment.progress,
      status: enrollment.status,
      lastAccessedAt: enrollment.lastAccessedAt,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 },
    );
  }
}
