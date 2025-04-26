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
  // Safely access role property with nullish coalescing
  const role = user?.role ?? "trainee";
  const isAdmin = role === "admin";
  const isTrainer = role === "trainer";
  // const isTrainee = role === "trainee";

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
    <div className="relative isolate h-full overflow-hidden bg-notion-background transition-colors duration-300 dark:bg-notion-background-dark">
      <div className="relative px-6 py-20 sm:py-28 lg:px-8">
        {/* Welcome Section */}
        <div className="mx-auto max-w-2xl space-y-8 text-center">
          <h1 className="animate-slide-down font-geist text-4xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-5xl lg:text-6xl">
            Welcome back,{" "}
            <span className="text-notion-pink">
              {user.name?.split(" ")[0]}!
            </span>
          </h1>
          <p className="animation-delay-200 animate-slide-up text-lg leading-8 text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-xl">
            {getWelcomeMessage()}
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="mx-auto mt-16 max-w-7xl lg:mt-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group relative flex animate-slide-up flex-col gap-5 rounded-2xl border border-notion-gray-light/20 bg-notion-background/50 p-6 shadow-notion backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-notion-pink hover:shadow-notion-hover focus:outline-none focus:ring-2 focus:ring-notion-pink/30 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/30"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-xl bg-notion-pink/10 text-notion-pink ring-1 ring-notion-pink/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-notion-pink group-hover:text-white group-hover:ring-notion-pink dark:bg-notion-pink/5 dark:ring-notion-pink/10"
                    aria-hidden="true"
                  >
                    <Icon size={28} />
                  </div>

                  <div className="flex-1 space-y-3">
                    <h3 className="font-geist text-xl font-semibold text-notion-text-light transition-colors duration-300 group-hover:text-notion-pink dark:text-notion-text-dark">
                      {action.label}
                    </h3>
                    <p className="text-base leading-relaxed text-notion-text-light/70 dark:text-notion-text-dark/70">
                      {action.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={20}
                    className="absolute bottom-6 right-6 text-notion-text-light/30 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-notion-pink dark:text-notion-text-dark/30"
                    aria-hidden="true"
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
