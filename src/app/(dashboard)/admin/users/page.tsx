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
    <main className="bg-notion-background-light min-h-screen space-y-8 px-4 py-8 dark:bg-notion-background-dark sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="text-notion-text/70 hover:dark:text-notion-accent-dark mb-6 inline-flex items-center gap-2 font-geist text-sm transition-colors hover:text-notion-accent dark:text-notion-text-dark/70"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="text-notion-text font-geist text-2xl font-semibold dark:text-notion-text-dark sm:text-3xl">
            Manage Users
          </h1>
          <p className="text-notion-text/70 font-geist dark:text-notion-text-dark/70">
            View and manage all user accounts
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="border-notion-gray/20 rounded-lg border bg-notion-background shadow-notion transition-shadow hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark">
        <div className="border-notion-gray/20 border-b px-6 py-4 dark:border-notion-gray-dark/20">
          <div className="flex items-center justify-between">
            <h2 className="text-notion-text font-geist text-lg font-semibold dark:text-notion-text-dark">
              All Users
            </h2>
            <span className="bg-notion-accent-light/20 text-notion-accent-dark dark:bg-notion-accent-dark/20 dark:text-notion-accent-light rounded-full px-3 py-1 font-geist text-sm font-medium">
              {allUsers.length} users
            </span>
          </div>
        </div>

        <div className="divide-notion-gray/10 divide-y dark:divide-notion-gray-dark/10">
          {allUsers.map((user) => (
            <div
              key={user.id}
              className="group flex items-center justify-between px-notion-lg py-notion-md transition-all duration-300 hover:bg-notion-gray-light/30 dark:hover:bg-notion-gray-dark/40"
            >
              <div className="flex items-center gap-notion-md">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name ?? ""}
                    className="shadow-notion-xs h-12 w-12 rounded-full object-cover ring-2 ring-notion-accent/30 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="shadow-notion-xs flex h-12 w-12 items-center justify-center rounded-full bg-notion-gray-light transition-colors dark:bg-notion-gray-dark">
                    <Users className="text-notion-text/60 h-6 w-6 transition-colors dark:text-notion-text-dark/60" />
                  </div>
                )}
                <div className="space-y-notion-xs">
                  <h3 className="text-notion-text animate-fade-in font-geist text-base font-semibold tracking-tight dark:text-notion-text-dark">
                    {user.name}
                  </h3>
                  <p className="text-notion-text/70 animate-slide-in font-geist text-sm dark:text-notion-text-dark/70">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-notion-md">
                <div className="animate-scale-in">
                  <UserRoleSelect userId={user.id} currentRole={user.role} />
                </div>
                <div className="animate-slide-in">
                  <DeleteUserButton
                    userId={user.id}
                    userName={user.name ?? ""}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
