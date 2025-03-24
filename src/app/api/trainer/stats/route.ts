import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import {
  courses,
  enrollments,
  slides,
  slideProgress,
} from "~/server/db/schema";
import { eq, and, count, sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "trainer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trainerId = session.user.id;

    // Get course statistics
    const [courseStats] = await db
      .select({
        totalCourses: count(),
        publishedCourses: count(and(eq(courses.status, "published"))),
        draftCourses: count(and(eq(courses.status, "draft"))),
      })
      .from(courses)
      .where(eq(courses.trainerId, trainerId));

    // Get enrollment statistics
    const enrollmentStats = await db.execute(sql`
      SELECT 
        COUNT(e.id) as total_enrollments,
        COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_enrollments,
        COUNT(CASE WHEN e.status = 'active' THEN 1 END) as active_enrollments,
        ROUND(CAST(AVG(CASE WHEN e.status = 'active' THEN e.progress ELSE NULL END) AS NUMERIC), 2) as avg_progress
      FROM ${courses} c
      LEFT JOIN ${enrollments} e ON c.id = e.course_id
      WHERE c.trainer_id = ${trainerId}
    `);

    // Get content statistics
    const contentStats = await db.execute(sql`
      WITH slide_stats AS (
        SELECT 
          COUNT(s.id) as total_slides,
          COUNT(DISTINCT sp.trainee_id) as unique_viewers,
          COUNT(CASE WHEN sp.completed = true THEN 1 END) as total_completions
        FROM ${courses} c
        LEFT JOIN ${slides} s ON c.id = s.course_id
        LEFT JOIN ${slideProgress} sp ON s.id = sp.slide_id
        WHERE c.trainer_id = ${trainerId}
      )
      SELECT 
        total_slides,
        unique_viewers,
        total_completions,
        CASE 
          WHEN total_slides > 0 THEN 
            ROUND(CAST((total_completions::float / NULLIF(total_slides * NULLIF(unique_viewers, 0), 0)) * 100 AS NUMERIC), 2)
          ELSE 0 
        END as completion_rate
      FROM slide_stats
    `);

    return NextResponse.json({
      courseStats,
      enrollmentStats: enrollmentStats[0],
      contentStats: contentStats[0],
    });
  } catch (error) {
    console.error("Error fetching trainer stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainer statistics" },
      { status: 500 },
    );
  }
}
