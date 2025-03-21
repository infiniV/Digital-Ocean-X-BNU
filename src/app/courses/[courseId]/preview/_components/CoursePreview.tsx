"use client";

import { useState, useEffect } from "react";
import { File, FileText, ImageIcon, Loader2, BookOpen } from "lucide-react";
import { CourseContentViewer } from "./CourseContentViewer";

interface Slide {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  originalFilename: string;
  order: number;
}

interface CoursePreviewProps {
  courseId: string;
}

export function CoursePreview({ courseId }: CoursePreviewProps) {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  useEffect(() => {
    async function fetchSlides() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/trainer/courses/${courseId}/slides`);

        if (!response.ok) {
          throw new Error("Failed to fetch course content");
        }

        const data = (await response.json()) as Slide[];
        setSlides(data);

        // Auto-select first slide if available
        if (data.length > 0) {
          setSelectedSlide(data[0]!);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load course content");
      } finally {
        setLoading(false);
      }
    }

    void fetchSlides();
  }, [courseId]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes("pdf")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <File className="h-5 w-5 text-indigo-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20">
        <div className="flex flex-col items-center">
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-notion-pink" />
          <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
            Loading course materials...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800/30 dark:bg-red-900/20">
        <p className="text-base text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-red-100 px-4 py-2 font-geist text-sm font-medium text-red-800 transition-colors hover:bg-red-200 dark:bg-red-800/30 dark:text-red-300 dark:hover:bg-red-700/30"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-notion-gray-light/30 bg-white p-8 text-center shadow-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-notion-gray-light/40 dark:text-notion-gray-dark/40" />
        <p className="font-geist text-lg font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
          No content has been added to this course yet
        </p>
        <p className="mt-2 font-geist text-sm text-notion-text-light/50 dark:text-notion-text-dark/50">
          Check back later for course materials
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="mb-6 font-geist text-2xl font-bold text-notion-text-light dark:text-notion-text-dark">
        Course Content
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Content navigation sidebar - improved spacing and styling */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-lg border border-notion-gray-light/20 bg-white shadow-sm dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
            <div className="border-b border-notion-gray-light/20 bg-notion-gray-light/5 px-4 py-3 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/80">
              <h3 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
                Course Materials ({slides.length})
              </h3>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              <ul className="divide-y divide-notion-gray-light/10 dark:divide-notion-gray-dark/20">
                {slides.map((slide) => (
                  <li key={slide.id}>
                    <button
                      onClick={() => setSelectedSlide(slide)}
                      className={`flex w-full items-center px-4 py-3 text-left transition-colors hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/30 ${
                        selectedSlide?.id === slide.id
                          ? "bg-notion-pink/5 dark:bg-notion-pink/10"
                          : ""
                      }`}
                    >
                      <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-notion-gray-light/10 dark:bg-notion-gray-dark/20">
                        {getFileIcon(slide.fileType)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="truncate font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
                          {slide.title}
                        </h4>
                        {slide.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-notion-text-light/60 dark:text-notion-text-dark/60">
                            {slide.description}
                          </p>
                        )}
                      </div>
                      {selectedSlide?.id === slide.id && (
                        <div className="ml-2 h-2 w-2 shrink-0 rounded-full bg-notion-pink"></div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Content viewer - improved layout */}
        <div className="lg:col-span-3">
          {selectedSlide ? (
            <CourseContentViewer slide={selectedSlide} />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-notion-gray-light/30 bg-white p-6 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20">
              <div className="text-center">
                <File className="mx-auto mb-3 h-10 w-10 text-notion-gray-light/40 dark:text-notion-gray-dark/40" />
                <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Select a slide from the sidebar to view content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
