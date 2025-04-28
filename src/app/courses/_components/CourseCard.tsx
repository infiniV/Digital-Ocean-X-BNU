import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, Heart } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    shortDescription: string | null;
    status: string | null;
    skillLevel: string | null;
    coverImageUrl: string | null;
    createdAt: Date | null;
    trainerId: string | null;
    trainer: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
  isTrainer: boolean;
  userId?: string;
}

export default function CourseCard({
  course,
  isTrainer,
  userId,
}: CourseCardProps) {
  // Check if user is the course creator
  const isOwner = userId === course.trainerId;

  // Format date for display
  const formattedDate = course.createdAt
    ? new Date(course.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : "No date";

  // Generate a unique gradient background based on course ID
  function getUniqueGradient(id: string) {
    // Simple hash function to get a number from the string
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Generate two HSL colors based on the hash
    const h1 = Math.abs(hash) % 360;
    const h2 = Math.abs(hash * 13) % 360;
    return `linear-gradient(135deg, hsl(${h1}, 70%, 65%) 0%, hsl(${h2}, 80%, 75%) 100%)`;
  }

  return (
    <div className="group relative isolate flex h-full flex-col overflow-hidden rounded-xl border border-notion-gray-light/10 bg-white/50 p-1 transition-all duration-300 hover:translate-y-[-2px] hover:border-notion-accent/20 hover:shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/30 dark:hover:border-notion-accent-dark/30">
      {/* Course image with fixed aspect ratio */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
        {course.coverImageUrl ? (
          <Image
            src={course.coverImageUrl}
            alt={course.title}
            fill
            className="object-cover transition-all duration-500 will-change-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="relative h-full w-full overflow-hidden">
            {/* Unique grainy gradient background */}
            <div className="absolute inset-0 animate-grain bg-grain opacity-[0.07]" />
            <div
              className="absolute inset-0"
              style={{ background: getUniqueGradient(course.id) }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold tracking-tight text-white/90 drop-shadow-sm">
                {course.title.substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Status badge with improved contrast */}
        {(isTrainer || course.status === "published") && (
          <div className="absolute right-2 top-2 animate-fade-in">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide backdrop-blur-sm transition-colors ${
                course.status === "published"
                  ? "bg-notion-accent/90 text-white dark:bg-notion-accent-dark/90"
                  : "bg-notion-gray-light/90 text-notion-text-light dark:bg-notion-gray-dark/90 dark:text-notion-text-dark"
              }`}
            >
              {course.status === "published"
                ? "Published"
                : course.status
                  ? course.status.replace("_", " ").charAt(0).toUpperCase() +
                    course.status.replace("_", " ").slice(1)
                  : "Draft"}
            </span>
          </div>
        )}
      </div>

      {/* Course content with fixed layout */}
      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="flex min-h-[3rem] items-start justify-between gap-3">
          <h3 className="line-clamp-2 flex-1 font-geist text-base font-semibold tracking-tight text-notion-text-light transition-colors group-hover:text-notion-accent dark:text-notion-text-dark dark:group-hover:text-notion-accent-light sm:text-lg">
            {course.title}
          </h3>

          {/* Action buttons with consistent styling */}
          {isTrainer ? (
            isOwner && (
              <Link
                href={`/trainer/courses/${course.id}`}
                className="flex-shrink-0 rounded-lg bg-notion-gray-light/10 p-2 text-notion-text-light/70 transition-all hover:bg-notion-accent/10 hover:text-notion-accent hover:shadow-notion-xs active:scale-95 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/70 dark:hover:bg-notion-accent-dark/20"
                aria-label="Edit course"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </Link>
            )
          ) : (
            <button
              className="flex-shrink-0 rounded-lg bg-notion-gray-light/10 p-2 text-notion-text-light/70 transition-all hover:bg-notion-accent/10 hover:text-notion-accent hover:shadow-notion-xs active:scale-95 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/70 dark:hover:bg-notion-accent-dark/20"
              aria-label="Like course"
            >
              <Heart
                size={16}
                className="transition-transform hover:scale-110"
              />
            </button>
          )}
        </div>

        <p className="line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-notion-text-light/70 dark:text-notion-text-dark/70">
          {course.shortDescription ?? "No description available"}
        </p>

        {/* Course metadata with consistent height */}
        <div className="flex min-h-[2rem] flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-notion-gray-light/20 px-notion-sm py-1.5 font-geist text-xs font-medium text-notion-text-light/80 transition-colors dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/80">
            <Clock size={14} className="text-notion-accent" />
            <span className="capitalize">
              {course.skillLevel ?? "All levels"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-notion-gray-light/20 px-notion-sm py-1.5 font-geist text-xs font-medium text-notion-text-light/80 transition-colors dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/80">
            <BookOpen size={14} className="text-notion-accent" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Instructor info with fixed height */}
        <div className="mt-auto flex h-[4rem] items-center gap-3 rounded-lg bg-notion-gray-light/5 p-3 backdrop-blur-sm transition-colors dark:bg-notion-gray-dark/10">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-notion-gray-light/20 bg-notion-gray-light/20 shadow-notion-xs transition-transform group-hover:scale-105 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            {course.trainer.image ? (
              <Image
                src={course.trainer.image}
                alt={course.trainer.name ?? "Instructor"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-notion-accent to-notion-accent-dark font-geist text-sm font-semibold uppercase text-white">
                {course.trainer.name?.[0] ?? "T"}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-geist text-sm font-medium tracking-tight text-notion-text-light/90 dark:text-notion-text-dark/90">
              {course.trainer.name ?? "Anonymous"}
            </span>
            <span className="font-geist text-xs text-notion-text-light/60 dark:text-notion-text-dark/60">
              Instructor
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-3 h-[2.5rem]">
          <Link
            href={
              isTrainer
                ? isOwner
                  ? `/trainer/courses/${course.id}`
                  : `/courses/${course.id}/preview`
                : `/courses/${course.id}/preview`
            }
            className={`group/btn inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 ${
              isTrainer
                ? isOwner
                  ? "bg-notion-accent text-white hover:bg-notion-accent-dark hover:shadow-notion active:scale-[0.98]"
                  : "bg-notion-gray-light/20 text-notion-text-light/90 hover:bg-notion-gray-light/30 dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/90"
                : "bg-notion-accent text-white hover:bg-notion-accent-dark hover:shadow-notion active:scale-[0.98]"
            }`}
          >
            <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-0.5">
              {isTrainer
                ? isOwner
                  ? "Manage Course"
                  : "View Course"
                : "Enroll Now"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
