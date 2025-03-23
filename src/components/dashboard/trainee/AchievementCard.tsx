import { AchievementIcon } from "./AchievementIcon";

interface Achievement {
  title: string;
  description?: string;
  type: string;
  iconName: string;
  iconColor?: string;
  value: number;
}

interface AchievementCardProps {
  completedCourses: number;
  totalSlides: number;
  learningStreak?: number;
  achievements?: Achievement[];
}

export function AchievementCard({
  completedCourses,
  totalSlides,
  learningStreak = 0,
  achievements = [],
}: AchievementCardProps) {
  // Default achievements based on props
  const defaultAchievements: Achievement[] = [
    ...(completedCourses > 0
      ? [
          {
            title: "Course Champion",
            description: `Completed ${completedCourses} courses`,
            type: "course_completion",
            iconName: "trophy",
            value: completedCourses,
          },
        ]
      : []),
    ...(totalSlides > 0
      ? [
          {
            title: "Dedicated Learner",
            description: `Completed ${totalSlides} slides`,
            type: "slides_milestone",
            iconName: "star",
            value: totalSlides,
          },
        ]
      : []),
    ...(learningStreak > 0
      ? [
          {
            title: "Learning Streak",
            description: `${learningStreak} days in a row`,
            type: "streak",
            iconName: "award",
            value: learningStreak,
          },
        ]
      : []),
  ];

  // Combine provided and default achievements
  const allAchievements = [...achievements, ...defaultAchievements];

  // Display a message if there are no achievements
  if (allAchievements.length === 0) {
    return (
      <div className="rounded-xl border border-notion-gray-light/20 bg-notion-background p-6 shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-background-dark">
        <h3 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
          Achievements
        </h3>
        <div className="mt-6 text-center">
          <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Complete courses and maintain learning streaks to earn achievements!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-notion-gray-light/20 bg-notion-background p-6 shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-background-dark">
      <h3 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
        Achievements
      </h3>
      <div className="mt-4 space-y-4">
        {allAchievements.map((achievement, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="rounded-full bg-notion-pink/10 p-2">
              <AchievementIcon
                iconName={achievement.iconName || achievement.type}
                iconColor={achievement.iconColor ?? "notion-pink"}
                size={20}
              />
            </div>
            <div>
              <p className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                {achievement.title}
              </p>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
