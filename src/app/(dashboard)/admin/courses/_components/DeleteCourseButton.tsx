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
      <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="shadow-notion-lg w-full max-w-md animate-scale-in rounded-lg border border-notion-gray-light/20 bg-white p-notion-lg dark:border-notion-gray-dark/30 dark:bg-notion-dark">
          <h3 className="mb-notion-sm font-geist text-xl font-semibold leading-tight text-notion-text-light dark:text-notion-text-dark">
            Delete Course
          </h3>
          <p className="mb-notion-lg font-geist text-[15px] leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80">
            Are you sure you want to delete &quot;{courseTitle}&quot;? This
            action cannot be undone and will remove all associated content and
            enrollments.
          </p>

          <div className="flex justify-end gap-notion-sm">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="hover:bg-notion-gray hover:border-notion-gray inline-flex items-center gap-2 rounded-lg border border-notion-gray-light/30 bg-notion-gray-light/50 px-notion-md py-notion-sm font-geist text-sm text-notion-text-light transition-all duration-200 disabled:opacity-50 dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark dark:hover:bg-notion-gray-dark/60"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-notion-md py-notion-sm font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-red-600 hover:shadow-notion focus:ring-2 focus:ring-red-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
            >
              {isDeleting ? (
                <span className="animate-pulse">Deleting...</span>
              ) : (
                "Delete Course"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="shadow-notion-xs inline-flex items-center gap-1.5 rounded-lg border border-red-200/80 bg-red-50/50 px-notion-sm py-1.5 font-geist text-sm font-medium text-red-600 transition-all hover:border-red-300 hover:bg-red-100/70 hover:shadow-notion dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400 dark:hover:border-red-800/60 dark:hover:bg-red-900/30"
    >
      <Trash2 size={16} className="animate-pulse-slow" />
      Delete
    </button>
  );
}
