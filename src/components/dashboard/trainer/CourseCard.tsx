import Link from "next/link";
import { Book, Clock } from "lucide-react";
import { DeleteCourseButton } from "~/app/(dashboard)/trainer/courses/_components/DeleteCourseButton";

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
  showDeleteOption?: boolean;
}

export function CourseCard({
  course,
  slideCount = 0,
  showDeleteOption = false,
}: CourseCardProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses =
      "rounded-full px-3 py-1 text-xs font-semibold tracking-wide";
    switch (status) {
      case "draft":
        return (
          <span
            className={`${baseClasses} bg-yellow-100/80 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200`}
          >
            Draft
          </span>
        );
      case "published":
        return (
          <span
            className={`${baseClasses} bg-green-100/80 text-green-900 dark:bg-green-900/30 dark:text-green-200`}
          >
            Published
          </span>
        );
      case "under_review":
        return (
          <span
            className={`${baseClasses} bg-blue-100/80 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200`}
          >
            Under Review
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} bg-gray-100/80 text-gray-900 dark:bg-gray-800 dark:text-gray-200`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-sm transition-all hover:border-notion-pink/20 hover:shadow-md dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50 dark:hover:border-notion-pink/30">
      <div className="flex flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          {getStatusBadge(course.status)}
          {showDeleteOption && (
            <DeleteCourseButton
              courseId={course.id}
              courseName={course.title}
              variant="icon"
            />
          )}
        </div>

        <Link href={`/trainer/courses/${course.id}`} className="mb-3">
          <h3 className="font-geist text-xl font-bold leading-tight text-notion-text-light transition-colors group-hover:text-notion-pink dark:text-notion-text-dark dark:group-hover:text-notion-pink">
            {course.title}
          </h3>
        </Link>

        {course.shortDescription && (
          <p className="mb-5 line-clamp-2 font-geist text-sm font-medium leading-relaxed text-notion-text-light/70 dark:text-notion-text-dark/70">
            {course.shortDescription}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-notion-gray-light/10 px-3 py-2 font-geist text-sm font-medium text-notion-text-light/80 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80">
            <Clock size={16} className="text-notion-pink" />
            <span className="capitalize">{course.skillLevel}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-notion-gray-light/10 px-3 py-2 font-geist text-sm font-medium text-notion-text-light/80 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80">
            <Book size={16} className="text-notion-pink" />
            <span>
              {slideCount} {slideCount === 1 ? "Slide" : "Slides"}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/trainer/courses/${course.id}`}
        className="block border-t border-notion-gray-light/20 bg-notion-gray-light/5 px-6 py-4 text-center font-geist text-sm font-semibold text-notion-text-light transition-colors hover:bg-notion-pink hover:text-white dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/80 dark:text-notion-text-dark dark:hover:bg-notion-pink dark:hover:text-white"
      >
        Manage Course →
      </Link>
    </div>
  );
}
