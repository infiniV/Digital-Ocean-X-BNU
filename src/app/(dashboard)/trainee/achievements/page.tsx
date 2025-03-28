import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import {
  courses,
  enrollments,
  slides,
  slideProgress,
  userAchievements,
  learningStreaks,
} from "~/server/db/schema";
import { eq, and, count } from "drizzle-orm";
import { AchievementCard } from "~/components/dashboard/trainee/AchievementCard";
import { AchievementIcon } from "~/components/dashboard/trainee/AchievementIcon";

export default async function TraineeAchievementsPage() {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Redirect if not a trainee
  if (session.user.role !== "trainee") {
    redirect("/");
  }

  // 1. Fetch the trainee's achievements from the database
  const userAchievementsData = await db.query.userAchievements.findMany({
    where: eq(userAchievements.userId, session.user.id),
    with: {
      achievement: true,
    },
    orderBy: (ua, { desc }) => [desc(ua.isUnlocked), desc(ua.progress)],
  });

  // 2. Get streak information
  const streakData = await db.query.learningStreaks.findFirst({
    where: eq(learningStreaks.userId, session.user.id),
    orderBy: (streak, { desc }) => [desc(streak.lastActivityDate)],
  });

  const learningStreak = streakData?.currentStreak ?? 0;
  const longestStreak = streakData?.longestStreak ?? 0;

  // 3. Fetch training statistics
  // Fetch trainee's enrollments with course details
  const enrolledCourses = await db.query.enrollments.findMany({
    where: eq(enrollments.traineeId, session.user.id),
    with: {
      course: {
        with: {
          trainer: {
            columns: {
              name: true,
              image: true,
            },
          },
          slides: true,
        },
      },
    },
    orderBy: (enrollments, { desc }) => [desc(enrollments.enrolledAt)],
  });

  // Get total slides across all enrolled courses
  const totalSlides = await db
    .select({ count: count() })
    .from(slides)
    .innerJoin(courses, eq(slides.courseId, courses.id))
    .innerJoin(enrollments, eq(courses.id, enrollments.courseId))
    .where(eq(enrollments.traineeId, session.user.id));

  // Get completed slides count
  const completedSlidesCount = await db
    .select({ count: count() })
    .from(slideProgress)
    .where(
      and(
        eq(slideProgress.traineeId, session.user.id),
        eq(slideProgress.completed, true),
      ),
    );

  // Calculate statistics
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (enrollment) => enrollment.status === "completed",
  ).length;

  // Format achievements for display
  const formattedAchievements = userAchievementsData.map((userAchievement) => ({
    id: userAchievement.achievement.id,
    title: userAchievement.achievement.title,
    description: userAchievement.achievement.description,
    type: userAchievement.achievement.type,
    isUnlocked: userAchievement.isUnlocked,
    icon: (
      <AchievementIcon
        iconName={userAchievement.achievement.type}
        iconColor={userAchievement.achievement.iconColor}
        isUnlocked={!!userAchievement.isUnlocked} // Convert to boolean
        size={24}
        className="h-6 w-6"
      />
    ),
    date: userAchievement.unlockedAt,
    progress: userAchievement.progress,
    currentValue: userAchievement.currentValue,
    requiredValue: userAchievement.achievement.requiredValue,
  }));

  return (
    <main className="min-h-screen space-y-notion-3xl bg-notion-background px-4 py-notion-2xl transition-colors dark:bg-notion-background-dark sm:px-notion-lg lg:px-notion-xl">
      {/* Page Header */}
      <div className="relative border-b border-notion-gray-light/10 pb-notion-xl transition-colors after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-gradient-to-r after:from-notion-accent-light/0 after:via-notion-accent-light/50 after:to-notion-accent-light/0 dark:border-notion-gray-dark/10 dark:after:from-notion-accent-dark/0 dark:after:via-notion-accent-dark/50 dark:after:to-notion-accent-dark/0">
        <div className="space-y-notion-md">
          <h1 className="animate-fade-in font-geist text-3xl font-bold tracking-tight text-notion-text-light transition-colors dark:text-notion-text-dark sm:text-4xl md:text-5xl">
            Your Achievements
          </h1>
          <p className="max-w-2xl animate-fade-in font-geist text-lg text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70 sm:text-xl">
            Track your learning journey and celebrate your milestones
          </p>
        </div>
      </div>

      {/* Achievement Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Course Achievements Card */}
        <div className="group transform animate-fade-in space-y-4 rounded-xl border border-notion-gray-light/10 bg-white p-notion-lg shadow-notion transition-all hover:-translate-y-0.5 hover:border-notion-accent-light/20 hover:shadow-notion-hover dark:border-notion-gray-dark/10 dark:bg-notion-gray-dark/30 dark:hover:border-notion-accent-dark/20">
          <div className="flex items-center justify-between">
            <h3 className="font-geist text-lg font-semibold text-notion-text-light transition-colors dark:text-notion-text-dark">
              Course Achievements
            </h3>
            <div className="rounded-full bg-notion-accent-light/10 p-3 transition-all group-hover:scale-110 dark:bg-notion-accent-dark/10">
              <AchievementIcon
                iconName="book"
                className="h-5 w-5 text-notion-accent-dark transition-colors dark:text-notion-accent-light"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="animate-slide-down font-geist text-4xl font-bold text-notion-text-light transition-colors dark:text-notion-text-dark">
              {completedCourses}
            </span>
            <span className="font-geist text-sm text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70">
              Courses Completed
            </span>
          </div>
        </div>

        {/* Learning Progress Card */}
        <div className="group transform animate-fade-in space-y-4 rounded-xl border border-notion-gray-light/10 bg-white p-notion-lg shadow-notion transition-all hover:-translate-y-0.5 hover:border-notion-accent-light/20 hover:shadow-notion-hover dark:border-notion-gray-dark/10 dark:bg-notion-gray-dark/30 dark:hover:border-notion-accent-dark/20">
          <div className="flex items-center justify-between">
            <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              Learning Progress
            </h3>
            <div className="rounded-full bg-blue-500/10 p-2">
              <AchievementIcon
                iconName="star"
                iconColor="blue-500"
                className="h-5 w-5"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-geist text-4xl font-bold text-notion-text-light dark:text-notion-text-dark">
              {completedSlidesCount[0]?.count ?? 0}
            </span>
            <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Slides Completed
            </span>
          </div>
        </div>

        {/* Learning Streak Card */}
        <div className="group transform animate-fade-in space-y-4 rounded-xl border border-notion-gray-light/10 bg-white p-notion-lg shadow-notion transition-all hover:-translate-y-0.5 hover:border-notion-accent-light/20 hover:shadow-notion-hover dark:border-notion-gray-dark/10 dark:bg-notion-gray-dark/30 dark:hover:border-notion-accent-dark/20">
          <div className="flex items-center justify-between">
            <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
              Learning Streak
            </h3>
            <div className="rounded-full bg-amber-500/10 p-2">
              <AchievementIcon
                iconName="calendar"
                iconColor="amber-500"
                className="h-5 w-5"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-geist text-4xl font-bold text-notion-text-light dark:text-notion-text-dark">
              {learningStreak}
            </span>
            <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Day Streak
            </span>
            {longestStreak > 0 && (
              <span className="font-geist text-xs text-notion-text-light/50 dark:text-notion-text-dark/50">
                Longest: {longestStreak} days
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Achievements List */}
      <div className="animate-fade-in space-y-notion-xl">
        <h2 className="font-geist text-2xl font-bold text-notion-text-light transition-colors dark:text-notion-text-dark sm:text-3xl">
          Your Achievement Badges
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {formattedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`group transform space-y-4 rounded-xl border p-notion-lg transition-all hover:-translate-y-0.5 ${
                achievement.isUnlocked
                  ? "border-notion-accent-light/20 bg-white shadow-notion hover:border-notion-accent-light/30 hover:shadow-notion-hover dark:border-notion-accent-dark/20 dark:bg-notion-gray-dark/30 dark:hover:border-notion-accent-dark/30"
                  : "border-notion-gray-light/10 bg-white/50 shadow-notion hover:border-notion-gray-light/20 hover:shadow-notion-hover dark:border-notion-gray-dark/10 dark:bg-notion-gray-dark/10 dark:hover:border-notion-gray-dark/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-3 ${
                    achievement.isUnlocked
                      ? "bg-notion-pink/10"
                      : "bg-notion-gray-light/10 dark:bg-notion-gray-dark/10"
                  }`}
                >
                  {achievement.icon}
                </div>
                <div>
                  <h3
                    className={`font-geist text-lg font-semibold ${
                      achievement.isUnlocked
                        ? "text-notion-text-light dark:text-notion-text-dark"
                        : "text-notion-text-light/50 dark:text-notion-text-dark/50"
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p
                    className={`font-geist text-sm ${
                      achievement.isUnlocked
                        ? "text-notion-text-light/70 dark:text-notion-text-dark/70"
                        : "text-notion-text-light/40 dark:text-notion-text-dark/40"
                    }`}
                  >
                    {achievement.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {/* Progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-notion-gray-light/30 dark:bg-notion-gray-dark/50">
                  <div
                    className={`h-full rounded-full ${
                      achievement.isUnlocked
                        ? "bg-notion-pink"
                        : "bg-notion-gray-light/50 dark:bg-notion-gray-dark/30"
                    }`}
                    style={{
                      width: `${achievement.progress}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span
                    className={
                      achievement.isUnlocked
                        ? "text-notion-text-light/70 dark:text-notion-text-dark/70"
                        : "text-notion-text-light/40 dark:text-notion-text-dark/40"
                    }
                  >
                    {achievement.isUnlocked
                      ? "Unlocked!"
                      : `${achievement.currentValue}/${achievement.requiredValue} (${achievement.progress}%)`}
                  </span>
                  {achievement.date && (
                    <span className="text-notion-text-light/60 dark:text-notion-text-dark/60">
                      {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {formattedAchievements.length === 0 && (
            <div className="col-span-full flex animate-fade-in flex-col items-center justify-center space-y-6 rounded-xl border border-dashed border-notion-gray-light/20 bg-white/50 p-notion-xl text-center transition-all hover:border-notion-pink/30 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/10">
              <div className="rounded-full bg-notion-gray-light/10 p-4 dark:bg-notion-gray-dark/20">
                <AchievementIcon
                  iconName="trophy"
                  iconColor="notion-gray-light/40"
                  className="h-8 w-8"
                />
              </div>
              <h3 className="font-geist text-lg font-medium text-notion-text-light dark:text-notion-text-dark">
                No Achievements Yet
              </h3>
              <p className="max-w-md font-geist text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
                Start your learning journey by enrolling in courses and
                completing lessons to earn achievements.
              </p>
              <Link
                href="/courses"
                className="flex items-center gap-1.5 rounded-lg bg-notion-pink px-notion-md py-notion-sm font-geist text-base font-medium text-white transition-all hover:bg-notion-pink/90"
              >
                Browse courses
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Metrics and Stats */}
      <div className="transform animate-fade-in space-y-notion-xl rounded-xl border border-notion-gray-light/10 bg-white p-notion-xl shadow-notion transition-all hover:border-notion-accent-light/20 hover:shadow-notion-hover dark:border-notion-gray-dark/10 dark:bg-notion-gray-dark/30 dark:hover:border-notion-accent-dark/20">
        <h2 className="mb-notion-lg font-geist text-2xl font-bold text-notion-text-light dark:text-notion-text-dark">
          Learning Statistics
        </h2>
        <div className="grid grid-cols-1 gap-notion-xl md:grid-cols-2">
          <AchievementCard
            completedCourses={completedCourses}
            totalSlides={totalSlides[0]?.count ?? 0}
            learningStreak={learningStreak}
          />
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Courses Enrolled
                </span>
                <span className="font-geist text-sm font-bold text-notion-text-light dark:text-notion-text-dark">
                  {totalCourses}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-notion-gray-light/30 dark:bg-notion-gray-dark/50">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${totalCourses > 0 ? 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Courses Completed
                </span>
                <span className="font-geist text-sm font-bold text-notion-text-light dark:text-notion-text-dark">
                  {completedCourses} / {totalCourses}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-notion-gray-light/30 dark:bg-notion-gray-dark/50">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: `${totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Slides Completed
                </span>
                <span className="font-geist text-sm font-bold text-notion-text-light dark:text-notion-text-dark">
                  {completedSlidesCount[0]?.count ?? 0} /{" "}
                  {totalSlides[0]?.count ?? 0}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-notion-gray-light/30 dark:bg-notion-gray-dark/50">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{
                    width: `${
                      totalSlides[0]?.count && totalSlides[0].count > 0
                        ? ((completedSlidesCount[0]?.count ?? 0) /
                            totalSlides[0].count) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Link to courses */}
      <div className="flex justify-center pt-notion-xl">
        <Link
          href="/trainee/courses"
          className="group flex transform items-center gap-1.5 rounded-lg bg-notion-accent-dark px-notion-lg py-notion-md font-geist text-base font-medium text-white shadow-notion transition-all hover:-translate-y-0.5 hover:bg-notion-accent-dark/90 hover:shadow-notion-hover active:translate-y-0 dark:bg-notion-accent-light dark:hover:bg-notion-accent-light/90"
        >
          View my courses
          <ChevronRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </main>
  );
}
