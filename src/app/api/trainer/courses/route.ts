import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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

    // Define type for course request body
    interface CourseRequestBody {
      title: string;
      slug: string;
      shortDescription: string;
      description?: string;
      skillLevel?: "beginner" | "intermediate" | "advanced";
      price?: number;
      trainerId: string;
    }

    const body = (await req.json()) as CourseRequestBody;
    const {
      title,
      slug,
      shortDescription,
      description,
      skillLevel,
      price,
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
        skillLevel: skillLevel! || "beginner",
        price: price ?? 0,
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
