import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { enrollments, slides, slideProgress } from "~/server/db/schema";
import { eq, and, count } from "drizzle-orm";
import { z } from "zod";

// Define request validation schemas
const updateProgressSchema = z.object({
  courseId: z.string().uuid(),
});

// POST endpoint to update course progress and check completion
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

    // Get total slides in course
    const [totalSlides] = await db
      .select({ count: count() })
      .from(slides)
      .where(eq(slides.courseId, courseId));

    // Get completed slides count
    const [completedSlides] = await db
      .select({ count: count() })
      .from(slideProgress)
      .where(
        and(
          eq(slideProgress.traineeId, session.user.id),
          eq(slideProgress.completed, true),
        ),
      );

    // Calculate progress percentage
    const progress =
      totalSlides?.count && completedSlides?.count
        ? Math.round((completedSlides.count / totalSlides.count) * 100)
        : 0;

    // Update enrollment progress
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({
        progress,
        status: progress === 100 ? "completed" : "active",
        lastAccessedAt: new Date(),
        completedAt: progress === 100 ? new Date() : null,
      })
      .where(
        and(
          eq(enrollments.courseId, courseId),
          eq(enrollments.traineeId, session.user.id),
        ),
      )
      .returning();

    // If course was completed, trigger achievement check
    if (progress === 100) {
      await fetch("/api/trainee/achievements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ incrementStreak: true }),
      });
    }

    return NextResponse.json(updatedEnrollment);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}

// GET endpoint to fetch course progress
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
      completedAt: enrollment.completedAt,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 },
    );
  }
}
