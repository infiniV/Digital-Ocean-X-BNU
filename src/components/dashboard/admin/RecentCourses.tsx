"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Course {
  id: string;
  title: string;
  status: string;
  createdAt: Date | null;
  trainer: {
    name: string;
  };
}

interface RecentCoursesProps {
  initialCourses: Course[];
  totalCourses: number;
  pageSize?: number;
}

export function RecentCourses({
  initialCourses,
  totalCourses,
  pageSize = 5,
}: RecentCoursesProps) {
  const [courses, setCourses] = useState(initialCourses);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(totalCourses / pageSize);

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > totalPages || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/courses/recent?page=${page}&pageSize=${pageSize}`,
      );
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = (await response.json()) as { courses: Course[] };
      setCourses(data.courses);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50">
      <div className="border-b border-notion-gray-light/20 px-6 py-4 dark:border-notion-gray-dark/20">
        <div className="flex items-center justify-between">
          <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
            Recent Courses
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-notion-text-light/70 dark:text-notion-text-dark/70">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="rounded p-1 text-notion-text-light/70 transition-colors hover:bg-notion-gray-light/10 hover:text-notion-pink disabled:opacity-50 dark:text-notion-text-dark/70 dark:hover:bg-notion-gray-dark/20"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="rounded p-1 text-notion-text-light/70 transition-colors hover:bg-notion-gray-light/10 hover:text-notion-pink disabled:opacity-50 dark:text-notion-text-dark/70 dark:hover:bg-notion-gray-dark/20"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/10">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between px-6 py-4"
          >
            <div>
              <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                {course.title}
              </h3>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                by {course.trainer.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-geist text-xs font-medium ${
                  course.status === "published"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {course.status}
              </span>
              <span className="font-geist text-sm text-notion-text-light/50 dark:text-notion-text-dark/50">
                {new Date(course.createdAt ?? "").toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-notion-gray-dark/50">
          <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-notion-gray-dark">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}
