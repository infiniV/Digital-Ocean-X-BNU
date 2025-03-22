import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { z } from "zod";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// Define validation schema for status update
const statusUpdateSchema = z.object({
  status: z.enum(["draft", "published", "archived"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const session = await auth();
    const { courseId } = await params;

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    // Parse and validate request body
    const body: unknown = await request.json();
    const result = statusUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    const { status } = result.data;

    // Update course status
    await db.update(courses).set({ status }).where(eq(courses.id, courseId));

    return NextResponse.json({ status });
  } catch (error) {
    console.error("Error updating course status:", error);
    return NextResponse.json(
      { error: "Failed to update course status" },
      { status: 500 },
    );
  }
}
