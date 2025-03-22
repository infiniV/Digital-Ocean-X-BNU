import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { users, courses, enrollments } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "month";
    const limit = parseInt(searchParams.get("limit") ?? "12", 10);

    // Use raw strings for PostgreSQL compatibility
    // This is safer than trying to interpolate variables into interval expressions
    let dateQuery;
    let intervalFormat;

    if (period === "day") {
      intervalFormat = "YYYY-MM-DD";
      dateQuery = sql`
        WITH dates AS (
          SELECT 
            generate_series(
              date_trunc('day', CURRENT_DATE - (${limit} || ' days')::interval),
              date_trunc('day', CURRENT_DATE),
              '1 day'::interval
            )::date AS period_date
        )`;
    } else if (period === "week") {
      intervalFormat = "YYYY-IW";
      dateQuery = sql`
        WITH dates AS (
          SELECT 
            generate_series(
              date_trunc('week', CURRENT_DATE - (${limit} || ' weeks')::interval),
              date_trunc('week', CURRENT_DATE),
              '1 week'::interval
            )::date AS period_date
        )`;
    } else {
      // Default to month
      intervalFormat = "YYYY-MM";
      dateQuery = sql`
        WITH dates AS (
          SELECT 
            generate_series(
              date_trunc('month', CURRENT_DATE - (${limit} || ' months')::interval),
              date_trunc('month', CURRENT_DATE),
              '1 month'::interval
            )::date AS period_date
        )`;
    }

    // User growth query
    const userGrowth = await db.execute(sql`
      ${dateQuery}
      SELECT 
        to_char(d.period_date, ${intervalFormat}) as period,
        count(u.id) as new_users,
        count(CASE WHEN u.role = 'trainee' THEN 1 END) as new_trainees,
        count(CASE WHEN u.role = 'trainer' THEN 1 END) as new_trainers
      FROM dates d
      LEFT JOIN ${users} u ON date_trunc(${period}, u.created_at) = date_trunc(${period}, d.period_date)
      GROUP BY d.period_date
      ORDER BY d.period_date
    `);

    // Course growth query
    const courseGrowth = await db.execute(sql`
      ${dateQuery}
      SELECT 
        to_char(d.period_date, ${intervalFormat}) as period,
        count(c.id) as new_courses,
        count(CASE WHEN c.status = 'published' THEN 1 END) as published_courses
      FROM dates d
      LEFT JOIN ${courses} c ON date_trunc(${period}, c.created_at) = date_trunc(${period}, d.period_date)
      GROUP BY d.period_date
      ORDER BY d.period_date
    `);

    // Enrollment growth query
    const enrollmentGrowth = await db.execute(sql`
      ${dateQuery}
      SELECT 
        to_char(d.period_date, ${intervalFormat}) as period,
        count(e.id) as new_enrollments,
        count(CASE WHEN e.status = 'completed' THEN 1 END) as new_completions
      FROM dates d
      LEFT JOIN ${enrollments} e ON date_trunc(${period}, e.enrolled_at) = date_trunc(${period}, d.period_date)
      GROUP BY d.period_date
      ORDER BY d.period_date
    `);

    return NextResponse.json({
      userGrowth: userGrowth,
      courseGrowth: courseGrowth,
      enrollmentGrowth: enrollmentGrowth,
    });
  } catch (error) {
    console.error("Error fetching growth stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch growth stats" },
      { status: 500 },
    );
  }
}
