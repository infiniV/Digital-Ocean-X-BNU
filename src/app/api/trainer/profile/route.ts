import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { hash, compare } from "bcryptjs";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  image: z.string().url().optional(),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6),
});

export async function GET() {
  console.log("[API] Fetching profile from /api/trainer/profile...");
  const session = await auth();
  if (!session?.user || session.user.role !== "trainer") {
    console.error("[API] Unauthorized access attempt to /api/trainer/profile");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const trainer = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });
  if (!trainer) {
    console.error("[API] Trainer not found for user id:", session.user.id);
    return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
  }
  console.log("[API] Returning trainer profile:", {
    id: trainer.id,
    name: trainer.name ?? null,
    email: trainer.email ?? null,
    bio: trainer.bio ?? null,
    image: trainer.image ?? null,
    username: trainer.username ?? null,
    createdAt: trainer.createdAt,
    updatedAt: trainer.updatedAt,
  });
  return NextResponse.json({
    id: trainer.id,
    name: trainer.name ?? null,
    email: trainer.email ?? null,
    bio: trainer.bio ?? null,
    image: trainer.image ?? null,
    username: trainer.username ?? null,
    createdAt: trainer.createdAt,
    updatedAt: trainer.updatedAt,
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "trainer") {
    console.log("[PATCH] Unauthorized access attempt", session?.user);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body: unknown = await req.json();
  console.log("[PATCH] Incoming body:", body);
  const result = updateProfileSchema.safeParse(body);
  if (!result.success) {
    console.log("[PATCH] Validation failed:", result.error.format());
    return NextResponse.json(
      { error: "Invalid data", details: result.error.format() },
      { status: 400 },
    );
  }
  const { name, email, bio, image } = result.data;
  // Fetch current user
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });
  console.log("[PATCH] Current user:", currentUser);
  if (!currentUser) {
    console.log("[PATCH] User not found for id:", session.user.id);
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  // Only check for email uniqueness if the new email is different
  if (email !== undefined && email !== currentUser.email) {
    console.log("[PATCH] Checking for existing user with email:", email);
    const existingUser = await db.query.users.findFirst({
      where: and(eq(users.email, email), ne(users.id, session.user.id)),
    });
    console.log("[PATCH] Existing user with email:", existingUser);
    if (existingUser) {
      console.log("[PATCH] Email already in use error for:", email);
      return NextResponse.json(
        { error: "Email already in use." },
        { status: 409 },
      );
    }
  }
  const updateData: Record<string, string | null | undefined> = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (bio !== undefined) updateData.bio = bio;
  if (image !== undefined) updateData.image = image;
  console.log("[PATCH] Update data:", updateData);
  const [updated] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, session.user.id))
    .returning();
  console.log("[PATCH] Updated user:", updated);
  return NextResponse.json({ trainer: updated });
}

export async function PUT(req: Request) {
  // For password change
  const session = await auth();
  if (!session?.user || session.user.role !== "trainer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body: unknown = await req.json();
  const result = updatePasswordSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid data", details: result.error.format() },
      { status: 400 },
    );
  }
  const { currentPassword, newPassword } = result.data;
  const trainer = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });
  if (!trainer?.hashedPassword) {
    return NextResponse.json({ error: "No password set" }, { status: 400 });
  }
  const valid = await compare(currentPassword, trainer.hashedPassword);
  if (!valid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 },
    );
  }
  const newHashed = await hash(newPassword, 10);
  await db
    .update(users)
    .set({ hashedPassword: newHashed })
    .where(eq(users.id, session.user.id));
  return NextResponse.json({ success: true });
}
