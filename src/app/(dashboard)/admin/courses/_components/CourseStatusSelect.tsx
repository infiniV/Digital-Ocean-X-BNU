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
        className="shadow-notion-xs dark:hover:border-notion-accent-dark dark:hover:text-notion-accent-dark inline-flex items-center gap-notion-sm rounded-lg border border-notion-gray-light/30 bg-white px-notion-md py-notion-sm text-sm font-medium text-notion-text-light transition-all duration-200 hover:border-notion-accent hover:bg-notion-gray-light/5 hover:text-notion-accent hover:shadow-notion disabled:cursor-not-allowed disabled:opacity-60 dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/60 dark:text-notion-text-dark dark:hover:bg-notion-gray-dark/80"
      >
        {currentStatusObj && (
          <>
            <currentStatusObj.icon size={16} className="animate-fade-in" />
            <span className="animate-slide-in">{currentStatusObj.label}</span>
          </>
        )}
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right animate-scale-in rounded-lg border border-notion-gray-light/30 bg-white p-1 shadow-notion transition-all dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/90">
          <div className="py-notion-xs">
            {statuses.map((statusOption) => (
              <button
                key={statusOption.value}
                onClick={() => handleStatusChange(statusOption.value)}
                disabled={isUpdating}
                className={`group flex w-full items-center gap-notion-sm rounded-md px-notion-md py-notion-sm text-left text-sm font-medium transition-all duration-200 hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/40 ${
                  status === statusOption.value
                    ? "bg-notion-gray-light/15 dark:bg-notion-gray-dark/30"
                    : ""
                }`}
              >
                <statusOption.icon
                  size={16}
                  className={`transition-all duration-200 ${
                    statusOption.value === status
                      ? statusOption.className
                      : "text-notion-text-light/70 group-hover:text-notion-text-light dark:text-notion-text-dark/70 dark:group-hover:text-notion-text-dark"
                  }`}
                />
                <span
                  className={`transition-colors duration-200 ${
                    status === statusOption.value
                      ? "text-notion-text-light dark:text-notion-text-dark"
                      : "text-notion-text-light/70 group-hover:text-notion-text-light dark:text-notion-text-dark/70 dark:group-hover:text-notion-text-dark"
                  }`}
                >
                  {statusOption.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
