import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { slideProgress, slides, enrollments } from "~/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";

interface RouteParams {
  params: Promise<{
    slideId: string;
  }>;
}

// Define request validation schemas
const updateProgressSchema = z.object({
  completed: z.boolean(),
});

// PATCH endpoint to update slide progress
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slideId } = await params;
    const body = (await request.json()) as z.infer<typeof updateProgressSchema>;
    const result = updateProgressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request format", details: result.error.format() },
        { status: 400 },
      );
    }

    const { completed } = result.data;

    // Get slide to verify it exists and get courseId
    const slide = await db.query.slides.findFirst({
      where: eq(slides.id, slideId),
    });

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    // Verify enrollment
    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.courseId, slide.courseId),
        eq(enrollments.traineeId, session.user.id),
      ),
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Not enrolled in this course" },
        { status: 403 },
      );
    }

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

    // Calculate new course progress
    const [totalSlidesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(slides)
      .where(eq(slides.courseId, slide.courseId));

    const [completedSlidesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(slideProgress)
      .innerJoin(slides, eq(slideProgress.slideId, slides.id))
      .where(
        and(
          eq(slideProgress.traineeId, session.user.id),
          eq(slideProgress.completed, true),
          eq(slides.courseId, slide.courseId),
        ),
      );

    // Calculate new progress percentage
    const totalSlides = totalSlidesResult?.count ?? 0;
    const completedSlides = completedSlidesResult?.count ?? 0;
    const progress = Math.round((completedSlides / (totalSlides || 1)) * 100);

    // Update enrollment progress
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({
        progress,
        status: progress === 100 ? "completed" : "active",
        lastAccessedAt: new Date(),
      })
      .where(
        and(
          eq(enrollments.courseId, slide.courseId),
          eq(enrollments.traineeId, session.user.id),
        ),
      )
      .returning();

    if (!updatedEnrollment) {
      return NextResponse.json(
        { error: "Failed to update enrollment" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      slideProgress: {
        slideId,
        completed,
        completedAt: completed ? new Date() : null,
      },
      courseProgress: {
        progress: updatedEnrollment.progress,
        status: updatedEnrollment.status,
      },
    });
  } catch (error) {
    console.error("Error updating slide progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}
