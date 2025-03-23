import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import {
  users,
  enrollments,
  courses,
  slideProgress,
  notes,
  userAchievements,
  achievements,
  learningStreaks,
} from "~/server/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate course completion rate
    const courseCompletionStats = await db.execute(sql`
      WITH total_enrollments AS (
        SELECT 
          c.id as course_id, 
          c.title as course_title,
          COUNT(e.id) as enrollment_count
        FROM ${courses} c
        JOIN ${enrollments} e ON c.id = e.course_id
        WHERE c.status = 'published'
        GROUP BY c.id, c.title
      ),
      completed_enrollments AS (
        SELECT 
          c.id as course_id,
          COUNT(e.id) as completed_count
        FROM ${courses} c
        JOIN ${enrollments} e ON c.id = e.course_id
        WHERE c.status = 'published' AND e.status = 'completed'
        GROUP BY c.id
      )
      SELECT 
        te.course_id,
        te.course_title as title,
        te.enrollment_count as total,
        COALESCE(ce.completed_count, 0) as completed,
        CASE 
          WHEN te.enrollment_count > 0 THEN 
            ROUND((COALESCE(ce.completed_count, 0) * 100.0) / te.enrollment_count, 2)
          ELSE 0
        END as completion_rate
      FROM total_enrollments te
      LEFT JOIN completed_enrollments ce ON te.course_id = ce.course_id
      ORDER BY completion_rate DESC
      LIMIT 10
    `);

    // Calculate achievement statistics - fixed to use schema object
    const achievementStats = await db.execute(sql`
      SELECT 
        a.id,
        a.title,
        a.type,
        COUNT(ua.id) as total_earners,
        ROUND(AVG(ua.progress)::numeric, 2) as average_progress
      FROM ${userAchievements} ua
      JOIN ${achievements} a ON ua.achievement_id = a.id
      GROUP BY a.id, a.title, a.type
      ORDER BY total_earners DESC
      LIMIT 10
    `);

    // Calculate trainee activity metrics (notes, streaks)
    const activityStats = await db.execute(sql`
      WITH trainee_notes AS (
        SELECT 
          n.trainee_id,
          COUNT(n.id) as notes_count
        FROM ${notes} n
        GROUP BY n.trainee_id
      ),
      trainee_streaks AS (
        SELECT 
          ls.user_id,
          MAX(ls.current_streak) as current_streak,
          MAX(ls.longest_streak) as longest_streak
        FROM ${learningStreaks} ls
        GROUP BY ls.user_id
      ),
      trainee_progress AS (
        SELECT 
          sp.trainee_id,
          COUNT(CASE WHEN sp.completed = true THEN 1 END) as slides_completed
        FROM ${slideProgress} sp
        GROUP BY sp.trainee_id
      )
      SELECT
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY COALESCE(tn.notes_count, 0)) as median_notes,
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY COALESCE(ts.longest_streak, 0)) as median_streak,
        PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY COALESCE(tp.slides_completed, 0)) as median_slides_completed,
        ROUND(AVG(COALESCE(tn.notes_count, 0)), 2) as average_notes,
        ROUND(AVG(COALESCE(ts.longest_streak, 0)), 2) as average_streak,
        ROUND(AVG(COALESCE(tp.slides_completed, 0)), 2) as average_slides_completed,
        MAX(COALESCE(ts.longest_streak, 0)) as max_streak
      FROM ${users} u
      LEFT JOIN trainee_notes tn ON u.id = tn.trainee_id
      LEFT JOIN trainee_streaks ts ON u.id = ts.user_id
      LEFT JOIN trainee_progress tp ON u.id = tp.trainee_id
      WHERE u.role = 'trainee'
    `);

    // Calculate course activity over time (daily for the last 30 days)
    const courseActivityTrend = await db.execute(sql`
      WITH dates AS (
        SELECT 
          generate_series(
            date_trunc('day', CURRENT_DATE - INTERVAL '30 days'),
            date_trunc('day', CURRENT_DATE),
            INTERVAL '1 day'
          )::date AS day
      ),
      daily_progress AS (
        SELECT 
          date_trunc('day', sp.completed_at) as day,
          COUNT(sp.id) as slides_viewed
        FROM ${slideProgress} sp
        WHERE sp.completed_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY date_trunc('day', sp.completed_at)
      ),
      daily_notes AS (
        SELECT 
          date_trunc('day', n.created_at) as day,
          COUNT(n.id) as notes_created
        FROM ${notes} n
        WHERE n.created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY date_trunc('day', n.created_at)
      )
      SELECT 
        to_char(d.day, 'YYYY-MM-DD') as date,
        COALESCE(dp.slides_viewed, 0) as slides_viewed,
        COALESCE(dn.notes_created, 0) as notes_created
      FROM dates d
      LEFT JOIN daily_progress dp ON d.day = dp.day
      LEFT JOIN daily_notes dn ON d.day = dn.day
      ORDER BY d.day
    `);

    return NextResponse.json({
      courseCompletion: courseCompletionStats,
      achievements: achievementStats,
      activity: activityStats[0] ?? {},
      dailyActivity: courseActivityTrend,
    });
  } catch (error) {
    console.error("Error fetching engagement stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch engagement stats" },
      { status: 500 },
    );
  }
}
