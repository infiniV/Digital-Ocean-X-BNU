import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { ChevronLeft, Users } from "lucide-react";
import { UserRoleSelect } from "./_components/UserRoleSelect";
import { DeleteUserButton } from "./_components/DeleteUserButton";

export default async function AdminUsersPage() {
  // Get all users with their stats
  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.createdAt)],
  });

  return (
    <main className="min-h-screen space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 font-geist text-sm text-notion-text-light/70 transition-colors hover:text-notion-pink dark:text-notion-text-dark/70"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
            Manage Users
          </h1>
          <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
            View and manage all user accounts
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
        <div className="border-b border-notion-gray-light/20 px-6 py-4 dark:border-notion-gray-dark/20">
          <div className="flex items-center justify-between">
            <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              All Users
            </h2>
            <span className="rounded-full bg-notion-pink/10 px-3 py-1 font-geist text-sm font-medium text-notion-pink">
              {allUsers.length} users
            </span>
          </div>
        </div>

        <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
          {allUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-4">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name ?? ""}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-notion-gray-light/10 dark:bg-notion-gray-dark/30">
                    <Users className="h-5 w-5 text-notion-text-light/50 dark:text-notion-text-dark/50" />
                  </div>
                )}
                <div>
                  <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                    {user.name}
                  </h3>
                  <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <UserRoleSelect userId={user.id} currentRole={user.role} />
                <DeleteUserButton userId={user.id} userName={user.name ?? ""} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
