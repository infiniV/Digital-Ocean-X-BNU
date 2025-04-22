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
        let errorMsg = "Failed to fetch slides";
        try {
          const data = await response.json();
          if (data?.error) errorMsg = data.error;
        } catch (e) {
          // fallback to text if not JSON
          try {
            const text = await response.text();
            if (text) errorMsg = text;
          } catch {}
        }
        throw new Error(errorMsg);
      }

      const data = (await response.json()) as Slide[];
      setSlides(data);
    } catch (err) {
      let msg = "Failed to load course slides";
      if (err instanceof Error && err.message) {
        msg = err.message;
      }
      // Add more helpful hints for common errors
      if (
        msg.toLowerCase().includes("unauthorized") ||
        msg.toLowerCase().includes("permission") ||
        msg.toLowerCase().includes("access")
      ) {
        msg +=
          "\n\nYou may not have access to this course or your session may have expired. Please log in again or check your permissions.";
      }
      setError(msg);
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
      <div className="flex flex-col items-center gap-3 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
        <p className="whitespace-pre-line text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
        <button
          onClick={fetchSlides}
          className="mt-2 inline-flex items-center gap-2 rounded bg-notion-pink px-4 py-2 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark focus:outline-none focus:ring-2 focus:ring-notion-pink/30"
        >
          <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Try Again
        </button>
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
    <div className="space-y-6">
      <ul className="divide-y divide-notion-gray-light/15 overflow-hidden rounded-lg border border-notion-gray-light/25 shadow-sm transition-all dark:divide-notion-gray-dark/25 dark:border-notion-gray-dark/40 dark:shadow-md dark:shadow-notion-gray-dark/10">
        {slides.map((slide) => (
          <li key={slide.id} className="group transition-colors duration-200">
            <div className="hover:bg-notion-gray-light/8 flex flex-col items-start justify-between gap-3 p-4 dark:hover:bg-notion-gray-dark/15 sm:flex-row sm:items-center">
              <div className="flex w-full items-center sm:w-auto">
                <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-notion-gray-light/15 shadow-sm transition-transform group-hover:scale-105 dark:bg-notion-gray-dark/30">
                  {getFileIcon(slide.fileType)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
                    {slide.title}
                  </h3>
                  {slide.description && (
                    <p className="mt-1 line-clamp-1 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70">
                      {slide.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                {!isPreview && (
                  <DeleteSlideButton
                    slideId={slide.id}
                    slideTitle={slide.title}
                    onDelete={handleSlideDelete}
                  />
                )}
                <button
                  onClick={() => setSelectedSlide(slide)}
                  className="flex items-center gap-1.5 rounded-md bg-notion-gray-light/15 px-3 py-1.5 font-geist text-xs font-medium text-notion-text-light/90 transition-all group-hover:bg-notion-pink/90 group-hover:text-white group-hover:opacity-100 group-hover:shadow-sm dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/90 dark:group-hover:bg-notion-pink/90 sm:opacity-0"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="xs:inline hidden">View</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {selectedSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="animate-in fade-in zoom-in-95 max-h-[95vh] w-[95%] max-w-4xl overflow-auto rounded-xl bg-notion-background p-4 shadow-xl duration-200 dark:bg-notion-background-dark dark:ring-1 dark:ring-notion-gray-dark/50 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="line-clamp-1 font-geist text-base font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-lg">
                {selectedSlide.title}
              </h3>
              <button
                onClick={() => setSelectedSlide(null)}
                className="rounded-full p-1.5 transition-colors hover:bg-notion-gray-light/25 focus:outline-none focus:ring-2 focus:ring-notion-pink/60 dark:hover:bg-notion-gray-dark/50"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-notion-text-light/80 dark:text-notion-text-dark/80" />
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-notion-gray-light/25 shadow-sm dark:border-notion-gray-dark/40">
              {selectedSlide.fileType.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedSlide.fileUrl}
                  alt={selectedSlide.title}
                  className="max-h-[70vh] w-full bg-white/20 object-contain dark:bg-black/20"
                  loading="lazy"
                />
              ) : (
                <iframe
                  src={getViewerUrl(selectedSlide)}
                  className="h-[50vh] w-full rounded-md sm:h-[65vh] md:h-[70vh]"
                  title={selectedSlide.title}
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-presentation"
                />
              )}
            </div>
            {selectedSlide.description && (
              <div className="mt-5 rounded-lg bg-notion-gray-light/10 p-4 dark:bg-notion-gray-dark/20">
                <h4 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
                  Description
                </h4>
                <p className="mt-2 font-geist text-sm text-notion-text-light/85 dark:text-notion-text-dark/85">
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
