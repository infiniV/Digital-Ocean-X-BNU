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
    <div className="mb-notion-xl animate-fade-in">
      <h2 className="mb-notion-lg font-geist text-2xl font-semibold text-notion-text-light transition-colors dark:text-notion-text-dark">
        Course Content
      </h2>

      <div className="grid grid-cols-1 gap-notion-lg lg:grid-cols-4">
        {/* Content navigation sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-notion-background-light sticky top-8 animate-slide-in rounded-lg border border-notion-gray-light/30 shadow-notion transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/40 dark:bg-notion-background-dark">
            <div className="border-b border-notion-gray-light/20 bg-notion-gray-light/10 px-notion-md py-notion-sm dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
              <h3 className="font-geist text-sm font-medium tracking-tight text-notion-text-light/90 dark:text-notion-text-dark/90">
                Course Materials ({slides.length})
              </h3>
            </div>
            <div className="max-h-[75vh] overflow-y-auto">
              <ul className="divide-y divide-notion-gray-light/15 dark:divide-notion-gray-dark/25">
                {slides.map((slide) => (
                  <li key={slide.id}>
                    <button
                      onClick={() => setSelectedSlide(slide)}
                      className={`group flex w-full items-center px-notion-md py-notion-sm text-left transition-all hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/40 ${
                        selectedSlide?.id === slide.id
                          ? "bg-notion-pink-light/20 dark:bg-notion-pink-dark/20"
                          : ""
                      }`}
                    >
                      <div className="mr-notion-sm flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-notion-gray-light/15 transition-colors group-hover:bg-notion-gray-light/25 dark:bg-notion-gray-dark/30 dark:group-hover:bg-notion-gray-dark/50">
                        {getFileIcon(slide.fileType)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="dark:group-hover:text-notion-accent-dark truncate font-geist text-sm font-medium text-notion-text-light/90 transition-colors group-hover:text-notion-accent dark:text-notion-text-dark/90">
                          {slide.title}
                        </h4>
                        {slide.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-notion-text-light/60 dark:text-notion-text-dark/60">
                            {slide.description}
                          </p>
                        )}
                      </div>
                      {selectedSlide?.id === slide.id && (
                        <div className="ml-notion-sm h-2 w-2 shrink-0 animate-pulse-slow rounded-full bg-notion-accent"></div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Content viewer */}
        <div className="lg:col-span-3">
          {selectedSlide ? (
            <div className="animate-scale-in">
              <CourseContentViewer slide={selectedSlide} />
            </div>
          ) : (
            <div className="bg-notion-background-light/50 shadow-notion-xs flex h-[400px] items-center justify-center rounded-lg border border-dashed border-notion-gray-light/40 p-notion-lg transition-all hover:shadow-notion dark:border-notion-gray-dark/40 dark:bg-notion-background-dark/50">
              <div className="text-center">
                <File className="mx-auto mb-notion-sm h-12 w-12 animate-float text-notion-gray-light/50 dark:text-notion-gray-dark/50" />
                <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
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
