import Link from "next/link";
import { type User } from "next-auth";
import {
  ChevronRight,
  Users,
  BookOpen,
  Presentation,
  Settings,
} from "lucide-react";

interface WelcomeSectionProps {
  user: User;
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
  const isAdmin = user.role === "admin";
  const isTrainer = user.role === "trainer";
  // const isTrainee = user.role === "trainee";

  const getQuickActions = () => {
    if (isAdmin) {
      return [
        {
          href: "/admin/users",
          icon: Users,
          label: "Manage Users",
          description: "View and manage user accounts",
        },
        {
          href: "/admin/courses",
          icon: BookOpen,
          label: "Manage Courses",
          description: "Review and moderate courses",
        },
        {
          href: "/admin/trainers",
          icon: Presentation,
          label: "Manage Trainers",
          description: "Monitor trainer activity",
        },
        {
          href: "/admin/settings",
          icon: Settings,
          label: "Platform Settings",
          description: "Configure platform settings",
        },
      ];
    }
    if (isTrainer) {
      return [
        {
          href: "/trainer/courses",
          icon: BookOpen,
          label: "My Courses",
          description: "View and manage your courses",
        },
        {
          href: "/trainer/create",
          icon: Presentation,
          label: "Create Course",
          description: "Start creating a new course",
        },
      ];
    }
    return [
      {
        href: "/trainee/courses",
        icon: BookOpen,
        label: "My Learning",
        description: "Continue your enrolled courses",
      },
    ];
  };

  const getWelcomeMessage = () => {
    if (isAdmin) {
      return "Monitor and manage all aspects of the platform";
    }
    if (isTrainer) {
      return "Create and manage your courses";
    }
    return "Continue your learning journey";
  };

  const quickActions = getQuickActions();

  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-notion-background via-notion-background to-notion-gray-light/5 dark:from-notion-background-dark dark:via-notion-background-dark dark:to-notion-gray-dark/5">
      <div className="px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-6xl">
            Welcome back, {user.name?.split(" ")[0]}!
          </h1>
          <p className="mt-6 text-lg leading-8 text-notion-text-light/70 dark:text-notion-text-dark/70">
            {getWelcomeMessage()}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group relative flex flex-col gap-4 rounded-2xl border border-notion-gray-light/20 bg-white p-6 shadow-sm transition-all hover:border-notion-pink/20 hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-notion-pink/5 text-notion-pink transition-colors group-hover:bg-notion-pink group-hover:text-white">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
                    {action.label}
                  </h3>
                  <p className="mt-1 text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                    {action.description}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="absolute bottom-6 right-6 text-notion-text-light/30 transition-transform group-hover:translate-x-1 group-hover:text-notion-pink dark:text-notion-text-dark/30"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
