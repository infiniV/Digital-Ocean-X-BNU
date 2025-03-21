import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProgressItem {
  slideId: string;
  courseId: string;
  courseTitle: string;
  slideTitle: string;
  completedAt: Date;
}

export function RecentProgress({ items }: { items: ProgressItem[] }) {
  return (
    <div className="rounded-xl border border-notion-gray-light/20 bg-notion-background p-6 shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-background-dark">
      <h3 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
        Recent Progress
      </h3>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <Link
            key={item.slideId}
            href={`/trainee/courses/${item.courseId}`}
            className="group flex items-center justify-between rounded-lg border border-notion-gray-light/10 bg-notion-gray-light/5 p-4 transition-all hover:border-notion-pink/20 hover:bg-notion-pink/5 dark:border-notion-gray-dark/10 dark:bg-notion-gray-dark/5"
          >
            <div>
              <p className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                {item.courseTitle}
              </p>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Completed: {item.slideTitle}
              </p>
            </div>
            <ArrowRight className="text-notion-text-light/30 transition-all group-hover:text-notion-pink dark:text-notion-text-dark/30" />
          </Link>
        ))}
      </div>
    </div>
  );
}
