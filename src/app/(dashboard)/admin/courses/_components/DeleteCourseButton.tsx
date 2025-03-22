"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DeleteCourseButtonProps {
  courseId: string;
  courseTitle: string;
}

export function DeleteCourseButton({
  courseId,
  courseTitle,
}: DeleteCourseButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      router.push("/admin/courses");
      router.refresh();
    } catch (error) {
      console.error("Error deleting course:", error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-xl dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <h3 className="mb-2 font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
            Delete Course
          </h3>
          <p className="mb-4 font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
            Are you sure you want to delete &quot;{courseTitle}&quot;? This action
            cannot be undone and will remove all associated content and
            enrollments.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-lg border border-notion-gray-light/20 px-4 py-2 font-geist text-sm text-notion-text-light transition-all hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-geist text-sm font-medium text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-500 dark:hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete Course"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 font-geist text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
    >
      <Trash2 size={16} />
      Delete
    </button>
  );
}