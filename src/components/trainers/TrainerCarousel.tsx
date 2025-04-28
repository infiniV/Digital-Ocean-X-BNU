"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Users, Award } from "lucide-react";

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
        <div className="rounded-xl bg-notion-gray-light p-16 dark:bg-notion-gray-dark">
          <div className="mx-auto h-6 w-24 animate-pulse rounded-full bg-notion-disabled-light dark:bg-notion-disabled-dark"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-notion-gray-light/20 py-notion-xl dark:bg-notion-gray-dark/30">
      {/* Background grain effect */}
      <div className="absolute inset-0 bg-grain opacity-10"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-notion-lg flex items-end justify-between">
          <div>
            <h2 className="font-geist text-3xl font-bold text-notion-text-light dark:text-notion-text-dark">
              Meet Our Expert Trainers
            </h2>
            <div className="mt-2 h-1 w-16 bg-notion-accent-light dark:bg-notion-accent-dark"></div>
            <p className="mt-4 max-w-2xl font-geist text-notion-text-light/80 dark:text-notion-text-dark/80">
              Learn from industry professionals who are passionate about
              empowering women in technology
            </p>
          </div>

          <div className="hidden md:flex md:items-center md:gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous trainer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-notion-disabled-light text-notion-text-light/80 transition-colors hover:border-notion-accent-light hover:text-notion-accent-light dark:border-notion-disabled-dark dark:text-notion-text-dark/80 dark:hover:border-notion-accent-dark dark:hover:text-notion-accent-dark"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next trainer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-notion-disabled-light text-notion-text-light/80 transition-colors hover:border-notion-accent-light hover:text-notion-accent-light dark:border-notion-disabled-dark dark:text-notion-text-dark/80 dark:hover:border-notion-accent-dark dark:hover:text-notion-accent-dark"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className="relative"
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
                    <div className="flex flex-col gap-8 rounded-xl border border-notion-gray-light/30 bg-notion-background-light py-4 shadow-notion dark:border-notion-gray-dark/30 dark:bg-notion-background-dark md:flex-row md:p-8">
                      {/* Background pattern with grain effect */}
                      <div className="absolute inset-0 rounded-xl bg-grain opacity-10"></div>

                      {/* Trainer image */}
                      <div className="relative mx-auto w-48 md:mx-0">
                        <div className="relative">
                          <div className="overflow-hidden rounded-xl border-4 border-notion-accent-light/20 shadow-notion dark:border-notion-accent-dark/20">
                            {trainer.image ? (
                              <div className="relative h-48 w-48 overflow-hidden rounded-xl">
                                <Image
                                  src={trainer.image}
                                  alt={trainer.name ?? "Trainer"}
                                  width={192}
                                  height={192}
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                              </div>
                            ) : (
                              <div className="flex h-48 w-48 items-center justify-center rounded-xl bg-notion-gray-light dark:bg-notion-gray-dark">
                                <Users className="h-16 w-16 text-notion-text-light/40 dark:text-notion-text-dark/40" />
                              </div>
                            )}
                          </div>

                          {/* Verification badge if verified */}
                          {trainer.verificationStatus === "verified" && (
                            <div className="absolute bottom-0 right-0 flex h-10 w-10 translate-x-1/4 translate-y-1/4 items-center justify-center rounded-full bg-notion-accent-light text-white shadow-lg dark:bg-notion-accent-dark">
                              <Award className="h-5 w-5" />
                            </div>
                          )}
                        </div>

                        {/* Stats indicators */}
                        <div className="mt-4 flex justify-center gap-2 md:justify-start">
                          <div className="flex flex-col items-center rounded-lg bg-notion-gray-light px-3 py-2 dark:bg-notion-gray-dark">
                            <span className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
                              {trainer.stats.totalCourses}
                            </span>
                            <span className="text-xs text-notion-text-light/70 dark:text-notion-text-dark/70">
                              Courses
                            </span>
                          </div>
                          <div className="flex flex-col items-center rounded-lg bg-notion-gray-light px-3 py-2 dark:bg-notion-gray-dark">
                            <span className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
                              {trainer.stats.totalStudents.toLocaleString()}
                            </span>
                            <span className="text-xs text-notion-text-light/70 dark:text-notion-text-dark/70">
                              Students
                            </span>
                          </div>
                          {/* <div className="flex flex-col items-center rounded-lg bg-notion-gray-light/30 px-3 py-2 dark:bg-notion-gray-dark/40">
                            <span className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
                              {trainer.stats.averageRating}
                            </span>
                            <span className="text-xs text-notion-text-light/70 dark:text-notion-text-dark/70">
                              Rating
                            </span>
                          </div> */}
                        </div>
                      </div>

                      {/* Trainer info */}
                      <div className="relative z-10 flex-1 md:pl-4">
                        <h3 className="text-center font-geist text-2xl font-semibold text-notion-text-light dark:text-notion-text-dark md:text-left">
                          {trainer.name}
                        </h3>
                        <div className="mx-auto mt-2 h-1 w-12 bg-notion-accent-light dark:bg-notion-accent-dark md:mx-0"></div>

                        <p className="mt-4 line-clamp-3 text-center font-geist text-notion-text-light/80 dark:text-notion-text-dark/80 md:text-left">
                          {trainer.bio ??
                            "Experienced trainer helping women develop valuable digital skills."}
                        </p>

                        <div className="mt-6 space-y-4">
                          <div className="flex justify-center pt-4 md:justify-start">
                            <Link
                              href={`/trainers/${trainer.id}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-notion-accent-light px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-notion-accent dark:bg-notion-accent-dark dark:text-notion-text dark:hover:bg-notion-accent"
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
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-6 bg-notion-accent-light dark:bg-notion-accent-dark"
                        : "bg-notion-disabled-light hover:bg-notion-gray-light dark:bg-notion-disabled-dark dark:hover:bg-notion-gray-dark"
                    }`}
                  ></button>
                ))}
              </div>

              {/* Mobile navigation buttons */}
              <div className="mt-4 flex items-center justify-center gap-4 md:hidden">
                <button
                  onClick={handlePrev}
                  aria-label="Previous trainer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-notion-disabled-light text-notion-text-light/80 transition-colors hover:border-notion-accent-light hover:text-notion-accent-light dark:border-notion-disabled-dark dark:text-notion-text-dark/80 dark:hover:border-notion-accent-dark dark:hover:text-notion-accent-dark"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next trainer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-notion-disabled-light text-notion-text-light/80 transition-colors hover:border-notion-accent-light hover:text-notion-accent-light dark:border-notion-disabled-dark dark:text-notion-text-dark/80 dark:hover:border-notion-accent-dark dark:hover:text-notion-accent-dark"
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-notion-accent-light/30 bg-notion-accent-light/10 px-5 py-2.5 font-geist text-sm font-medium text-notion-accent-light hover:bg-notion-accent-light/20 dark:border-notion-accent-dark/30 dark:bg-notion-accent-dark/10 dark:text-notion-accent-dark dark:hover:bg-notion-accent-dark/20"
          >
            View All Trainers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
