import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { hash } from "bcryptjs";
import { uploadFile } from "~/lib/storage";
import { z } from "zod";
import { auth } from "~/server/auth";
import { eq, or } from "drizzle-orm";

// Interface for create trainer request
export interface CreateTrainerRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  bio?: string;
  image?: File;
}

const createTrainerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  name: z.string().min(1),
  email: z.string().email().optional(),
  bio: z.string().optional(),
});

export async function POST(request: Request) {
  // Only allow admins
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Parse multipart form data
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const email =
    (formData.get("email") as string) || `${username}@trainer.generated`;
  const bio = formData.get("bio") as string | undefined;
  const image = formData.get("image") as File | null;

  // Validate
  const result = createTrainerSchema.safeParse({
    username,
    password,
    name,
    email,
    bio,
  });
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.format() },
      { status: 400 },
    );
  }
  // Check for existing username/email
  const existing = await db.query.users.findFirst({
    where: or(
      eq(users.username, username),
      email ? eq(users.email, email) : undefined,
    ),
  });
  if (existing) {
    return NextResponse.json(
      { error: "Username or email already exists" },
      { status: 409 },
    );
  }

  // Hash password
  const hashedPassword: string = await (
    hash as unknown as (
      password: string,
      saltOrRounds: number,
    ) => Promise<string>
  )(password, 10);

  // Upload image if provided
  let imageUrl: string | null = null;
  if (image) {
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    imageUrl = await uploadFile(
      buffer,
      image.name,
      image.type,
      "profile-images",
    );
  } // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      username,
      name,
      email, // Email is already defaulted to username@trainer.generated earlier
      bio: bio ?? null,
      image: imageUrl,
      hashedPassword,
      role: "trainer",
      verificationStatus: "pending",
    })
    .returning();

  return NextResponse.json({ user: newUser }, { status: 201 });
}
