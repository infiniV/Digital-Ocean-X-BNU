"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { enrollInCourse } from "~/server/auth/course-actions";

interface EnrollButtonProps {
  courseId: string;
  isTrainer: boolean;
  isPublished: boolean;
}

export function EnrollButton({
  courseId,
  isTrainer,
  isPublished,
}: EnrollButtonProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  // Function to handle enrollment with server action
  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      setEnrollError(null);

      // Call the server action
      await enrollInCourse(courseId);

      // The server action will handle redirection if successful
    } catch (error) {
      // If there's an error, show it to the user
      setEnrollError(
        error instanceof Error ? error.message : "Failed to enroll in course",
      );
      setIsEnrolling(false);
    }
  };

  if (!isPublished) {
    return (
      <>
        <div className="shadow-notion-xs mb-6 rounded-xl bg-yellow-50/90 p-6 backdrop-blur-sm dark:bg-yellow-900/30 dark:shadow-none">
          <p className="flex items-center justify-center gap-3 font-geist text-sm font-medium tracking-wide text-yellow-700 transition-colors dark:text-yellow-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 animate-pulse-slow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            This course is not yet published
          </p>
        </div>
        <p className="text-center text-sm font-medium leading-relaxed text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70">
          Trainees will only be able to enroll once the course is published.
        </p>
      </>
    );
  }

  if (isTrainer) {
    return (
      <>
        <button
          disabled
          className="bg-notion-disabled-light shadow-notion-xs group mb-6 w-full cursor-not-allowed rounded-xl px-8 py-4 font-geist text-base font-semibold text-notion-disabled-text transition-all dark:bg-notion-disabled-dark dark:text-notion-disabled-text-dark dark:shadow-none"
        >
          <span className="animate-fade-in">Enrollment Not Available</span>
        </button>
        <p className="text-center text-sm font-medium leading-relaxed text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70">
          As a trainer, you cannot enroll in courses
        </p>
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleEnroll}
        disabled={isEnrolling}
        className="hover:bg-notion-accent-dark dark:bg-notion-accent-dark group relative mb-6 w-full overflow-hidden rounded-xl bg-notion-accent px-8 py-4 font-geist text-base font-semibold text-white shadow-notion transition-all hover:shadow-notion-hover focus:outline-none focus:ring-2 focus:ring-notion-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-notion-accent dark:focus:ring-offset-notion-background-dark"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          {isEnrolling ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span className="animate-pulse">Enrolling...</span>
            </>
          ) : (
            <span className="animate-fade-in">Enroll Now</span>
          )}
        </span>
        <div className="from-notion-accent-light to-notion-accent-dark absolute inset-0 -z-0 bg-gradient-to-r via-notion-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </button>
      {enrollError && (
        <div className="mb-6 animate-slide-down rounded-lg bg-red-50/90 p-4 dark:bg-red-900/20">
          <p className="text-center text-sm font-medium text-red-600 dark:text-red-400">
            {enrollError}
          </p>
        </div>
      )}
      <p className="text-center text-sm font-medium leading-relaxed text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70">
        Join this course to access all materials
      </p>
    </>
  );
}
