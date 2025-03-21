import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { enrollments, courses } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Define a schema for request validation
const enrollRequestSchema = z.object({
  courseId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a trainee
    if (session.user.role !== "trainee") {
      return NextResponse.json(
        { error: "Only trainees can enroll in courses" },
        { status: 403 },
      );
    }

    // Parse and validate request body
    const body = (await request.json()) as z.infer<typeof enrollRequestSchema>;
    const result = enrollRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid request format",
          details: result.error.format(),
        },
        { status: 400 },
      );
    }

    const { courseId } = result.data;

    // Verify course exists
    const courseExists = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!courseExists) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.traineeId, session.user.id),
        eq(enrollments.courseId, courseId),
      ),
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 409 },
      );
    }

    // Create enrollment
    const newEnrollment = await db
      .insert(enrollments)
      .values({
        traineeId: session.user.id,
        courseId: courseId,
        status: "active",
        enrolledAt: new Date(),
        progress: 0,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Successfully enrolled",
        enrollment: newEnrollment[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 },
    );
  }
}
