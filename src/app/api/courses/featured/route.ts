import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "~/server/db";
import { courses, users } from "~/server/db/schema";

export async function GET() {
  try {
    const featuredCourses = await db
      .select({
        id: courses.id,
        title: courses.title,
        slug: courses.slug,
        shortDescription: courses.shortDescription,
        coverImageUrl: courses.coverImageUrl,
        isFeatured: courses.isFeatured,
        trainerId: courses.trainerId,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        trainer: {
          name: users.name,
          image: users.image,
        },
      })
      .from(courses)
      .leftJoin(users, eq(courses.trainerId, users.id))
      .where(eq(courses.isFeatured, true))
      .limit(4);

    return NextResponse.json({ courses: featuredCourses });
  } catch (error) {
    console.error("Failed to fetch featured courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured courses" },
      { status: 500 }
    );
  }
}