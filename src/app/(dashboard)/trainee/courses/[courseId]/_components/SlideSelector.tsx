"use client";

import { useState, useEffect } from "react";
import { FileText, Check, Loader2 } from "lucide-react";
import { CourseContentViewer } from "~/app/courses/[courseId]/preview/_components/CourseContentViewer";
import { CourseNotes } from "./CourseNotes";

interface Slide {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  originalFilename: string;
  order: number;
}

interface SlideProgress {
  slideId: string;
  completed: boolean;
  completedAt: string | null;
}

interface CourseProgress {
  progress: number;
  status: "active" | "completed";
}

interface SlideSelectorProps {
  slides: Slide[];
  courseId: string;
}

export function SlideSelector({ slides, courseId }: SlideSelectorProps) {
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(
    slides[0] ?? null,
  );
  const [slideProgress, setSlideProgress] = useState<Record<string, boolean>>(
    {},
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [courseProgress, setCourseProgress] = useState<CourseProgress>({
    progress: 0,
    status: "active",
  });

  // Fetch initial slide progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(
          `/api/trainee/progress/slides?courseId=${courseId}`,
        );
        if (response.ok) {
          const progressData = (await response.json()) as SlideProgress[];
          const progressMap = progressData.reduce(
            (acc, curr) => {
              acc[curr.slideId] = curr.completed;
              return acc;
            },
            {} as Record<string, boolean>,
          );
          setSlideProgress(progressMap);
        }
      } catch (error) {
        console.error("Error fetching slide progress:", error);
      }
    };

    if (courseId) {
      void fetchProgress();
    }
  }, [courseId]);

  // Update slide progress
  const toggleSlideProgress = async (slideId: string) => {
    try {
      setIsUpdating(true);
      const completed = !slideProgress[slideId];

      const response = await fetch(`/api/trainee/progress/slides/${slideId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        interface SlideProgressResponse {
          slideProgress: {
            completed: boolean;
          };
          courseProgress: CourseProgress;
        }

        const data = (await response.json()) as SlideProgressResponse;
        setSlideProgress((prev) => ({
          ...prev,
          [slideId]: data.slideProgress.completed,
        }));
        setCourseProgress(data.courseProgress);
      }
    } catch (error) {
      console.error("Error updating slide progress:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="gap-notion-lg grid grid-cols-1">
      {/* Course Progress */}
      <div className="p-notion-md rounded-lg border border-notion-gray-light/20 bg-white shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
        <div className="mb-notion-sm">
          <p className="font-geist text-base font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Course Progress
          </p>
          <p className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark">
            {courseProgress.progress}%
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-notion-gray-light/20 dark:bg-notion-gray-dark/40">
          <div
            className="h-full bg-notion-pink transition-all"
            style={{ width: `${courseProgress.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Content navigator */}
      <div className="rounded-lg border border-notion-gray-light/20 bg-white shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
        <div className="border-b border-notion-gray-light/20 bg-notion-gray-light/5 px-4 py-3 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/80">
          <h3 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
            Course Materials
          </h3>
        </div>
        <div className="divide-y divide-notion-gray-light/20 dark:divide-notion-gray-dark/20">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`flex items-start gap-3 border-l-2 px-4 py-3 transition-colors hover:bg-notion-gray-light/5 dark:hover:bg-notion-gray-dark/30 ${
                selectedSlide?.id === slide.id
                  ? "border-l-notion-pink bg-notion-gray-light/10 dark:bg-notion-gray-dark/40"
                  : "border-l-transparent"
              }`}
            >
              <button
                onClick={() => setSelectedSlide(slide)}
                className="flex-1 text-left"
              >
                <div className="flex items-start gap-3">
                  <FileText
                    size={18}
                    className={`mt-0.5 shrink-0 ${
                      selectedSlide?.id === slide.id
                        ? "text-notion-pink"
                        : "text-notion-text-light/40 dark:text-notion-text-dark/40"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-geist text-sm font-medium ${
                        selectedSlide?.id === slide.id
                          ? "text-notion-text-light dark:text-notion-text-dark"
                          : "text-notion-text-light/70 dark:text-notion-text-dark/70"
                      }`}
                    >
                      {slide.title}
                    </p>
                    {slide.description && (
                      <p className="mt-0.5 line-clamp-2 text-sm text-notion-text-light/50 dark:text-notion-text-dark/50">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
              <button
                onClick={() => toggleSlideProgress(slide.id)}
                disabled={isUpdating}
                className={`shrink-0 rounded-full p-1.5 transition-colors ${
                  slideProgress[slide.id]
                    ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                    : "bg-notion-gray-light/10 text-notion-text-light/50 hover:bg-notion-gray-light/20 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/50 dark:hover:bg-notion-gray-dark/30"
                }`}
              >
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content viewer and notes */}
      {selectedSlide ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-notion-gray-light/20 bg-white p-6 shadow-sm dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
              <CourseContentViewer slide={selectedSlide} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <CourseNotes slideId={selectedSlide.id} />
          </div>
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-notion-gray-light/30 bg-white p-6 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20">
          <div className="text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-notion-gray-light/40 dark:text-notion-gray-dark/40" />
            <p className="font-geist text-notion-text-light/70 dark:text-notion-text-dark/70">
              Select a slide to view its content
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
