import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses, slides } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { uploadFile } from "~/lib/storage";

// GET endpoint to fetch slides for a course
export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth();
    const { courseId } = await params;

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user role from session
    const userRole = session.user.role;
    const userId = session.user.id;

    // Verify course ownership if user is a trainer
    if (userRole === "trainer") {
      const courseCheck = await db.query.courses.findFirst({
        where: and(eq(courses.id, courseId), eq(courses.trainerId, userId)),
      });

      if (!courseCheck) {
        return NextResponse.json(
          { error: "You don't have access to this course" },
          { status: 403 },
        );
      }
    }

    // Query for slides, ordered by their order field
    const courseSlides = await db.query.slides.findMany({
      where: eq(slides.courseId, courseId),
      orderBy: (slides, { asc }) => [asc(slides.order)],
    });

    return NextResponse.json(courseSlides);
  } catch (error) {
    console.error("Error fetching slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch slides" },
      { status: 500 },
    );
  }
}

// POST endpoint to upload a new slide
export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth();
    const { courseId } = await params;

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only trainers can upload slides
    if (session.user.role !== "trainer") {
      return NextResponse.json(
        { error: "Only trainers can upload slides" },
        { status: 403 },
      );
    }

    const userId = session.user.id;

    // Verify course ownership
    const courseCheck = await db.query.courses.findFirst({
      where: and(eq(courses.id, courseId), eq(courses.trainerId, userId)),
    });

    if (!courseCheck) {
      return NextResponse.json(
        { error: "You don't have permission to add slides to this course" },
        { status: 403 },
      );
    }

    // Process form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!file || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Get the highest current order value
    const lastSlide = await db.query.slides.findFirst({
      where: eq(slides.courseId, courseId),
      orderBy: (slides, { desc }) => [desc(slides.order)],
    });

    const order = lastSlide?.order ? lastSlide.order + 1 : 0;

    // Upload file to Digital Ocean Spaces
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadFile(fileBuffer, file.name, file.type);

    // Create slide record in database
    const newSlide = await db
      .insert(slides)
      .values({
        courseId,
        title,
        description: description || null,
        fileUrl,
        fileType: file.type,
        originalFilename: file.name,
        order,
      })
      .returning();

    return NextResponse.json(newSlide[0], { status: 201 });
  } catch (error) {
    console.error("Error uploading slide:", error);
    return NextResponse.json(
      { error: "Failed to upload slide" },
      { status: 500 },
    );
  }
}
