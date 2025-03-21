"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { enrollInCourse } from "~/server/auth/course-actions";

interface EnrollButtonProps {
  courseId: string;
  isTrainer: boolean;
  isPublished: boolean;
}

export function EnrollButton({ courseId, isTrainer, isPublished }: EnrollButtonProps) {
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
      setEnrollError(error instanceof Error ? error.message : "Failed to enroll in course");
      setIsEnrolling(false);
    }
  };

  if (!isPublished) {
    return (
      <>
        <div className="mb-4 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <p className="flex items-center justify-center gap-2 font-geist text-sm font-medium text-yellow-700 dark:text-yellow-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
        <p className="text-center text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
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
          className="mb-4 w-full cursor-not-allowed rounded-lg bg-notion-gray-light/20 px-6 py-3.5 font-geist text-base font-semibold text-notion-text-light/50 shadow-sm dark:bg-notion-gray-dark/50 dark:text-notion-text-dark/50"
        >
          Enrollment Not Available
        </button>
        <p className="text-center text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
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
        className="mb-4 w-full rounded-lg bg-notion-pink px-6 py-3.5 font-geist text-base font-semibold text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-notion-pink focus:ring-offset-2 dark:focus:ring-offset-notion-gray-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isEnrolling ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Enrolling...
          </span>
        ) : (
          "Enroll Now"
        )}
      </button>
      {enrollError && (
        <p className="mb-4 text-center text-sm text-red-600 dark:text-red-400">
          {enrollError}
        </p>
      )}
      <p className="text-center text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
        Join this course to access all materials
      </p>
    </>
  );
}