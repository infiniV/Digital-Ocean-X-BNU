"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadArea } from "~/components/dashboard/trainer/UploadArea";
import { CourseSlideList } from "~/components/courses/CourseSlideList";

interface SlideManagerProps {
  courseId: string;
}

export function SlideManager({ courseId }: SlideManagerProps) {
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    // Refresh the page data
    router.refresh();
    // Force refresh of the slide list component
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Upload Section */}
      <section className="overflow-hidden rounded-lg border border-notion-gray-light/20 bg-notion-gray-light/5 transition-all duration-300 hover:bg-notion-gray-light/10 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/30 dark:hover:bg-notion-gray-dark/40">
        <div className="p-4 md:p-6">
          <h2 className="mb-4 font-geist text-base font-medium tracking-tight text-notion-text-light/90 dark:text-notion-text-dark/90 md:text-lg">
            Upload Materials
          </h2>
          <UploadArea
            courseId={courseId}
            onUploadComplete={handleUploadComplete}
          />
        </div>
      </section>

      {/* Content List Section */}
      <section className="space-y-3 md:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-geist text-base font-medium tracking-tight text-notion-text-light dark:text-notion-text-dark md:text-lg">
            Course Content
          </h2>
          <span className="text-xs text-notion-text-light/70 dark:text-notion-text-dark/70">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
        <div className="overflow-hidden rounded-lg border border-notion-gray-light/30 bg-white shadow-sm transition-all duration-300 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
          <CourseSlideList
            key={`slides-${refreshTrigger}`}
            courseId={courseId}
          />
        </div>
      </section>
    </div>
  );
}
