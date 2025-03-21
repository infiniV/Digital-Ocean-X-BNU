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
    <div className="group overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
      {/* Course image */}
      <div className="relative aspect-video overflow-hidden">
        {course.coverImageUrl ? (
          <Image
            src={course.coverImageUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: defaultCoverGradient }}
          >
            <span className="text-3xl font-bold text-white opacity-70">
              {course.title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Status badge - refined styling */}
        {(isTrainer || course.status === "published") && (
          <div className="absolute right-3 top-3">
            <span
              className={`inline-block rounded-full px-3 py-1 font-geist text-sm font-medium tracking-tight ${
                course.status === "published"
                  ? "bg-green-100/90 text-green-800 backdrop-blur-sm dark:bg-green-900/30 dark:text-green-200"
                  : "bg-yellow-100/90 text-yellow-800 backdrop-blur-sm dark:bg-yellow-900/30 dark:text-yellow-200"
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
      <div className="flex flex-col p-5">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="line-clamp-2 font-geist text-lg font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            {course.title}
          </h3>

          {/* Action buttons - refined styling */}
          {isTrainer ? (
            isOwner && (
              <Link
                href={`/trainer/courses/${course.id}`}
                className="ml-3 flex-shrink-0 rounded-lg bg-notion-gray-light/10 p-2 text-notion-text-light/70 transition-colors hover:bg-notion-pink/10 hover:text-notion-pink dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/70 dark:hover:bg-notion-pink/20 dark:hover:text-notion-pink"
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
              className="ml-3 flex-shrink-0 rounded-lg bg-notion-gray-light/10 p-2 text-notion-text-light/70 transition-colors hover:bg-notion-pink/10 hover:text-notion-pink dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/70 dark:hover:bg-notion-pink/20 dark:hover:text-notion-pink"
              aria-label="Like course"
            >
              <Heart size={18} />
            </button>
          )}
        </div>

        <p className="mb-4 line-clamp-2 font-geist text-sm text-notion-text-light/80 dark:text-notion-text-dark/80">
          {course.shortDescription ?? "No description available"}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-notion-gray-light/10 px-3 py-1.5 font-geist text-sm text-notion-text-light/70 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/70">
            <Clock size={14} className="text-notion-pink" />
            <span className="capitalize">
              {course.skillLevel ?? "All levels"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-notion-gray-light/10 px-3 py-1.5 font-geist text-sm text-notion-text-light/70 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/70">
            <BookOpen size={14} className="text-notion-blue" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Instructor info - refined styling */}
        <div className="mt-auto flex items-center gap-3 rounded-lg bg-notion-gray-light/5 p-3 dark:bg-notion-gray-dark/10">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-notion-gray-light/10 bg-notion-gray-light/10 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/40">
            {course.trainer.image ? (
              <Image
                src={course.trainer.image}
                alt={course.trainer.name ?? "Instructor"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-notion-pink font-geist text-sm font-semibold uppercase text-white">
                {course.trainer.name?.[0] ?? "T"}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-geist text-sm font-medium text-notion-text-light/90 dark:text-notion-text-dark/90">
              {course.trainer.name ?? "Anonymous"}
            </span>
            <span className="font-geist text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
              Instructor
            </span>
          </div>
        </div>

        {/* Action button - refined styling */}
        <div className="mt-5">
          <Link
            href={
              isTrainer
                ? isOwner
                  ? `/trainer/courses/${course.id}`
                  : `/courses/${course.id}/preview`
                : `/courses/${course.id}/preview`
            }
            className={`block w-full rounded-lg px-4 py-3 text-center font-geist text-sm font-medium tracking-tight transition-all ${
              isTrainer
                ? isOwner
                  ? "bg-notion-blue hover:bg-notion-blue-dark text-white hover:shadow-md"
                  : "bg-notion-gray-light/10 text-notion-text-light/90 hover:bg-notion-gray-light/20 dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/90 dark:hover:bg-notion-gray-dark/50"
                : "bg-notion-pink text-white hover:bg-notion-pink-dark hover:shadow-md"
            }`}
          >
            {isTrainer
              ? isOwner
                ? "Manage Course"
                : "View Course"
              : "Enroll Now"}
          </Link>
        </div>
      </div>
    </div>
  );
}
