import Link from "next/link";
import Image from "next/image";
import { Clock, Award } from "lucide-react";

interface EnrolledCourseProps {
  course: {
    id: string;
    title: string;
    coverImageUrl?: string | null;
    shortDescription?: string | null;
    trainer?: {
      name: string | null;
      image: string | null;
    };
  };
  enrollment: {
    status: string;
    progress: number;
    enrolledAt: Date | string;
  };
}

export function EnrolledCourseCard({
  course,
  enrollment,
}: EnrolledCourseProps) {
  // Get gradient background for courses without cover image
  const gradientBg = "linear-gradient(135deg, #ffcce0, #bbdeff)";

  return (
    <Link
      href={`/trainee/courses/${course.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-notion transition-all hover:border-notion-pink/20 hover:shadow-notion-hover dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50"
    >
      {/* Cover Image Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-notion-gray-light/10 dark:bg-notion-gray-dark/30">
        {course.coverImageUrl ? (
          <Image
            src={course.coverImageUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 will-change-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center transition-opacity"
            style={{ background: gradientBg }}
          >
            <span className="select-none font-geist text-2xl font-bold text-white/90">
              {course.title.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-notion-background/95 px-3 py-1.5 font-geist text-sm text-notion-text-light shadow-sm backdrop-blur-sm dark:bg-notion-background-dark/95 dark:text-notion-text-dark">
          <Award size={14} className="text-notion-pink" />
          <span className="capitalize">{enrollment.status}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-notion-md">
        <h3 className="mb-2 font-geist text-lg font-semibold leading-tight text-notion-text-light transition-colors group-hover:text-notion-pink dark:text-notion-text-dark">
          {course.title}
        </h3>

        {course.shortDescription && (
          <p className="mb-4 line-clamp-2 font-geist text-base text-notion-text-light/70 dark:text-notion-text-dark/70">
            {course.shortDescription}
          </p>
        )}

        {/* Progress Bar */}
        <div className="mt-auto">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Progress
            </span>
            <span className="font-geist text-sm font-medium text-notion-pink">
              {enrollment.progress}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-notion-gray-light/20 dark:bg-notion-gray-dark/40">
            <div
              className="h-full bg-notion-pink transition-all"
              style={{ width: `${enrollment.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 border-t border-notion-gray-light/20 bg-notion-gray-light/5 p-notion-md dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/80">
        <Clock size={14} className="text-notion-pink" />
        <span className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
          Enrolled{" "}
          {new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </Link>
  );
}
