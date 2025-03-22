import React from "react";
import {
  Trophy,
  Award,
  Star,
  Calendar,
  BookOpen,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";

type AchievementIconType =
  | "trophy"
  | "award"
  | "star"
  | "calendar"
  | "book"
  | "check";

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
  // Map of icon names to their components
  const iconMap: Record<AchievementIconType, LucideIcon> = {
    trophy: Trophy,
    award: Award,
    star: Star,
    calendar: Calendar,
    book: BookOpen,
    check: CheckCircle,
  };

  const IconComponent = iconMap[iconName as AchievementIconType] || Trophy;

  // Create color classes based on the color name and unlock status
  const colorClass = isUnlocked
    ? `text-${iconColor}`
    : "text-notion-gray-light/50 dark:text-notion-gray-dark/50";

  return <IconComponent size={size} className={`${colorClass} ${className}`} />;
};
