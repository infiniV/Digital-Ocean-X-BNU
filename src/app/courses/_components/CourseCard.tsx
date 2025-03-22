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
  // Default cover image gradient if no cover image is available
  const defaultCoverGradient = "linear-gradient(135deg, #ffcce0, #bbdeff)";

  // Check if user is the course creator
  const isOwner = userId === course.trainerId;

  // Format date for display
  const formattedDate = course.createdAt
    ? new Date(course.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      })
    : "No date";

  return (
    <div className="group overflow-hidden rounded-xl border border-notion-gray-light/20 bg-notion-background transition-all duration-300 hover:translate-y-[-2px] hover:shadow-notion-hover dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50 dark:hover:shadow-notion-hover">
      {/* Course image */}
      <div className="relative aspect-video overflow-hidden">
        {course.coverImageUrl ? (
          <Image
            src={course.coverImageUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="from-notion-accent-light dark:from-notion-accent-dark flex h-full w-full items-center justify-center bg-gradient-to-br to-notion-pink-light dark:to-notion-pink-dark"
            style={{ background: defaultCoverGradient }}
          >
            <span className="animate-float text-3xl font-bold text-white opacity-80 drop-shadow-md">
              {course.title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Status badge - enhanced styling */}
        {(isTrainer || course.status === "published") && (
          <div className="absolute right-notion-sm top-notion-sm animate-fade-in">
            <span
              className={`shadow-notion-xs inline-block rounded-full px-notion-sm py-1 font-geist text-sm font-medium tracking-tight backdrop-blur-sm transition-colors ${
                course.status === "published"
                  ? "bg-green-100/90 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                  : "bg-yellow-100/90 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200"
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

      {/* Course content */}
      <div className="flex flex-col p-notion-md">
        <div className="mb-notion-sm flex items-start justify-between">
          <h3 className="group-hover:text-notion-accent-dark dark:group-hover:text-notion-accent-light line-clamp-2 font-geist text-lg font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {course.title}
          </h3>

          {/* Action buttons - enhanced styling */}
          {isTrainer ? (
            isOwner && (
              <Link
                href={`/trainer/courses/${course.id}`}
                className="hover:shadow-notion-xs dark:hover:text-notion-accent-light ml-3 flex-shrink-0 rounded-lg bg-notion-gray-light/20 p-2 text-notion-text-light/70 transition-all duration-200 hover:bg-notion-accent/20 hover:text-notion-accent dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/70 dark:hover:bg-notion-accent/30"
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
              className="hover:shadow-notion-xs dark:hover:text-notion-accent-light ml-3 flex-shrink-0 rounded-lg bg-notion-gray-light/20 p-2 text-notion-text-light/70 transition-all duration-200 hover:scale-105 hover:bg-notion-accent/20 hover:text-notion-accent dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/70 dark:hover:bg-notion-accent/30"
              aria-label="Like course"
            >
              <Heart
                size={18}
                className="transition-transform hover:scale-110"
              />
            </button>
          )}
        </div>

        <p className="mb-notion-md line-clamp-2 font-geist text-sm leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80">
          {course.shortDescription ?? "No description available"}
        </p>

        <div className="mb-notion-md flex flex-wrap gap-notion-xs">
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

        {/* Instructor info - enhanced styling */}
        <div className="mt-auto flex items-center gap-notion-sm rounded-lg bg-notion-gray-light/10 p-notion-sm backdrop-blur-sm transition-colors dark:bg-notion-gray-dark/20">
          <div className="shadow-notion-xs relative h-10 w-10 overflow-hidden rounded-full border border-notion-gray-light/20 bg-notion-gray-light/20 transition-transform group-hover:scale-105 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
            {course.trainer.image ? (
              <Image
                src={course.trainer.image}
                alt={course.trainer.name ?? "Instructor"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="to-notion-accent-dark flex h-full w-full items-center justify-center bg-gradient-to-br from-notion-accent font-geist text-sm font-semibold uppercase text-white">
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

        {/* Action button - enhanced styling */}
        <div className="mt-notion-md">
          <Link
            href={
              isTrainer
                ? isOwner
                  ? `/trainer/courses/${course.id}`
                  : `/courses/${course.id}/preview`
                : `/courses/${course.id}/preview`
            }
            className={`group/btn block w-full rounded-lg px-notion-sm py-notion-sm text-center font-geist text-sm font-medium tracking-tight transition-all duration-300 ${
              isTrainer
                ? isOwner
                  ? "hover:bg-notion-accent-dark bg-notion-accent text-white hover:shadow-notion"
                  : "hover:shadow-notion-xs bg-notion-gray-light/20 text-notion-text-light/90 hover:bg-notion-gray-light/30 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/90 dark:hover:bg-notion-gray-dark/60"
                : "hover:bg-notion-accent-dark bg-notion-accent text-white hover:shadow-notion"
            }`}
          >
            <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">
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
