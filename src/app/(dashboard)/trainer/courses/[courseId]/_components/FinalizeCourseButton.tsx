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
    <div>
      {error && (
        <div className="mb-2 rounded-md bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      <button
        onClick={finalizeCourse}
        disabled={isSubmitting}
        className="rounded-md bg-notion-pink px-4 py-2 font-geist text-sm text-white hover:bg-notion-pink-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Publishing..." : "Publish Course"}
      </button>
    </div>
  );
}
