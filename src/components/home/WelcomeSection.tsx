import { type User } from "next-auth";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

interface WelcomeSectionProps {
  user: User & {
    role?: string;
    name?: string | null;
  };
}

export function WelcomeSection({ user }: WelcomeSectionProps) {
  const isTrainee = user.role === "trainee";
  const dashboardLink = isTrainee ? "/trainee" : "/trainer";

  return (
    <div className="relative min-h-[60vh] overflow-hidden bg-notion-background dark:bg-notion-background-dark">
      <div className="absolute inset-0 opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" className="fill-notion-pink/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-notion-pink/10 px-4 py-2 font-geist text-notion-pink">
              <Sparkles size={16} />
              Welcome back, {user.name ?? "there"}!
            </span>
          </div>

          <h1 className="font-geist text-4xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-5xl">
            {isTrainee
              ? "Continue Your Learning Journey"
              : "Manage Your Courses"}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-geist text-xl text-notion-text-light/80 dark:text-notion-text-dark/80">
            {isTrainee
              ? "Pick up where you left off or explore new courses to enhance your skills."
              : "Create, manage, and track the progress of your courses and students."}
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              href={dashboardLink}
              className="group inline-flex items-center gap-2 rounded-lg bg-notion-pink px-6 py-3 font-geist text-white shadow-notion transition-all hover:shadow-notion-hover"
            >
              <BookOpen size={18} />
              <span>Go to Dashboard</span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
