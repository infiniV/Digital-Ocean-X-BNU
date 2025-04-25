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
    <div className="space-y-8 md:space-y-10">
      {/* Upload Section */}
      <section className="animate-smooth-appear overflow-hidden rounded-xl border border-notion-gray-light/20 bg-notion-gray-light/5 transition-all duration-300 hover:bg-notion-gray-light/10 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/30 dark:hover:bg-notion-gray-dark/40">
        <div className="p-5 md:p-8">
          <h2 className="mb-6 font-geist text-lg font-semibold tracking-tight text-notion-text-light/90 dark:text-notion-text-dark/90 md:text-xl">
            Upload Materials
          </h2>
          <UploadArea
            courseId={courseId}
            onUploadComplete={handleUploadComplete}
          />
        </div>
      </section>

      {/* Content List Section */}
      <section className="animate-slide-in-bottom space-y-4 md:space-y-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <h2 className="font-geist text-lg font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark md:text-xl">
            Course Content
          </h2>
          <span className="text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            Last updated: {new Date().toLocaleDateString()}
          </span>
        </div>
        <div className="overflow rounded-xl border border-notion-gray-light/30 bg-white/80 shadow-notion-xs backdrop-blur-sm transition-all duration-300 hover:shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
          <CourseSlideList
            key={`slides-${refreshTrigger}`}
            courseId={courseId}
          />
        </div>
      </section>
    </div>
  );
}
