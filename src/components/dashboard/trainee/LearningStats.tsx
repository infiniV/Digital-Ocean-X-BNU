import { GraduationCap, BookOpen, Clock, Trophy } from "lucide-react";

interface StatsProps {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalSlides: number;
}

export function LearningStats({
  totalCourses,
  completedCourses,
  inProgressCourses,
  totalSlides,
}: StatsProps) {
  const stats = [
    {
      label: "Enrolled Courses",
      value: totalCourses,
      icon: GraduationCap,
      color: "text-notion-pink bg-notion-pink/10",
    },
    {
      label: "Completed",
      value: completedCourses,
      icon: Trophy,
      color:
        "text-emerald-600 bg-emerald-100/80 dark:text-emerald-400 dark:bg-emerald-900/20",
    },
    {
      label: "In Progress",
      value: inProgressCourses,
      icon: Clock,
      color:
        "text-blue-600 bg-blue-100/80 dark:text-blue-400 dark:bg-blue-900/20",
    },
    {
      label: "Total Slides",
      value: totalSlides,
      icon: BookOpen,
      color:
        "text-violet-600 bg-violet-100/80 dark:text-violet-400 dark:bg-violet-900/20",
    },
  ];

  return (
    <div className="gap-notion-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-xl border border-notion-gray-light/20 bg-notion-background p-6 shadow-notion transition-all hover:border-notion-pink/20 hover:shadow-notion-hover dark:border-notion-gray-dark/20 dark:bg-notion-background-dark"
        >
          <div
            className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
          >
            <stat.icon size={24} />
          </div>
          <p className="font-geist text-base font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            {stat.label}
          </p>
          <p className="font-geist text-3xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
