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
    <div className="grid grid-cols-1 gap-notion-xl">
      {/* Course Progress */}
      <div className="bg-notion-background-light animate-fade-in rounded-lg border border-notion-gray-light/30 p-notion-lg shadow-notion transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
        <div className="mb-notion-md space-y-notion-xs">
          <p className="font-geist text-sm font-medium text-notion-text-light/60 dark:text-notion-text-dark/60">
            Course Progress
          </p>
          <p className="font-geist text-3xl font-semibold text-notion-text-light dark:text-notion-text-dark">
            {courseProgress.progress}%
          </p>
        </div>
        <div className="bg-notion-disabled-light h-2.5 w-full overflow-hidden rounded-full dark:bg-notion-disabled-dark">
          <div
            className="h-full bg-notion-accent transition-all duration-300 ease-out"
            style={{ width: `${courseProgress.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Content navigator */}
      <div className="bg-notion-background-light animate-slide-in rounded-lg border border-notion-gray-light/30 shadow-notion transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
        <div className="border-b border-notion-gray-light/30 bg-notion-gray-light/10 px-notion-lg py-notion-md dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
          <h3 className="font-geist text-base font-semibold text-notion-text-light dark:text-notion-text-dark">
            Course Materials
          </h3>
        </div>
        <div className="max-h-[400px] divide-y divide-notion-gray-light/20 overflow-y-auto dark:divide-notion-gray-dark/20">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`group flex items-start gap-notion-md border-l-2 px-notion-lg py-notion-md transition-all hover:bg-notion-gray-light/10 dark:hover:bg-notion-gray-dark/40 ${
                selectedSlide?.id === slide.id
                  ? "border-l-notion-accent bg-notion-gray-light/15 dark:bg-notion-gray-dark/50"
                  : "border-l-transparent"
              }`}
            >
              <button
                onClick={() => setSelectedSlide(slide)}
                className="flex-1 text-left"
              >
                <div className="flex items-start gap-notion-md">
                  <FileText
                    size={20}
                    className={`mt-0.5 shrink-0 transition-colors ${
                      selectedSlide?.id === slide.id
                        ? "text-notion-accent"
                        : "text-notion-text-light/40 group-hover:text-notion-accent/70 dark:text-notion-text-dark/40"
                    }`}
                  />
                  <div className="space-y-notion-xs">
                    <p
                      className={`font-geist text-sm font-medium transition-colors ${
                        selectedSlide?.id === slide.id
                          ? "text-notion-text-light dark:text-notion-text-dark"
                          : "text-notion-text-light/70 dark:text-notion-text-dark/70"
                      }`}
                    >
                      {slide.title}
                    </p>
                    {slide.description && (
                      <p className="line-clamp-2 text-sm text-notion-text-light/50 dark:text-notion-text-dark/50">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
              <button
                onClick={() => toggleSlideProgress(slide.id)}
                disabled={isUpdating}
                className={`shrink-0 rounded-full p-notion-sm transition-all ${
                  slideProgress[slide.id]
                    ? "bg-green-100/80 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40"
                    : "bg-notion-disabled-light text-notion-text-light/50 hover:bg-notion-disabled-hover dark:bg-notion-disabled-dark dark:text-notion-text-dark/50 dark:hover:bg-notion-disabled-dark-hover"
                }`}
              >
                {isUpdating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Content viewer and notes */}
      <div className="animate-fade-in">
        {selectedSlide ? (
          <div className="grid grid-cols-1 gap-notion-xl lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="bg-notion-background-light rounded-lg border border-notion-gray-light/30 p-notion-xl shadow-notion transition-all hover:shadow-notion-hover dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
                <CourseContentViewer slide={selectedSlide} />
              </div>
            </div>
            <div className="animate-slide-in lg:col-span-1">
              <CourseNotes slideId={selectedSlide.id} />
            </div>
          </div>
        ) : (
          <div className="border-notion-disabled-light bg-notion-background-light flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed p-notion-xl dark:border-notion-disabled-dark dark:bg-notion-background-dark">
            <div className="text-center">
              <FileText className="mx-auto mb-notion-md h-12 w-12 text-notion-disabled-text dark:text-notion-disabled-text-dark" />
              <p className="font-geist text-notion-text-light/60 dark:text-notion-text-dark/60">
                Select a slide to view its content
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
