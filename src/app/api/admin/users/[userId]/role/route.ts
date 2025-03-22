import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Define validation schema for request body
const updateRoleSchema = z.object({
  role: z.enum(["trainee", "trainer", "admin"]),
});

interface RouteParams {
  params: {
    userId: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 },
      );
    }

    const { userId } = params;

    // Parse and validate request body
    const body: unknown = await request.json();
    const result = updateRoleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 },
      );
    }

    const { role } = result.data;

    // Update user role
    const [updatedUser] = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 },
    );
  }
}
