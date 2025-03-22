"use client";

import { useState } from "react";
import { Check, ChevronDown, Ban, CalendarDays } from "lucide-react";

interface CourseStatusSelectProps {
  courseId: string;
  currentStatus?: string | null;
}

export function CourseStatusSelect({
  courseId,
  currentStatus = "draft",
}: CourseStatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses = [
    {
      value: "draft",
      label: "Draft",
      icon: CalendarDays,
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    {
      value: "published",
      label: "Published",
      icon: Check,
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      value: "archived",
      label: "Archived",
      icon: Ban,
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  ];

  const currentStatusObj = statuses.find((s) => s.value === status);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/courses/${courseId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating course status:", error);
    } finally {
      setIsUpdating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className="inline-flex items-center gap-1.5 rounded-lg border border-notion-gray-light/20 bg-white px-3 py-1.5 text-sm font-medium text-notion-text-light transition-all hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 dark:text-notion-text-dark dark:hover:border-notion-pink dark:hover:text-notion-pink"
      >
        {currentStatusObj && (
          <>
            <currentStatusObj.icon size={16} />
            {currentStatusObj.label}
          </>
        )}
        <ChevronDown size={16} className="ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-lg border border-notion-gray-light/20 bg-white shadow-lg dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
          <div className="py-1">
            {statuses.map((statusOption) => (
              <button
                key={statusOption.value}
                onClick={() => handleStatusChange(statusOption.value)}
                disabled={isUpdating}
                className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/30 ${
                  status === statusOption.value
                    ? "bg-notion-gray-light/10 dark:bg-notion-gray-dark/20"
                    : ""
                }`}
              >
                <statusOption.icon
                  size={16}
                  className={statusOption.value === status ? statusOption.className : ""}
                />
                {statusOption.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}