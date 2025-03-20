import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses, slides } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { deleteFile } from "~/lib/storage";

// Define interfaces for request bodies
interface CourseRequestBody {
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  skillLevel?: "beginner" | "intermediate" | "advanced";
  trainerId: string;
}

interface DeleteCourseRequestBody {
  courseId: string;
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only trainers can create courses
    if (session.user.role !== "trainer") {
      return NextResponse.json(
        { error: "Only trainers can create courses" },
        { status: 403 },
      );
    }

    const body = (await req.json()) as CourseRequestBody;
    const {
      title,
      slug,
      shortDescription,
      description,
      skillLevel,
      trainerId,
    } = body;

    // Validate required fields
    if (!title || !slug || !shortDescription || !trainerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Make sure trainerId matches the authenticated user
    if (trainerId !== session.user.id) {
      return NextResponse.json(
        { error: "TrainerId must match the authenticated user" },
        { status: 403 },
      );
    }

    // Check if a course with the same slug already exists
    const existingCourse = await db.query.courses.findFirst({
      where: eq(courses.slug, slug),
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "A course with this title already exists" },
        { status: 409 },
      );
    }

    // Create the course
    const newCourse = await db
      .insert(courses)
      .values({
        title,
        slug,
        shortDescription,
        description: description ?? null,
        // Use nullish coalescing instead of non-null assertion
        skillLevel: skillLevel ?? "beginner",
        trainerId,
        status: "draft", // Default status is draft
      })
      .returning();

    return NextResponse.json(newCourse[0], { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}

export async function GET(_req: Request) {
  try {
    const session = await auth();

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only trainers can list their courses
    if (session.user.role !== "trainer") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get all courses for this trainer
    const trainerCourses = await db.query.courses.findMany({
      where: eq(courses.trainerId, session.user.id),
      orderBy: (courses, { desc }) => [desc(courses.createdAt)],
    });

    return NextResponse.json(trainerCourses);
  } catch (error) {
    console.error("Error fetching trainer courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only trainers can delete courses
    if (session.user.role !== "trainer") {
      return NextResponse.json(
        { error: "Only trainers can delete courses" },
        { status: 403 },
      );
    }

    // Parse and type the request body
    const body = (await req.json()) as DeleteCourseRequestBody;
    const { courseId } = body;

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json(
        { error: "Course ID is required and must be a string" },
        { status: 400 },
      );
    }

    // Verify the course belongs to this trainer
    const course = await db.query.courses.findFirst({
      where: and(
        eq(courses.id, courseId),
        eq(courses.trainerId, session.user.id),
      ),
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found or you don't have permission to delete it" },
        { status: 404 },
      );
    }

    // Get all slides associated with this course
    const courseSlides = await db.query.slides.findMany({
      where: eq(slides.courseId, courseId),
    });

    // Delete all slide files from Digital Ocean Spaces
    const fileDeletionPromises = courseSlides.map(async (slide) => {
      try {
        if (slide.fileUrl) {
          await deleteFile(slide.fileUrl);
        }
      } catch (error) {
        console.error(`Error deleting file for slide ${slide.id}:`, error);
        // Continue with other deletions even if one fails
      }
    });

    // Wait for all file deletions to complete
    await Promise.allSettled(fileDeletionPromises);

    // Delete all slides from the database
    await db.delete(slides).where(eq(slides.courseId, courseId));

    // Delete the course
    const deletedCourse = await db
      .delete(courses)
      .where(eq(courses.id, courseId))
      .returning();

    return NextResponse.json({
      message: "Course and associated slides deleted successfully",
      deletedCourse: deletedCourse[0],
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
