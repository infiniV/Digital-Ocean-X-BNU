import React from "react";
import {
  Trophy,
  Award,
  Star,
  Calendar,
  BookOpen,
  CheckCircle,
  Medal,
  FileText,
  type LucideIcon,
} from "lucide-react";

type AchievementIconProps = {
  iconName: string;
  iconColor?: string;
  size?: number;
  className?: string;
  isUnlocked?: boolean;
};

export const AchievementIcon = ({
  iconName,
  iconColor = "notion-pink",
  size = 24,
  className = "",
  isUnlocked = true,
}: AchievementIconProps) => {
  // Map of icon names to their components - expanded with more options
  const iconMap: Record<string, LucideIcon> = {
    trophy: Trophy,
    award: Award,
    star: Star,
    calendar: Calendar,
    book: BookOpen,
    check: CheckCircle,
    medal: Medal,
    file: FileText,
    // Add mappings for achievement types
    course_enrollment: BookOpen,
    course_completion: CheckCircle,
    streak: Calendar,
    slides_milestone: FileText,
    multiple_courses: Medal,
  };

  const IconComponent = iconMap[iconName] ?? Trophy;

  // Use Tailwind classes directly to avoid dynamic class generation issues
  const colorClasses = isUnlocked
    ? `text-${iconColor}`
    : "text-gray-300 dark:text-gray-600";

  return (
    <IconComponent size={size} className={`${colorClasses} ${className}`} />
  );
};
