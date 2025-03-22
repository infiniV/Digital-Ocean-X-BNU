"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FinalizeCourseButtonProps {
  courseId: string;
  status: string;
  slideCount: number;
}

// Define the response type for better type safety
interface ApiErrorResponse {
  error: string;
}

export function FinalizeCourseButton({
  courseId,
  status,
  slideCount,
}: FinalizeCourseButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const finalizeCourse = async () => {
    if (slideCount === 0) {
      setError(
        "You need to add at least one slide before finalizing the course",
      );
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/trainer/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "finalize" }),
      });

      if (!response.ok) {
        // Properly type the error response
        const errorData = (await response.json()) as ApiErrorResponse;
        throw new Error(errorData.error ?? "Failed to finalize course");
      }

      // Use router.refresh() to refresh the page data
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status !== "draft") return null;

  return (
    <div className="flex flex-col space-y-3">
      {error && (
        <div className="mb-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600 shadow-sm transition-all dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </span>
        </div>
      )}
      <button
        onClick={finalizeCourse}
        disabled={isSubmitting}
        className="group relative flex w-full items-center justify-center rounded-md bg-notion-pink px-4 py-2.5 font-geist text-sm font-medium text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-notion-pink-dark focus:outline-none focus:ring-2 focus:ring-notion-pink focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-notion-pink dark:hover:bg-notion-pink-dark dark:focus:ring-offset-gray-900 sm:w-auto"
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg
              className="mr-2 h-4 w-4 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Publishing...
          </span>
        ) : (
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Publish Course
          </span>
        )}
      </button>
    </div>
  );
}
