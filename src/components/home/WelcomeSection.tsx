import Link from "next/link";
import { type User } from "next-auth";
import {
  ChevronRight,
  Users,
  BookOpen,
  Presentation,
  Settings,
  Trophy,
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
        href: "/trainee",
        icon: BookOpen,
        label: "My Learning",
        description: "Continue your enrolled courses",
      },
      {
        href: "/trainee/achievements",
        icon: Trophy,
        label: "Achievements",
        description: "Track your learning milestones",
      },
      {
        href: "/trainee/courses",
        icon: Presentation,
        label: "My Courses",
        description: "View all your enrolled courses",
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
    <div className="relative isolate overflow-hidden">
      <div className="px-6 py-16 sm:py-24 lg:px-8">
        {/* Welcome Section */}
        <div className="mx-auto max-w-2xl animate-fade-in space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-6xl">
            Welcome back, {user.name?.split(" ")[0]}!
          </h1>
          <p className="text-lg leading-8 text-notion-text-light/70 dark:text-notion-text-dark/70">
            {getWelcomeMessage()}
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group relative flex animate-fade-in flex-col gap-5 rounded-2xl border border-notion-gray-light/20 bg-notion-background p-6 shadow-notion transition-all duration-300 ease-out hover:translate-y-[-2px] hover:border-notion-pink hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-notion-pink/10 text-notion-pink ring-1 ring-notion-pink/20 transition-all duration-300 group-hover:bg-notion-pink group-hover:text-white group-hover:ring-notion-pink/50 dark:bg-notion-pink/5 dark:ring-notion-pink/10">
                    <Icon size={26} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
                      {action.label}
                    </h3>
                    <p className="text-sm leading-relaxed text-notion-text-light/70 dark:text-notion-text-dark/70">
                      {action.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={20}
                    className="absolute bottom-6 right-6 text-notion-text-light/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-notion-pink dark:text-notion-text-dark/30"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
