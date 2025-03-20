import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses, slides } from "~/server/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { uploadFile, deleteFile } from "~/lib/storage";

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

// DELETE endpoint to delete a slide
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth();
    const { courseId } = await params;
    const { searchParams } = new URL(req.url);
    const slideId = searchParams.get("slideId");

    // Check authentication
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only trainers can delete slides
    if (session.user.role !== "trainer") {
      return NextResponse.json(
        { error: "Only trainers can delete slides" },
        { status: 403 },
      );
    }

    if (!slideId) {
      return NextResponse.json(
        { error: "Slide ID is required" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    // Verify course ownership
    const courseCheck = await db.query.courses.findFirst({
      where: and(eq(courses.id, courseId), eq(courses.trainerId, userId)),
    });

    if (!courseCheck) {
      return NextResponse.json(
        { error: "You don't have permission to delete slides in this course" },
        { status: 403 },
      );
    }

    // Get the slide to be deleted
    const slideToDelete = await db.query.slides.findFirst({
      where: and(eq(slides.id, slideId), eq(slides.courseId, courseId)),
    });

    if (!slideToDelete) {
      return NextResponse.json(
        { error: "Slide not found in this course" },
        { status: 404 },
      );
    }

    // Delete the file from Digital Ocean Spaces
    if (slideToDelete.fileUrl) {
      try {
        await deleteFile(slideToDelete.fileUrl);
      } catch (fileError) {
        console.error("Error deleting file from storage:", fileError);
        // Continue with slide deletion even if file deletion fails
      }
    }

    // Delete the slide from the database
    const deletedSlide = await db
      .delete(slides)
      .where(and(eq(slides.id, slideId), eq(slides.courseId, courseId)))
      .returning();

    // Re-order remaining slides if needed
    if (slideToDelete.order !== null) {
      // Get all slides with higher order values
      const slidesToUpdate = await db.query.slides.findMany({
        where: and(
          eq(slides.courseId, courseId),
          gt(slides.order, slideToDelete.order ?? 0),
        ),
      });

      // Update the order of each slide, decreasing by 1
      for (const slide of slidesToUpdate) {
        await db
          .update(slides)
          .set({ order: (slide.order ?? 0) - 1 })
          .where(eq(slides.id, slide.id));
      }
    }

    return NextResponse.json({
      message: "Slide deleted successfully",
      deletedSlide: deletedSlide[0],
    });
  } catch (error) {
    console.error("Error deleting slide:", error);
    return NextResponse.json(
      { error: "Failed to delete slide" },
      { status: 500 },
    );
  }
}
