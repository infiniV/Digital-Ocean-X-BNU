import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses } from "~/server/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "5");

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Get total count
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses);

    // Get paginated courses
    const paginatedCourses = await db.query.courses.findMany({
      orderBy: [desc(courses.createdAt)],
      limit: pageSize,
      offset,
      with: {
        trainer: {
          columns: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      courses: paginatedCourses,
      total: totalResult?.count ?? 0,
    });
  } catch (error) {
    console.error("Error fetching recent courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}