"use client";

import { useState, useEffect, useCallback } from "react";
import { File, FileText, ImageIcon, Eye, Loader2, X } from "lucide-react";
import { DeleteSlideButton } from "./DeleteSlideButton";

interface Slide {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  originalFilename: string;
  order: number;
}

interface CourseSlideListProps {
  courseId: string;
  isPreview?: boolean;
}

export function CourseSlideList({
  courseId,
  isPreview = false,
}: CourseSlideListProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  const fetchSlides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/trainer/courses/${courseId}/slides`);

      if (!response.ok) {
        throw new Error("Failed to fetch slides");
      }

      const data = (await response.json()) as Slide[];
      setSlides(data);
    } catch (err) {
      setError("Failed to load course slides");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void fetchSlides();
  }, [fetchSlides]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <File className="h-5 w-5 text-indigo-500" />;
    }
  };

  const getViewerUrl = (slide: Slide): string => {
    const encodedFileUrl = encodeURIComponent(slide.fileUrl);

    if (
      slide.fileType.includes("powerpoint") ||
      slide.fileType.includes("presentation") ||
      slide.originalFilename.endsWith(".pptx") ||
      slide.originalFilename.endsWith(".ppt")
    ) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedFileUrl}`;
    }

    if (
      slide.fileType.includes("pdf") ||
      slide.originalFilename.toLowerCase().endsWith(".pdf")
    ) {
      return `https://docs.google.com/viewer?url=${encodedFileUrl}&embedded=true`;
    }

    return slide.fileUrl;
  };

  const handleSlideDelete = () => {
    void fetchSlides();
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-notion-pink" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <p className="text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-notion-gray-light/30 p-6 text-center dark:border-notion-gray-dark/30">
        <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
          No slides have been added to this course yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-notion-gray-light/10 rounded-md border border-notion-gray-light/20 dark:divide-notion-gray-dark/20 dark:border-notion-gray-dark/30">
        {slides.map((slide) => (
          <li key={slide.id} className="group">
            <div className="flex items-center justify-between p-4 hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/10">
              <div className="flex items-center">
                <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-md bg-notion-gray-light/10 dark:bg-notion-gray-dark/20">
                  {getFileIcon(slide.fileType)}
                </div>
                <div>
                  <h3 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
                    {slide.title}
                  </h3>
                  {slide.description && (
                    <p className="mt-1 line-clamp-1 font-geist text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
                      {slide.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {!isPreview && (
                  <DeleteSlideButton
                    slideId={slide.id}
                    slideTitle={slide.title}
                    onDelete={handleSlideDelete}
                  />
                )}
                <button
                  onClick={() => setSelectedSlide(slide)}
                  className="flex items-center gap-1 rounded-md bg-notion-gray-light/10 px-2 py-1 font-geist text-sm text-notion-text-light/80 opacity-0 transition-opacity hover:bg-notion-pink hover:text-white group-hover:opacity-100 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80 dark:hover:bg-notion-pink"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg bg-notion-background p-6 shadow-xl dark:bg-notion-background-dark">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
                {selectedSlide.title}
              </h3>
              <button
                onClick={() => setSelectedSlide(null)}
                className="rounded-full p-1 hover:bg-notion-gray-light/20 dark:hover:bg-notion-gray-dark/40"
              >
                <X className="h-5 w-5 text-notion-text-light/70 dark:text-notion-text-dark/70" />
              </button>
            </div>
            <div className="rounded-md border border-notion-gray-light/20 dark:border-notion-gray-dark/30">
              {selectedSlide.fileType.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedSlide.fileUrl}
                  alt={selectedSlide.title}
                  className="max-h-[70vh] w-full object-contain"
                />
              ) : (
                <iframe
                  src={getViewerUrl(selectedSlide)}
                  className="h-[70vh] w-full rounded-md"
                  title={selectedSlide.title}
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-presentation"
                />
              )}
            </div>
            {selectedSlide.description && (
              <div className="mt-4">
                <h4 className="mb-1 font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
                  Description
                </h4>
                <p className="font-geist text-sm text-notion-text-light/80 dark:text-notion-text-dark/80">
                  {selectedSlide.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
