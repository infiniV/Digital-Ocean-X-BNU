import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses, slides } from "~/server/db/schema";
import { and, eq, count } from "drizzle-orm";

interface ActionRequest {
  action: "finalize";
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const session = await auth();
    const { courseId } = params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "trainer") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = (await req.json()) as ActionRequest;

    if (body.action === "finalize") {
      // Verify course ownership
      const course = await db.query.courses.findFirst({
        where: and(
          eq(courses.id, courseId),
          eq(courses.trainerId, session.user.id),
        ),
      });

      if (!course) {
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 },
        );
      }

      // Check if course has at least one slide
      const slideCountResult = await db
        .select({ value: count() })
        .from(slides)
        .where(eq(slides.courseId, courseId));

      if (!slideCountResult[0] || slideCountResult[0].value === 0) {
        return NextResponse.json(
          { error: "Cannot finalize course without slides" },
          { status: 400 },
        );
      }

      // Update course status to under_review
      const updatedCourse = await db
        .update(courses)
        .set({ status: "under_review" })
        .where(eq(courses.id, courseId))
        .returning();

      return NextResponse.json(updatedCourse[0]);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating course:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}
