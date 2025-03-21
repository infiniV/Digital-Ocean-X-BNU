"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { type Session } from "next-auth";
import { ThemeSwitch } from "~/components/theme-switch";
import { type UserRole } from "~/server/auth/role-utils";
import { handleSignIn, handleSignOut } from "~/server/auth/auth-actions";
import {
  BookOpen,
  Home,
  PlusCircle,
  LayoutDashboard,
  Users,
  Library,
  GraduationCap,
  LogOut,
  Presentation,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { signIn } from "next-auth/react";

interface NavbarProps {
  session: Session | null;
  userRole?: UserRole;
}

export function RoleBasedNavbar({ session, userRole }: NavbarProps) {
  const user = session?.user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#mobile-menu") && !target.closest("#menu-button")) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleSignInClick = () => {
    void signIn(undefined, { callbackUrl: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-notion-gray-light/10 bg-notion-background/95 backdrop-blur-md dark:border-notion-gray-dark/20 dark:bg-notion-background-dark/95">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-geist text-xl font-bold tracking-tight text-notion-pink hover:opacity-90"
          >
            Women Empower
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 font-geist text-sm font-medium text-notion-text-light/80 transition-all hover:bg-notion-gray-light/10 hover:text-notion-pink dark:text-notion-text-dark/80 dark:hover:bg-notion-gray-dark/20"
            >
              <Home size={16} />
              <span>Home</span>
            </Link>
            <Link
              href="/courses"
              className="flex items-center gap-2 rounded-md px-3 py-2 font-geist text-sm font-medium text-notion-text-light/80 transition-all hover:bg-notion-gray-light/10 hover:text-notion-pink dark:text-notion-text-dark/80 dark:hover:bg-notion-gray-dark/20"
            >
              <BookOpen size={16} />
              <span>Courses</span>
            </Link>
            {renderRoleBasedLinks(userRole)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitch />

          {user ? (
            <div className="relative flex items-center gap-2">
              <div className="hidden text-sm md:block">
                <span className="font-geist font-medium text-notion-text-light/90 dark:text-notion-text-dark/90">
                  {user.name}
                </span>
              </div>

              {/* Desktop Profile */}
              <div className="relative hidden md:block">
                <div
                  className="flex cursor-pointer items-center gap-2"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  {renderUserAvatar(user)}
                  <ChevronDown
                    size={16}
                    className="text-notion-text-light/70 dark:text-notion-text-dark/70"
                  />
                </div>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md border border-notion-gray-light/20 bg-notion-background shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark">
                    <div className="py-1">
                      <form action={handleSignOut}>
                        <button className="flex w-full items-center gap-2 px-4 py-2 text-left font-geist text-sm text-notion-text-light hover:bg-notion-gray-light/10 dark:text-notion-text-dark dark:hover:bg-notion-gray-dark/50">
                          <LogOut size={16} />
                          <span>Sign out</span>
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                id="menu-button"
                className="flex items-center justify-center rounded-md p-2 text-notion-text-light hover:bg-notion-gray-light/10 dark:text-notion-text-dark md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleSignInClick}
                className="flex items-center gap-2 rounded-md bg-notion-pink px-4 py-2 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md"
              >
                Sign in
              </button>

              {/* Mobile Menu Button for non-authenticated users */}
              <button
                id="menu-button"
                className="flex items-center justify-center rounded-md p-2 text-notion-text-light hover:bg-notion-gray-light/10 dark:text-notion-text-dark md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-16 z-40 h-[calc(100vh-4rem)] w-full overflow-y-auto bg-notion-background px-4 pb-6 pt-4 dark:bg-notion-background-dark md:hidden"
        >
          <div className="flex flex-col divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/20">
            <div className="space-y-1 pb-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-md px-3 py-3 font-geist text-base font-medium text-notion-text-light hover:bg-notion-gray-light/10 dark:text-notion-text-dark dark:hover:bg-notion-gray-dark/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link
                href="/courses"
                className="flex items-center gap-3 rounded-md px-3 py-3 font-geist text-base font-medium text-notion-text-light hover:bg-notion-gray-light/10 dark:text-notion-text-dark dark:hover:bg-notion-gray-dark/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen size={18} />
                <span>Courses</span>
              </Link>
              {renderMobileRoleBasedLinks(userRole, () =>
                setIsMobileMenuOpen(false),
              )}
            </div>

            {/* User section */}
            {user ? (
              <div className="space-y-1 pt-4">
                <div className="flex items-center gap-3 px-3 py-3">
                  {renderUserAvatar(user)}
                  <div>
                    <p className="font-geist font-medium text-notion-text-light dark:text-notion-text-dark">
                      {user.name}
                    </p>
                    <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                      {user.email}
                    </p>
                  </div>
                </div>
                <form action={handleSignOut}>
                  <button className="flex w-full items-center gap-3 rounded-md px-3 py-3 font-geist text-base font-medium text-notion-text-light hover:bg-notion-gray-light/10 dark:text-notion-text-dark dark:hover:bg-notion-gray-dark/20">
                    <LogOut size={18} />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            ) : (
              <button
                onClick={handleSignInClick}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-notion-pink px-4 py-3 font-geist text-base font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function renderUserAvatar(user: {
  name?: string | null;
  image?: string | null;
}) {
  if (user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name ?? "User profile"}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-notion-pink/20 transition-all hover:ring-notion-pink/40"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-notion-pink text-white ring-2 ring-notion-pink/20">
      {user.name ? user.name[0]?.toUpperCase() : "U"}
    </div>
  );
}

function renderRoleBasedLinks(role?: UserRole) {
  const linkStyles =
    "flex items-center gap-2 rounded-md px-3 py-2 font-geist text-sm font-medium text-notion-text-light/80 transition-all hover:bg-notion-gray-light/10 hover:text-notion-pink dark:text-notion-text-dark/80 dark:hover:bg-notion-gray-dark/20";

  switch (role) {
    case "trainer":
      return (
        <>
          <Link href="/trainer" className={linkStyles}>
            <Presentation size={16} />
            <span>Dashboard</span>
          </Link>
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

function renderMobileRoleBasedLinks(role?: UserRole, onLinkClick?: () => void) {
  const linkStyles =
    "flex items-center gap-3 rounded-md px-3 py-3 font-geist text-base font-medium text-notion-text-light hover:bg-notion-gray-light/10 dark:text-notion-text-dark dark:hover:bg-notion-gray-dark/20";

  switch (role) {
    case "trainer":
      return (
        <>
          <Link href="/trainer" className={linkStyles} onClick={onLinkClick}>
            <Presentation size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/trainer/courses"
            className={linkStyles}
            onClick={onLinkClick}
          >
            <Library size={18} />
            <span>My Courses</span>
          </Link>
          <Link
            href="/trainer/create"
            className={linkStyles}
            onClick={onLinkClick}
          >
            <PlusCircle size={18} />
            <span>Create Course</span>
          </Link>
        </>
      );
    case "admin":
      return (
        <>
          <Link
            href="/admin/dashboard"
            className={linkStyles}
            onClick={onLinkClick}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/users"
            className={linkStyles}
            onClick={onLinkClick}
          >
            <Users size={18} />
            <span>Manage Users</span>
          </Link>
          <Link
            href="/admin/courses"
            className={linkStyles}
            onClick={onLinkClick}
          >
            <BookOpen size={18} />
            <span>All Courses</span>
          </Link>
        </>
      );
    case "trainee":
      return (
        <>
          <Link
            href="/trainee/enrolled"
            className={linkStyles}
            onClick={onLinkClick}
          >
            <GraduationCap size={18} />
            <span>My Learning</span>
          </Link>
        </>
      );
    default:
      return null;
  }
}
