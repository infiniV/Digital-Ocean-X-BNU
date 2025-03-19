import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { users, type roleEnum } from "~/server/db/schema";
import { type Session } from "next-auth";

export type UserRole = (typeof roleEnum.enumValues)[number];

/**
 * Check if a user has a specific role
 */
export async function hasRole(
  userId: string,
  role: UserRole,
): Promise<boolean> {
  if (!userId) return false;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  return user?.role === role;
}

/**
 * Check if the current user is a trainer
 */
export function isTrainer(session: Session | null): boolean {
  return session?.user?.role === "trainer";
}

/**
 * Check if the current user is an admin
 */
export function isAdmin(session: Session | null): boolean {
  return session?.user?.role === "admin";
}

/**
 * Update a user's role
 */
export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<boolean> {
  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));
    return true;
  } catch (error) {
    console.error("Failed to update user role:", error);
    return false;
  }
}

/**
 * Middleware to check if user has required role
 * For use in Server Actions or API routes
 */
export async function requireRole(
  userId: string,
  role: UserRole,
): Promise<void> {
  const hasRequiredRole = await hasRole(userId, role);

  if (!hasRequiredRole) {
    throw new Error(`Access denied. Required role: ${role}`);
  }
}
