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
    <>
      <UploadArea courseId={courseId} onUploadComplete={handleUploadComplete} />
      <div className="mb-8">
        <h2 className="mb-4 font-geist text-xl font-medium text-notion-text-light dark:text-notion-text-dark">
          Course Content
        </h2>
        <CourseSlideList key={`slides-${refreshTrigger}`} courseId={courseId} />
      </div>
    </>
  );
}
