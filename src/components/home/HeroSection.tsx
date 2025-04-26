"use client";

import { signIn } from "next-auth/react";
import { ArrowRight, BookOpen, LogIn, Circle } from "lucide-react";

export function HeroSection() {
  return (
    <div className="relative min-h-[85vh] overflow-hidden bg-notion-background transition-colors duration-300 dark:bg-notion-background-dark">
      {/* SVG Pattern Background */}
      <div
        className="absolute inset-0 opacity-70 dark:opacity-40"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full animate-pulse-slow"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dot-pattern"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1"
                className="fill-notion-pink/10 dark:fill-notion-pink/5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>

      {/* Decorative Circles */}
      <div className="absolute -left-32 -top-32 h-96 w-96 animate-float">
        <div className="absolute h-full w-full rounded-full border-[50px] border-notion-pink/30 dark:border-notion-pink/[0.02]"></div>
      </div>
      <div className="animation-delay-1000 absolute -right-40 bottom-10 h-[32rem] w-[32rem] animate-float">
        <div className="absolute h-full w-full rounded-full border-[70px] border-notion-pink/30 dark:border-notion-pink/[0.01]"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="text-center">
          <h1 className="animate-slide-down font-geist text-4xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">Empower Your Future</span>
          </h1>
          <p className="animation-delay-200 mx-auto mt-8 max-w-2xl animate-slide-up font-geist text-lg font-medium leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80 sm:text-xl md:text-2xl">
            Join a community of women supporting each other through education,
            mentorship, and networking opportunities.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6">
            <button
              onClick={() => signIn()}
              className="animation-delay-400 group relative w-full animate-slide-up overflow-hidden rounded-lg bg-notion-pink px-8 py-3.5 font-geist font-medium text-notion-text shadow-notion transition-all hover:bg-notion-pink-dark hover:shadow-notion-hover focus:outline-none focus:ring-2 focus:ring-notion-pink focus:ring-offset-2 sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <LogIn
                  size={18}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                <span>Get Started</span>
              </span>
            </button>
            <a
              href="#featured-courses"
              className="animation-delay-600 group relative w-full animate-slide-up overflow-hidden rounded-lg border border-notion-text-light/10 bg-transparent px-8 py-3.5 font-geist font-medium text-notion-text-light transition-all hover:border-notion-pink/30 hover:bg-notion-pink/5 focus:outline-none focus:ring-2 focus:ring-notion-pink/30 dark:border-notion-text-dark/10 dark:text-notion-text-dark dark:hover:border-notion-pink/30 sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                <BookOpen size={18} />
                <span>Browse Courses</span>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </a>
          </div>

          {/* Decorative Elements */}
          <div className="mt-20 flex animate-float items-center justify-center gap-10">
            <Circle
              size={8}
              className="fill-notion-pink/10 text-notion-pink/10 dark:fill-notion-pink/5 dark:text-notion-pink/5"
            />
            <Circle
              size={6}
              className="fill-notion-pink/20 text-notion-pink/20 dark:fill-notion-pink/10 dark:text-notion-pink/10"
            />
            <Circle
              size={8}
              className="fill-notion-pink/10 text-notion-pink/10 dark:fill-notion-pink/5 dark:text-notion-pink/5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
