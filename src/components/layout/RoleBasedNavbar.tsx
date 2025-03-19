import Link from "next/link";
import { type Session } from "next-auth";
import { signIn, signOut } from "~/server/auth";
import { ThemeSwitch } from "~/components/theme-switch";
import { type UserRole } from "~/server/auth/role-utils";
import {
  BookOpen,
  Home,
  PlusCircle,
  LayoutDashboard,
  Users,
  Library,
  GraduationCap,
  LogOut,
} from "lucide-react";

interface NavbarProps {
  session: Session | null;
  userRole?: UserRole;
}

export function RoleBasedNavbar({ session, userRole }: NavbarProps) {
  const user = session?.user;

  return (
    <nav className="bg-notion-background/80 dark:bg-notion-background-dark/80 sticky top-0 z-50 border-b border-notion-gray-light/10 backdrop-blur-md dark:border-notion-gray-dark/20">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-geist text-xl font-bold tracking-tight text-notion-pink hover:opacity-90"
          >
            Women Empower
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="font-geist flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-notion-text-light/80 transition-all hover:bg-notion-gray-light/10 hover:text-notion-pink dark:text-notion-text-dark/80 dark:hover:bg-notion-gray-dark/20"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
            <Link
              href="/courses"
              className="font-geist flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-notion-text-light/80 transition-all hover:bg-notion-gray-light/10 hover:text-notion-pink dark:text-notion-text-dark/80 dark:hover:bg-notion-gray-dark/20"
            >
              <BookOpen size={16} />
              <span>Courses</span>
            </Link>
            {renderRoleBasedLinks(userRole)}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <ThemeSwitch />
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden text-sm md:block">
                <span className="font-geist font-medium text-notion-text-light/90 dark:text-notion-text-dark/90">
                  {user.name}
                </span>
              </div>
              <div className="relative flex items-center gap-3">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name ?? "User profile"}
                    className="h-9 w-9 rounded-full ring-2 ring-notion-pink/20 transition-all hover:ring-notion-pink/40"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-notion-pink text-notion-text-dark ring-2 ring-notion-pink/20">
                    {user.name ? user.name[0]?.toUpperCase() : "U"}
                  </div>
                )}
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button className="font-geist flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-notion-text-light/80 transition-all hover:bg-notion-gray-light/10 hover:text-notion-pink dark:text-notion-text-dark/80 dark:hover:bg-notion-gray-dark/20">
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn();
              }}
            >
              <button className="font-geist flex items-center gap-2 rounded-md bg-notion-pink px-4 py-2 text-sm font-medium text-notion-text-dark shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md">
                Sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}

function renderRoleBasedLinks(role?: UserRole) {
  const linkStyles =
    "flex items-center gap-2 rounded-md px-3 py-2 font-geist text-sm font-medium text-notion-text-light/80 transition-all hover:bg-notion-gray-light/10 hover:text-notion-pink dark:text-notion-text-dark/80 dark:hover:bg-notion-gray-dark/20";

  switch (role) {
    case "trainer":
      return (
        <>
          <Link href="/trainer/courses" className={linkStyles}>
            <Library size={16} />
            <span>My Courses</span>
          </Link>
          <Link href="/trainer/create" className={linkStyles}>
            <PlusCircle size={16} />
            <span>Create Course</span>
          </Link>
        </>
      );
    case "admin":
      return (
        <>
          <Link href="/admin/dashboard" className={linkStyles}>
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/users" className={linkStyles}>
            <Users size={16} />
            <span>Manage Users</span>
          </Link>
          <Link href="/admin/courses" className={linkStyles}>
            <BookOpen size={16} />
            <span>All Courses</span>
          </Link>
        </>
      );
    case "trainee":
      return (
        <>
          <Link href="/trainee/enrolled" className={linkStyles}>
            <GraduationCap size={16} />
            <span>My Learning</span>
          </Link>
        </>
      );
    default:
      return null;
  }
}
