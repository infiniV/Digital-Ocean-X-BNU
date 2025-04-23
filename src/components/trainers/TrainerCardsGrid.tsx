"use client";

import { useState } from "react";
import { Users, Book, CheckCircle, Layers, Award } from "lucide-react";
import Link from "next/link";

type Trainer = {
  id: string;
  name: string | null;
  email: string;
  bio: string | null;
  image: string | null;
  verificationStatus: string | null;
  stats: {
    totalCourses: number;
    publishedCourses: number;
    totalSlides: number;
  };
};

type TrainerCardsGridProps = {
  trainers: Trainer[];
};

export function TrainerCardsGrid({ trainers }: TrainerCardsGridProps) {
  const [hoverCard, setHoverCard] = useState<string | null>(null);

  // No search/filter: just show all trainers
  if (!trainers || trainers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-notion-gray-light/30 bg-white py-12 text-center dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60">
        <Users className="h-12 w-12 text-notion-text-light/30 dark:text-notion-text-dark/30" />
        <div>
          <h3 className="font-geist text-lg font-medium text-notion-text-light dark:text-notion-text-dark">
            No trainers found
          </h3>
          <p className="mt-1 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
            No trainers are available at the moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-notion-lg">
      {/* Trainers grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {trainers.map((trainer) => (
          <Link
            href={`/trainers/${trainer.id}`}
            key={trainer.id}
            className="group relative block"
            onMouseEnter={() => setHoverCard(trainer.id)}
            onMouseLeave={() => setHoverCard(null)}
          >
            <div
              className={`relative h-full overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-notion transition-all duration-500 hover:border-notion-pink hover:shadow-notion-lg dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink-dark ${
                hoverCard === trainer.id
                  ? "scale-[1.02] border-notion-pink shadow-notion-lg dark:border-notion-pink-dark"
                  : "scale-100"
              }`}
            >
              {/* Background pattern with grain effect */}
              <div className="absolute inset-0 bg-grain opacity-10"></div>

              {/* Animated glow effect on hover */}
              <div
                className={`pointer-events-none absolute -inset-1 z-0 rounded-xl bg-gradient-to-r from-notion-pink/20 via-notion-accent/20 to-notion-pink-dark/20 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-70 ${
                  hoverCard === trainer.id ? "opacity-70" : ""
                }`}
              ></div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="flex items-start gap-4">
                  {/* Profile image or placeholder */}
                  <div className="relative">
                    {trainer.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={trainer.image}
                        alt={trainer.name ?? ""}
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-notion-pink/30 transition-all duration-300 group-hover:ring-notion-pink"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-notion-gray-light/30 ring-2 ring-notion-pink/20 transition-all duration-300 group-hover:ring-notion-pink dark:bg-notion-gray-dark/50">
                        <Users className="h-8 w-8 text-notion-text-light/40 dark:text-notion-text-dark/40" />
                      </div>
                    )}

                    {/* Verification badge if verified */}
                    {trainer.verificationStatus === "verified" && (
                      <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-notion-pink text-white ring-2 ring-white dark:ring-notion-gray-dark/80">
                        <Award className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Trainer info */}
                  <div className="flex-1">
                    <h3 className="font-geist text-lg font-semibold text-notion-text-light transition-colors group-hover:text-notion-pink dark:text-notion-text-dark dark:group-hover:text-notion-pink-light">
                      {trainer.name}
                    </h3>
                    {/* Small glow under name on hover */}
                    <div
                      className={`h-0.5 w-0 bg-notion-pink/50 blur-[2px] transition-all duration-500 group-hover:w-2/3 ${
                        hoverCard === trainer.id ? "w-2/3" : ""
                      }`}
                    ></div>
                    {trainer.bio && (
                      <p className="mt-1 line-clamp-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                        {trainer.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs text-notion-text-light/80 transition-colors group-hover:bg-notion-pink/10 group-hover:text-notion-pink dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80 dark:group-hover:bg-notion-pink-dark/20 dark:group-hover:text-notion-pink-light">
                    <Book className="mr-0.5 h-3 w-3" />
                    {trainer.stats.totalCourses} courses
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-notion-accent-light/20 px-3 py-1 font-geist text-xs text-notion-accent-dark transition-colors group-hover:bg-notion-accent-light/30 dark:bg-notion-accent-dark/30 dark:text-notion-accent-light">
                    <CheckCircle className="mr-0.5 h-3 w-3" />
                    {trainer.stats.publishedCourses} published
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-notion-pink-light/20 px-3 py-1 font-geist text-xs text-notion-pink-dark transition-colors group-hover:bg-notion-pink-light/30 dark:bg-notion-pink-dark/30 dark:text-notion-pink-light">
                    <Layers className="mr-0.5 h-3 w-3" />
                    {trainer.stats.totalSlides} slides
                  </span>
                </div>

                {/* View profile button - appears on hover */}
                <div
                  className={`mt-4 overflow-hidden transition-all duration-300 ${
                    hoverCard === trainer.id
                      ? "max-h-10 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <button className="w-full rounded-lg border border-notion-pink/30 bg-notion-pink/10 py-2 font-geist text-sm font-medium text-notion-pink hover:bg-notion-pink/20 dark:border-notion-pink-dark/30 dark:bg-notion-pink-dark/10 dark:text-notion-pink-light dark:hover:bg-notion-pink-dark/20">
                    View Profile
                  </button>
                </div>
                {/* Subtle grain overlay for texture */}
                <div className="pointer-events-none absolute inset-0 rounded-lg bg-grain opacity-10"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
