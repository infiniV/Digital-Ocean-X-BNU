"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";

interface TrainerInfo {
  name: string | null;
  image: string | null;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  coverImageUrl: string | null;
  isFeatured: boolean | null;
  trainerId: string;
  createdAt: string | null;
  updatedAt: string | null;
  trainer: TrainerInfo | null;
}

function CourseCardSkeleton() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl bg-notion-gray-light p-4 dark:bg-notion-gray-dark">
      <div className="relative aspect-video animate-pulse overflow-hidden rounded-lg bg-notion-gray-light/50 dark:bg-notion-gray-dark/50"></div>
      <div className="mt-4 flex-1 space-y-3">
        <div className="h-6 w-3/4 animate-pulse rounded-md bg-notion-gray-light/50 dark:bg-notion-gray-dark/50"></div>
        <div className="h-4 w-full animate-pulse rounded-md bg-notion-gray-light/50 dark:bg-notion-gray-dark/50"></div>
        <div className="h-4 w-2/3 animate-pulse rounded-md bg-notion-gray-light/50 dark:bg-notion-gray-dark/50"></div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-notion-gray-light/50 dark:bg-notion-gray-dark/50"></div>
          <div className="h-4 w-24 animate-pulse rounded-md bg-notion-gray-light/50 dark:bg-notion-gray-dark/50"></div>
        </div>
      </div>
    </div>
  );
}

function FeaturedCourseCard({ course }: { course: Course }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-notion-gray-light/20 bg-notion-background p-4 transition-all hover:border-notion-pink/30 hover:shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-background-dark dark:hover:border-notion-pink/20">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-notion-gray-light/50 dark:bg-notion-gray-dark/50">
        {course.coverImageUrl ? (
          <Image
            src={course.coverImageUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-notion-pink/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
      </div>
      <div className="mt-4 flex-1 space-y-2">
        <h3 className="line-clamp-2 font-geist text-lg font-semibold tracking-tight text-notion-text-light transition-colors group-hover:text-notion-pink dark:text-notion-text-dark">
          {course.title}
        </h3>
        <p className="line-clamp-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
          {course.shortDescription}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-notion-pink ring-2 ring-notion-pink/20">
            {course.trainer?.image ? (
              <Image
                src={course.trainer.image}
                alt={course.trainer.name ?? "Trainer"}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-notion-text-dark">
                {course.trainer?.name?.[0] ?? "T"}
              </div>
            )}
          </div>
          <span className="font-geist text-sm font-medium text-notion-text-light/90 dark:text-notion-text-dark/90">
            {course.trainer?.name ?? "Unknown trainer"}
          </span>
        </div>
        <Link
          href={`/courses/${course.slug}`}
          className="group/link flex items-center gap-1 font-geist text-sm font-medium text-notion-pink transition-colors hover:text-notion-pink-dark"
        >
          Learn more
          <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

interface CoursesApiResponse {
  courses: Course[];
}

export function FeaturedCourseCarousel() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses/featured");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = (await response.json()) as CoursesApiResponse;
      setCourses(data.courses);
    } catch (err) {
      setError("Failed to load courses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCourses();
  }, []);

  return (
    <section className="my-16 scroll-mt-16" id="featured-courses">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-geist text-4xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            Featured Courses
          </h2>
          <p className="mt-3 font-geist text-lg text-notion-text-light/70 dark:text-notion-text-dark/70">
            Discover our most popular courses crafted by expert trainers
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8 dark:border-red-900/20 dark:bg-red-900/10">
            <p className="font-geist text-base font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                void fetchCourses();
              }}
              className="mt-4 flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 font-geist text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
            >
              <Loader2 size={16} className="animate-spin" />
              Try again
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-notion-gray-light/20 bg-notion-gray-light/5 p-8 dark:border-notion-gray-dark/20">
            <p className="font-geist text-base font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
              No featured courses available at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <FeaturedCourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
