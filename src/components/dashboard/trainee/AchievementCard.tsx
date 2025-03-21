import { Trophy, Award, Star } from "lucide-react";

interface AchievementCardProps {
  completedCourses: number;
  totalSlides: number;
  learningStreak?: number;
}

export function AchievementCard({
  completedCourses,
  totalSlides,
  learningStreak = 0,
}: AchievementCardProps) {
  return (
    <div className="rounded-xl border border-notion-gray-light/20 bg-notion-background p-6 shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-background-dark">
      <h3 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
        Achievements
      </h3>
      <div className="mt-4 space-y-4">
        {completedCourses > 0 && (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-notion-pink/10 p-2">
              <Trophy size={20} className="text-notion-pink" />
            </div>
            <div>
              <p className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                Course Champion
              </p>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Completed {completedCourses} courses
              </p>
            </div>
          </div>
        )}
        {totalSlides > 0 && (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-notion-pink/10 p-2">
              <Star size={20} className="text-notion-pink" />
            </div>
            <div>
              <p className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                Dedicated Learner
              </p>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Completed {totalSlides} slides
              </p>
            </div>
          </div>
        )}
        {learningStreak > 0 && (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-notion-pink/10 p-2">
              <Award size={20} className="text-notion-pink" />
            </div>
            <div>
              <p className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                Learning Streak
              </p>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                {learningStreak} days in a row
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
