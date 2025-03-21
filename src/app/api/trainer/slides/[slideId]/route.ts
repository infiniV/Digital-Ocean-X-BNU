import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { slides, courses } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { deleteFile } from "~/lib/storage";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slideId: string }> },
) {
  try {
    const session = await auth();
    const { slideId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "trainer") {
      return NextResponse.json(
        { error: "Only trainers can delete slides" },
        { status: 403 },
      );
    }

    // Get slide with course info to verify ownership
    const slide = await db.query.slides.findFirst({
      where: eq(slides.id, slideId),
      with: {
        course: {
          columns: {
            trainerId: true,
          },
        },
      },
    });

    if (!slide) {
      return NextResponse.json({ error: "Slide not found" }, { status: 404 });
    }

    // Verify ownership
    if (slide.course.trainerId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this slide" },
        { status: 403 },
      );
    }

    // Delete file from storage
    if (slide.fileUrl) {
      await deleteFile(slide.fileUrl);
    }

    // Delete slide from database
    const deletedSlide = await db
      .delete(slides)
      .where(eq(slides.id, slideId))
      .returning();

    return NextResponse.json({
      message: "Slide deleted successfully",
      slide: deletedSlide[0],
    });
  } catch (error) {
    console.error("Error deleting slide:", error);
    return NextResponse.json(
      { error: "Failed to delete slide" },
      { status: 500 },
    );
  }
}
