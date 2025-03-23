import Link from "next/link";
import Image from "next/image";
import { Book, Clock, Award, Eye } from "lucide-react";
import { DeleteCourseButton } from "~/app/(dashboard)/trainer/courses/_components/DeleteCourseButton";
import { useMemo } from "react";

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
  isFeatured?: boolean;
}

// Predefined pastel gradient combinations
const PASTEL_GRADIENTS = [
  "linear-gradient(135deg, #ffcce0, #bbdeff)",
  "linear-gradient(135deg, #ffef96, #c6ebc9)",
  "linear-gradient(135deg, #d3c6e4, #ffd1dc)",
  "linear-gradient(135deg, #b5e8d5, #c6bbea)",
  "linear-gradient(135deg, #ffcbcb, #ffe3b0)",
  "linear-gradient(135deg, #c4e0fb, #edc0ec)",
  "linear-gradient(135deg, #bbefcb, #a0e3e0)",
  "linear-gradient(135deg, #ffdda6, #c0baee)",
  "linear-gradient(135deg, #ffccd2, #b3e5fc)",
  "linear-gradient(135deg, #c9ffda, #ffe6c0)",
];

export function CourseCard({
  course,
  slideCount = 0,
  showDeleteOption = false,
  isFeatured = false,
}: CourseCardProps) {
  // Get a deterministic gradient based on course ID so the same course always has the same gradient
  const gradientBackground = useMemo(() => {
    // Use the hash of course.id to select a consistent gradient for each course
    const index =
      Math.abs(
        course.id.split("").reduce((acc, char) => {
          return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0),
      ) % PASTEL_GRADIENTS.length;

    return PASTEL_GRADIENTS[index];
  }, [course.id]);

  // Refined status badge function
  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex rounded-full px-3 py-1.5 font-geist text-sm font-medium tracking-tight";
    switch (status) {
      case "draft":
        return (
          <span
            className={`${baseClasses} bg-yellow-100/90 text-yellow-900 backdrop-blur-sm dark:bg-yellow-900/30 dark:text-yellow-200`}
          >
            Draft
          </span>
        );
      case "published":
        return (
          <span
            className={`${baseClasses} bg-green-100/90 text-green-900 backdrop-blur-sm dark:bg-green-900/30 dark:text-green-200`}
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
    <div className="group relative flex h-[28rem] w-full flex-col overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-notion-pink/20 hover:shadow-md dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50 dark:hover:border-notion-pink/30">
      {/* Cover Image Section - Fixed aspect ratio container */}
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-notion-gray-light/10 dark:bg-notion-gray-dark/30">
        {course.coverImageUrl ? (
          <Image
            src={course.coverImageUrl}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full w-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-105"
            priority
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-cover bg-center"
            style={{ background: gradientBackground }}
          >
            <span className="select-none font-geist text-4xl font-bold tracking-tight text-white/90 drop-shadow-sm">
              {course.title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        {isFeatured && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-notion-pink/95 px-3 py-1.5 font-geist text-sm font-medium text-white shadow-sm backdrop-blur-sm">
            <Award size={14} className="shrink-0" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          {getStatusBadge(course.status)}
          {showDeleteOption && (
            <DeleteCourseButton
              courseId={course.id}
              courseName={course.title}
              variant="icon"
            />
          )}
        </div>

        <Link
          href={`/trainer/courses/${course.id}`}
          className="group/title mb-3"
        >
          <h3 className="line-clamp-2 font-geist text-lg font-semibold leading-tight text-notion-text-light transition-colors group-hover/title:text-notion-pink dark:text-notion-text-dark dark:group-hover/title:text-notion-pink">
            {course.title}
          </h3>
        </Link>

        {course.shortDescription && (
          <p className="mb-4 line-clamp-2 font-geist text-sm leading-relaxed text-notion-text-light/70 dark:text-notion-text-dark/70">
            {course.shortDescription}
          </p>
        )}

        {/* Metrics Section */}
        <div className="mt-auto flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-notion-gray-light/10 px-3 py-2 font-geist text-sm text-notion-text-light/80 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80">
            <Clock size={15} className="shrink-0 text-notion-pink" />
            <span className="capitalize">{course.skillLevel}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-notion-gray-light/10 px-3 py-2 font-geist text-sm text-notion-text-light/80 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80">
            <Book size={15} className="shrink-0 text-notion-pink" />
            <span>
              {slideCount} {slideCount === 1 ? "Slide" : "Slides"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="mt-auto grid grid-cols-2 border-t border-notion-gray-light/20 dark:border-notion-gray-dark/20">
        <Link
          href={`/trainer/courses/${course.id}`}
          className="flex items-center justify-center gap-1.5 bg-notion-gray-light/5 px-4 py-3.5 font-geist text-sm font-medium text-notion-text-light/90 transition-colors hover:bg-notion-pink hover:text-white dark:bg-notion-gray-dark/80 dark:text-notion-text-dark/90 dark:hover:bg-notion-pink dark:hover:text-white"
        >
          <span>Manage</span>
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          href={`/courses/${course.id}/preview`}
          className="hover:bg-notion-blue dark:hover:bg-notion-blue flex items-center justify-center gap-1.5 border-l border-notion-gray-light/20 bg-notion-gray-light/5 px-4 py-3.5 font-geist text-sm font-medium text-notion-text-light/90 transition-colors hover:text-white dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/80 dark:text-notion-text-dark/90 dark:hover:text-white"
        >
          <Eye size={15} className="shrink-0" />
          <span>Preview</span>
        </Link>
      </div>
    </div>
  );
}
