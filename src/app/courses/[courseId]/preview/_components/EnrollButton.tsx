"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { enrollInCourse } from "~/server/auth/course-actions";

interface EnrollButtonProps {
  courseId: string;
  isTrainer: boolean;
  isPublished: boolean;
  isSignedIn?: boolean;
}

export function EnrollButton({
  courseId,
  isTrainer,
  isPublished,
  isSignedIn = true, // Default to true for backward compatibility
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
        <div className="mb-6 rounded-xl bg-yellow-50/90 p-6 shadow-notion-xs backdrop-blur-sm dark:bg-yellow-900/30 dark:shadow-none">
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

  if (!isSignedIn) {
    return (
      <>
        <Link
          href="/auth/signin"
          className="group relative mb-6 flex w-full overflow-hidden rounded-xl bg-notion-pink px-8 py-4 text-center font-geist text-base font-semibold text-notion-background-light shadow-notion transition-all hover:bg-notion-pink-light hover:text-notion-text-light hover:shadow-notion-hover focus:outline-none focus:ring-2 focus:ring-notion-pink focus:ring-offset-2 dark:bg-notion-pink-dark dark:text-notion-background-dark dark:hover:bg-notion-pink dark:focus:ring-offset-notion-background-dark"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="animate-fade-in">Sign in to Enroll</span>
          </span>
          <div className="absolute inset-0 -z-0 bg-gradient-to-r from-notion-pink-light via-notion-pink to-notion-pink-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
        <p className="text-center text-sm font-medium leading-relaxed text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70">
          Create an account or sign in to access this course
        </p>
      </>
    );
  }

  if (isTrainer) {
    return (
      <>
        <button
          disabled
          className="group mb-6 w-full cursor-not-allowed rounded-xl bg-notion-disabled-light px-8 py-4 font-geist text-base font-semibold text-notion-disabled-text shadow-notion-xs transition-all dark:bg-notion-disabled-dark dark:text-notion-disabled-text-dark dark:shadow-none"
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
        className="group relative mb-6 w-full overflow-hidden rounded-xl bg-notion-accent px-8 py-4 font-geist text-base font-semibold text-notion-background-light shadow-notion transition-all hover:bg-notion-accent-light hover:text-notion-text-light hover:shadow-notion-hover focus:outline-none focus:ring-2 focus:ring-notion-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-notion-accent-dark dark:text-notion-background-dark dark:hover:bg-notion-accent dark:focus:ring-offset-notion-background-dark"
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
        <div className="absolute inset-0 -z-0 bg-gradient-to-r from-notion-accent-light via-notion-accent to-notion-accent-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
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
