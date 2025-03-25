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
  Flame,
  Compass,
  type LucideIcon,
} from "lucide-react";

type AchievementIconProps = {
  iconName: string;
  iconColor?: string;
  size?: number;
  className?: string;
  isUnlocked?: boolean;
};

const colorMap: Record<string, string> = {
  "notion-pink": "text-notion-pink dark:text-notion-pink-light",
  "amber-500": "text-amber-500 dark:text-amber-400",
  "blue-500": "text-blue-500 dark:text-blue-400",
  "green-500": "text-green-500 dark:text-green-400",
  "red-500": "text-red-500 dark:text-red-400",
  "purple-500": "text-purple-500 dark:text-purple-400",
};

export const AchievementIcon = ({
  iconName,
  iconColor = "notion-pink",
  size = 24,
  className = "",
  isUnlocked = true,
}: AchievementIconProps) => {
  // Map of icon names to their components
  const iconMap: Record<string, LucideIcon> = {
    trophy: Trophy,
    award: Award,
    star: Star,
    calendar: Calendar,
    book: BookOpen,
    check: CheckCircle,
    medal: Medal,
    file: FileText,
    flame: Flame,
    compass: Compass,
    // Achievement type mappings
    course_enrollment: BookOpen,
    course_completion: Trophy,
    streak: Flame,
    slides_milestone: Star,
    multiple_courses: Compass,
  };

  const IconComponent = iconMap[iconName] ?? Trophy;

  const colorClass = isUnlocked 
    ? colorMap[iconColor] ?? "text-notion-pink dark:text-notion-pink-light"
    : "text-notion-gray-light/40 dark:text-notion-gray-dark/40";

  return (
    <IconComponent 
      size={size} 
      className={`${colorClass} ${className}`}
      aria-hidden="true"
    />
  );
};
