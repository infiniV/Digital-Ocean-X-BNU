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
    <div className="space-y-8">
      {/* Upload Section */}
      <section className="overflow-hidden rounded-lg border border-notion-gray-light/20 bg-notion-gray-light/5 transition-colors dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/20">
        <div className="p-6">
          <UploadArea
            courseId={courseId}
            onUploadComplete={handleUploadComplete}
          />
        </div>
      </section>

      {/* Content List Section */}
      <section className="space-y-4">
        <h2 className="font-geist text-lg font-medium tracking-tight text-notion-text-light dark:text-notion-text-dark">
          Course Content
        </h2>
        <div className="overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
          <CourseSlideList
            key={`slides-${refreshTrigger}`}
            courseId={courseId}
          />
        </div>
      </section>
    </div>
  );
}
