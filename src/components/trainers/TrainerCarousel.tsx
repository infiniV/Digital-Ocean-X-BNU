"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Users, Award, Book } from "lucide-react";

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
    totalStudents: number;
    averageRating: number;
  };
};

type TrainerCarouselProps = {
  trainers: Trainer[];
};

export function TrainerCarousel({ trainers }: TrainerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [autoplayPaused, setAutoplayPaused] = useState(false);

  // Handle mounting for client-side animations
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-advance carousel every 5 seconds unless paused
  useEffect(() => {
    if (!autoplayPaused && trainers.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % trainers.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplayPaused, trainers.length]);

  // Pause autoplay when hovering
  useEffect(() => {
    if (isHovering) {
      setAutoplayPaused(true);
    } else {
      // Resume autoplay after leaving hover
      const timer = setTimeout(() => {
        setAutoplayPaused(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isHovering]);

  const handlePrev = () => {
    setActiveIndex((current) =>
      current === 0 ? trainers.length - 1 : current - 1,
    );
    setAutoplayPaused(true);
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % trainers.length);
    setAutoplayPaused(true);
  };

  if (!mounted || trainers.length === 0) {
    return (
      <div className="container mx-auto py-notion-lg">
        <div className="rounded-xl bg-notion-gray-light/30 p-16 dark:bg-notion-gray-dark/40">
          <div className="mx-auto h-6 w-24 animate-pulse rounded-full bg-notion-disabled-light dark:bg-notion-disabled-dark"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden py-notion-xl">
      {/* Background grain effect */}
      <div className="fixed inset-0 z-[-1] bg-grain opacity-10"></div>

      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-notion-lg flex items-end justify-between">
          <div>
            <h2 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
              Meet Our Expert Trainers
            </h2>
            <div className="mt-2 h-1 w-12 bg-notion-pink opacity-70 sm:w-16 md:w-24"></div>
            <p className="mt-4 max-w-2xl font-geist text-base leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80">
              Learn from industry professionals who are passionate about
              empowering women in technology
            </p>
          </div>

          <div className="hidden md:flex md:items-center md:gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous trainer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-notion-gray-light/20 text-notion-text-light/80 transition-colors hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:text-notion-text-dark/80 dark:hover:border-notion-pink-dark dark:hover:text-notion-pink-light"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next trainer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-notion-gray-light/20 text-notion-text-light/80 transition-colors hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:text-notion-text-dark/80 dark:hover:border-notion-pink-dark dark:hover:text-notion-pink-light"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className="relative animate-fade-in"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="overflow-hidden rounded-xl">
            <div className="relative rounded-xl">
              {/* Carousel slider */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {trainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="w-full flex-shrink-0 px-4 md:px-6"
                  >
                    <div className="relative rounded-xl border border-notion-gray-light/20 bg-white p-4 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/60 sm:p-6 md:p-8">
                      {/* Background pattern with grain effect */}
                      <div className="absolute inset-0 rounded-xl bg-grain opacity-10"></div>

                      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:gap-8">
                        {/* Profile image with verification badge */}
                        <div className="relative flex justify-center md:block">
                          <div className="overflow-hidden rounded-full border-4 border-notion-pink/20 shadow-notion">
                            {trainer.image ? (
                              <div className="group relative h-24 w-24 overflow-hidden rounded-full transition-all duration-500 sm:h-32 sm:w-32 md:h-40 md:w-40">
                                <Image
                                  src={trainer.image}
                                  alt={trainer.name ?? "Trainer"}
                                  width={160}
                                  height={160}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                              </div>
                            ) : (
                              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-notion-gray-light/30 transition-all duration-300 dark:bg-notion-gray-dark/50 sm:h-32 sm:w-32 md:h-40 md:w-40">
                                <Users className="h-12 w-12 text-notion-text-light/40 dark:text-notion-text-dark/40 sm:h-16 sm:w-16" />
                              </div>
                            )}
                          </div>
                          {/* Verification badge if verified */}
                          {trainer.verificationStatus === "verified" && (
                            <div className="absolute bottom-0 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-notion-pink text-white shadow-lg sm:right-4 md:right-6 md:h-10 md:w-10">
                              <Award className="h-4 w-4 md:h-5 md:w-5" />
                            </div>
                          )}
                        </div>

                        {/* Trainer info */}
                        <div className="flex-1 space-y-notion-sm text-center sm:space-y-notion-md md:text-left">
                          <div>
                            <h3 className="font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
                              {trainer.name}
                            </h3>
                            <div className="mx-auto mt-2 h-1 w-12 bg-notion-pink opacity-70 sm:w-16 md:mx-0 md:w-20"></div>
                          </div>

                          <p className="font-geist text-base leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80 md:max-w-xl">
                            {trainer.bio ??
                              "Experienced trainer helping women develop valuable digital skills."}
                          </p>

                          <div className="flex flex-wrap justify-center gap-2 pt-2 sm:gap-3 md:justify-start">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-gray-light/30 px-3 py-1 font-geist text-xs text-notion-text-light/80 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark/80 sm:px-4 sm:py-1.5 sm:text-sm">
                              <Book className="h-4 w-4" />
                              {trainer.stats.totalCourses} courses
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-notion-accent-light/20 px-3 py-1 font-geist text-xs text-notion-accent-dark dark:bg-notion-accent-dark/30 dark:text-notion-accent-light sm:px-4 sm:py-1.5 sm:text-sm">
                              <Users className="h-4 w-4" />
                              {trainer.stats.totalStudents.toLocaleString()}{" "}
                              students
                            </span>
                          </div>

                          <div className="mt-6 flex justify-center md:justify-start">
                            <Link
                              href={`/trainers/${trainer.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-notion-pink/30 bg-notion-pink/10 px-4 py-2 font-geist text-sm font-medium text-notion-pink transition-colors hover:bg-notion-pink/20 dark:border-notion-pink-dark/30 dark:bg-notion-pink-dark/10 dark:text-notion-pink-light dark:hover:bg-notion-pink-dark/20"
                            >
                              View Profile
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation dots */}
              <div className="mt-6 flex justify-center gap-2">
                {trainers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveIndex(index);
                      setAutoplayPaused(true);
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-6 bg-notion-pink dark:bg-notion-pink-dark"
                        : "w-2 bg-notion-gray-light/50 hover:bg-notion-gray-light dark:bg-notion-gray-dark/50 dark:hover:bg-notion-gray-dark"
                    }`}
                  ></button>
                ))}
              </div>

              {/* Mobile navigation buttons */}
              <div className="mt-4 flex items-center justify-center gap-4 md:hidden">
                <button
                  onClick={handlePrev}
                  aria-label="Previous trainer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-notion-gray-light/20 text-notion-text-light/80 transition-colors hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:text-notion-text-dark/80 dark:hover:border-notion-pink-dark dark:hover:text-notion-pink-light"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next trainer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-notion-gray-light/20 text-notion-text-light/80 transition-colors hover:border-notion-pink hover:text-notion-pink dark:border-notion-gray-dark/30 dark:text-notion-text-dark/80 dark:hover:border-notion-pink-dark dark:hover:text-notion-pink-light"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-notion-lg text-center">
          <Link
            href="/trainers"
            className="inline-flex items-center gap-1.5 rounded-lg border border-notion-pink/30 bg-notion-pink/10 px-5 py-2.5 font-geist text-sm font-medium text-notion-pink hover:bg-notion-pink/20 dark:border-notion-pink-dark/30 dark:bg-notion-pink-dark/10 dark:text-notion-pink-light dark:hover:bg-notion-pink-dark/20"
          >
            View All Trainers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
