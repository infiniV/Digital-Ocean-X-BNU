import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: {
    courseId: string;
  };
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const { courseId } = params;

    // Delete course and all related data (slides, enrollments, etc. will be cascade deleted)
    await db.delete(courses).where(eq(courses.id, courseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
