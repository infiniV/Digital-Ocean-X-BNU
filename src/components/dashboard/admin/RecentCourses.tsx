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
    <div className="border-notion-gray bg-notion-background-light rounded-lg border shadow-notion transition-all hover:shadow-notion-hover dark:border-notion-gray-dark dark:bg-notion-background-dark">
      <div className="border-notion-gray border-b px-notion-md py-notion-sm dark:border-notion-gray-dark">
        <div className="flex items-center justify-between">
          <h2 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
            Recent Courses
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-notion-disabled-text dark:text-notion-disabled-text-dark">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="dark:hover:text-notion-accent-light rounded p-1 text-notion-text-light transition-colors hover:bg-notion-pink-light hover:text-notion-accent disabled:opacity-50 dark:text-notion-text-dark dark:hover:bg-notion-pink-dark"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="dark:hover:text-notion-accent-light rounded p-1 text-notion-text-light transition-colors hover:bg-notion-pink-light hover:text-notion-accent disabled:opacity-50 dark:text-notion-text-dark dark:hover:bg-notion-pink-dark"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="divide-notion-gray/10 divide-y dark:divide-notion-gray-dark/10">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between px-notion-lg py-notion-md transition-colors hover:bg-notion-pink-light/20 dark:hover:bg-notion-pink-dark/10"
          >
            <div>
              <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                {course.title}
              </h3>
              <p className="font-geist text-sm text-notion-disabled-text dark:text-notion-disabled-text-dark">
                by {course.trainer.name}
              </p>
            </div>
            <div className="flex items-center gap-notion-sm">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-geist text-xs font-medium ${
                  course.status === "published"
                    ? "bg-notion-accent-light/20 text-notion-accent-dark dark:bg-notion-accent-dark/20 dark:text-notion-accent-light"
                    : "bg-notion-disabled-light text-notion-disabled-text dark:bg-notion-disabled-dark dark:text-notion-disabled-text-dark"
                }`}
              >
                {course.status}
              </span>
              <span className="font-geist text-sm text-notion-disabled-text dark:text-notion-disabled-text-dark">
                {new Date(course.createdAt ?? "").toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="bg-notion-background-light/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm dark:bg-notion-background-dark/80">
          <div className="bg-notion-background-light shadow-notion-lg animate-scale-in rounded-lg p-notion-md dark:bg-notion-background-dark">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}
