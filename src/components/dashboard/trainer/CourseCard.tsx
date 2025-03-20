import Link from "next/link";
import { FileText, Users, ExternalLink } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string | null;
    coverImageUrl: string | null;
    status: string;
    skillLevel: string;
    createdAt: Date;
  };
  slideCount?: number;
}

export function CourseCard({ course, slideCount = 0 }: CourseCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
            Draft
          </span>
        );
      case "published":
        return (
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
            Published
          </span>
        );
      case "under_review":
        return (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
            Under Review
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-notion-gray-light/20 bg-notion-background transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
      <div className="relative h-40 w-full">
        {course.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.coverImageUrl}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-notion-pink/20 to-notion-pink/5 dark:from-notion-pink/10 dark:to-notion-pink/5">
            <FileText className="h-12 w-12 text-notion-pink/70" />
          </div>
        )}
        <div className="absolute right-2 top-2">
          {getStatusBadge(course.status)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
          {course.title}
        </h3>
        <p className="mb-4 line-clamp-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
          {course.shortDescription ?? "No description provided"}
        </p>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-notion-text-light/60 dark:text-notion-text-dark/60">
            <span className="inline-flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              {slideCount} Slides
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Level: {course.skillLevel}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/trainer/courses/${course.id}`}
            className="flex flex-1 items-center justify-center gap-1 rounded-md bg-notion-pink px-3 py-2 font-geist text-xs font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md"
          >
            Manage Course
          </Link>
          {course.status === "published" && (
            <Link
              href={`/courses/${course.slug}`}
              className="flex items-center justify-center rounded-md bg-notion-gray-light/10 px-3 py-2 font-geist text-xs font-medium text-notion-text-light/80 transition-all hover:bg-notion-gray-light/20 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80 dark:hover:bg-notion-gray-dark/30"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
