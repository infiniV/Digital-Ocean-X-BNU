import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { courses, users, enrollments, slides } from "~/server/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await db.transaction(async (tx) => {
      const [
        totalUsers,
        totalTrainers,
        totalTrainees,
        totalCourses,
        totalPublishedCourses,
        totalEnrollments,
        totalCompletions,
        totalSlides,
      ] = await Promise.all([
        tx
          .select({ count: count() })
          .from(users)
          .then((res) => res[0]?.count ?? 0),
        tx
          .select({ count: count() })
          .from(users)
          .where(eq(users.role, "trainer"))
          .then((res) => res[0]?.count ?? 0),
        tx
          .select({ count: count() })
          .from(users)
          .where(eq(users.role, "trainee"))
          .then((res) => res[0]?.count ?? 0),
        tx
          .select({ count: count() })
          .from(courses)
          .then((res) => res[0]?.count ?? 0),
        tx
          .select({ count: count() })
          .from(courses)
          .where(eq(courses.status, "published"))
          .then((res) => res[0]?.count ?? 0),
        tx
          .select({ count: count() })
          .from(enrollments)
          .then((res) => res[0]?.count ?? 0),
        tx
          .select({ count: count() })
          .from(enrollments)
          .where(eq(enrollments.status, "completed"))
          .then((res) => res[0]?.count ?? 0),
        tx
          .select({ count: count() })
          .from(slides)
          .then((res) => res[0]?.count ?? 0),
      ]);

      return {
        totalUsers,
        totalTrainers,
        totalTrainees,
        totalCourses,
        totalPublishedCourses,
        totalEnrollments,
        totalCompletions,
        totalSlides,
      };
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
