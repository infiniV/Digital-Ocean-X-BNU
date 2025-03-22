import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { users, verificationStatusEnum } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Define validation schema for request body
const updateVerificationSchema = z.object({
  status: z.enum(verificationStatusEnum.enumValues),
});

interface RouteParams {
  params: {
    trainerId: string;
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

    const { trainerId } = params;

    // Parse and validate request body
    const rawBody: unknown = await request.json();
    const result = updateVerificationSchema.safeParse(rawBody);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid verification status provided" },
        { status: 400 },
      );
    }

    const { status } = result.data;

    // Check if trainer exists and is a trainer
    const trainer = await db.query.users.findFirst({
      where: eq(users.id, trainerId),
    });

    if (!trainer || trainer.role !== "trainer") {
      return NextResponse.json(
        { error: "User not found or is not a trainer" },
        { status: 404 },
      );
    }

    // Update trainer verification status
    const [updatedTrainer] = await db
      .update(users)
      .set({ verificationStatus: status })
      .where(eq(users.id, trainerId))
      .returning();

    return NextResponse.json({ trainer: updatedTrainer });
  } catch (error) {
    console.error("Error updating trainer verification status:", error);
    return NextResponse.json(
      { error: "Failed to update trainer verification status" },
      { status: 500 },
    );
  }
}
