"use client";

import { useState, useEffect } from "react";
import { type Session } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ThemeSwitch } from "~/components/theme-switch";
import { Logo } from "~/components/ui/logo";
import { type UserRole } from "~/server/auth/role-utils";
import { handleSignOut } from "~/server/auth/auth-actions";
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
  Settings,
  BellDot,
  Award,
  Activity,
} from "lucide-react";

interface NavbarProps {
  session: Session | null;
  userRole?: UserRole;
}

export function RoleBasedNavbar({ session, userRole }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  return (
    <nav className="sticky top-0 z-50 border-b border-notion-gray-light/10 bg-notion-background/95 backdrop-blur-md dark:border-notion-gray-dark/20 dark:bg-notion-background-dark/95">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="group">
            <Logo className="transform transition-transform duration-200 group-hover:scale-105" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <DesktopNav userRole={userRole} />
          </div>
        </div>

        {/* Right side nav items */}
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <NotificationBell />
          <UserMenu
            session={session}
            isProfileOpen={isProfileOpen}
            setIsProfileOpen={setIsProfileOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          userRole={userRole}
          session={session}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}

function DesktopNav({ userRole }: { userRole?: UserRole }) {
  const baseStyles =
    "flex items-center gap-2 rounded-md px-3 py-2 font-geist text-sm font-medium text-notion-text-light/80 transition-all hover:bg-notion-gray-light/10 hover:text-notion-pink dark:text-notion-text-dark/80 dark:hover:bg-notion-gray-dark/20";

  const commonLinks = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/courses", icon: BookOpen, label: "Courses" },
  ];

  const roleSpecificLinks = {
    admin: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/admin/users", icon: Users, label: "Users" },
      { href: "/admin/trainers", icon: Presentation, label: "Trainers" },
      { href: "/admin/courses", icon: Library, label: "Courses" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
    ],
    trainer: [
      { href: "/trainer", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/trainer/courses", icon: Library, label: "My Courses" },
      { href: "/trainer/create", icon: PlusCircle, label: "Create Course" },
      { href: "/trainer/stats", icon: Activity, label: "Analytics" },
    ],
    trainee: [
      { href: "/trainee", icon: GraduationCap, label: "Dashboard" },
      { href: "/trainee/courses", icon: Library, label: "My Learning" },
      { href: "/trainee/achievements", icon: Award, label: "Achievements" },
    ],
  };

  const links = [...commonLinks, ...(roleSpecificLinks[userRole!] ?? [])];

  return (
    <>
      {links.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href} className={`${baseStyles} group`}>
          <Icon
            size={16}
            className="transform transition-transform duration-200 group-hover:scale-110"
          />
          <span>{label}</span>
        </Link>
      ))}
    </>
  );
}

function NotificationBell() {
  return (
    <button className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/20">
      <BellDot
        size={20}
        className="text-notion-text-light/70 dark:text-notion-text-dark/70"
      />
      <span className="absolute right-0 top-0 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-notion-pink opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-notion-pink"></span>
      </span>
    </button>
  );
}

interface UserMenuProps {
  session: Session | null;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

function UserMenu({
  session,
  isProfileOpen,
  setIsProfileOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: UserMenuProps) {
  const user = session?.user;
  const handleSignInClick = () => void signIn(undefined, { callbackUrl: "/" });

  return user ? (
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
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <UserAvatar user={user} />
          <ChevronDown
            size={16}
            className="text-notion-text-light/70 dark:text-notion-text-dark/70"
          />
        </div>

        {isProfileOpen && <ProfileDropdown />}
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
    <button
      onClick={handleSignInClick}
      className="flex items-center gap-2 rounded-md bg-notion-pink px-4 py-2 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md"
    >
      Sign in
    </button>
  );
}

function UserAvatar({
  user,
}: {
  user: { name?: string | null; image?: string | null };
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

function ProfileDropdown() {
  return (
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
  );
}

interface MobileMenuProps {
  userRole?: UserRole;
  session: Session | null;
  onClose: () => void;
}

function MobileMenu({ userRole, session, onClose }: MobileMenuProps) {
  const linkStyles =
    "flex items-center gap-3 rounded-md px-3 py-3 font-geist text-base font-medium text-notion-text-light hover:bg-notion-gray-light/10 dark:text-notion-text-dark dark:hover:bg-notion-gray-dark/20";

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 top-16 z-40 h-[calc(100vh-4rem)] w-full overflow-y-auto bg-notion-background px-4 pb-6 pt-4 dark:bg-notion-background-dark md:hidden"
    >
      <div className="flex flex-col divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/20">
        <MobileNavLinks
          userRole={userRole}
          linkStyles={linkStyles}
          onClose={onClose}
        />
        <MobileUserSection session={session} />
      </div>
    </div>
  );
}

function MobileNavLinks({
  userRole,
  linkStyles,
  onClose,
}: {
  userRole?: UserRole;
  linkStyles: string;
  onClose: () => void;
}) {
  const commonLinks = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/courses", icon: BookOpen, label: "Courses" },
  ];

  const roleSpecificLinks = getRoleSpecificLinks(userRole);
  const links = [...commonLinks, ...roleSpecificLinks];

  return (
    <div className="space-y-1 pb-4">
      {links.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href} className={linkStyles} onClick={onClose}>
          <Icon size={18} />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}

function MobileUserSection({ session }: { session: Session | null }) {
  const user = session?.user;
  const handleSignInClick = () => void signIn(undefined, { callbackUrl: "/" });

  if (!user) {
    return (
      <button
        onClick={handleSignInClick}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-notion-pink px-4 py-3 font-geist text-base font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="space-y-1 pt-4">
      <div className="flex items-center gap-3 px-3 py-3">
        <UserAvatar user={user} />
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
  );
}

function getRoleSpecificLinks(role?: UserRole) {
  switch (role) {
    case "trainer":
      return [
        { href: "/trainer", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/trainer/courses", icon: Library, label: "My Courses" },
        { href: "/trainer/create", icon: PlusCircle, label: "Create Course" },
        { href: "/trainer/stats", icon: Activity, label: "Analytics" },
      ];
    case "admin":
      return [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/users", icon: Users, label: "Users" },
        { href: "/admin/trainers", icon: Presentation, label: "Trainers" },
        { href: "/admin/courses", icon: Library, label: "Courses" },
        { href: "/admin/settings", icon: Settings, label: "Settings" },
      ];
    case "trainee":
      return [
        { href: "/trainee", icon: GraduationCap, label: "Dashboard" },
        { href: "/trainee/courses", icon: Library, label: "My Learning" },
        { href: "/trainee/achievements", icon: Award, label: "Achievements" },
      ];
    default:
      return [];
  }
}
