"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteCourseButtonProps {
  courseId: string;
  courseName: string;
  variant?: "icon" | "button";
}

export function DeleteCourseButton({
  courseId,
  courseName,
  variant = "icon",
}: DeleteCourseButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch("/api/trainer/courses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        throw new Error(errorData.error ?? "Failed to delete course");
      }

      router.refresh();
      router.push("/trainer/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-red-500">
          Delete &quot;{courseName.substring(0, 20)}&quot;?
        </span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }

  if (variant === "button") {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
      >
        <Trash2 size={14} />
        Delete
      </button>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="group relative rounded-full p-1.5 text-gray-500 transition-all duration-200 ease-in-out hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/40 active:bg-red-100 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 dark:focus:ring-red-400/30 dark:active:bg-red-900/40 sm:p-2"
      title="Delete course"
      aria-label="Delete course"
    >
      <span className="sr-only">Delete course</span>
      <Trash2
        size={16}
        className="transition-transform group-hover:scale-110 sm:size-[18px]"
      />
      <span className="absolute -inset-px rounded-full bg-transparent group-hover:bg-red-100/20 dark:group-hover:bg-red-800/10"></span>
    </button>
  );
}
