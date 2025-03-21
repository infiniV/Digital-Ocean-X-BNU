"use server";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { enrollments, courses } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * Server action to enroll a trainee in a course
 */
export async function enrollInCourse(courseId: string) {
  try {
    // Get the current session
    const session = await auth();

    // Check if user is authenticated
    if (!session || !session.user) {
      throw new Error("You must be signed in to enroll in a course");
    }

    // Check if user is a trainee
    if (session.user.role !== "trainee") {
      throw new Error("Only trainees can enroll in courses");
    }

    // Verify course exists
    const courseExists = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!courseExists) {
      throw new Error("Course not found");
    }

    // Check if the course is published
    if (courseExists.status !== "published") {
      throw new Error("Cannot enroll in unpublished courses");
    }

    // Check if already enrolled
    const existingEnrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.traineeId, session.user.id),
        eq(enrollments.courseId, courseId),
      ),
    });

    if (existingEnrollment) {
      throw new Error("You're already enrolled in this course");
    }

    // Create enrollment
    await db
      .insert(enrollments)
      .values({
        traineeId: session.user.id,
        courseId: courseId,
        status: "active",
        enrolledAt: new Date(),
        progress: 0,
      })
      .returning();

    // Redirect to trainee dashboard
    redirect("/trainee");
  } catch (error) {
    // Rethrow the error to be handled in the component
    throw error;
  }
}
