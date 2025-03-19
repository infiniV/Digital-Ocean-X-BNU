"use client";

import { signIn } from "next-auth/react";
import { ArrowRight, BookOpen, LogIn, Circle } from "lucide-react";

export function HeroSection() {
  return (
    <div className="bg-notion-background dark:bg-notion-background-dark relative min-h-[80vh] overflow-hidden">
      {/* SVG Pattern Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="dot-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" className="fill-notion-pink/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>

      {/* Decorative Circles */}
      <div className="absolute -left-20 -top-20 h-64 w-64">
        <div className="absolute h-full w-full rounded-full border-[40px] border-notion-pink/10"></div>
      </div>
      <div className="absolute -bottom-32 -right-32 h-96 w-96">
        <div className="absolute h-full w-full rounded-full border-[60px] border-notion-pink/5"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="text-center">
          <h1 className="font-geist text-5xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-6xl md:text-7xl">
            Empower Your Future
          </h1>
          <p className="font-geist mx-auto mt-6 max-w-2xl text-xl font-medium leading-relaxed text-notion-text-light/80 dark:text-notion-text-dark/80 sm:text-2xl">
            Join a community of women supporting each other through education,
            mentorship, and networking opportunities.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => signIn()}
              className="font-geist shadow-notion hover:shadow-notion-hover group flex w-full items-center justify-center gap-2 rounded-lg bg-notion-pink px-8 py-3 font-medium text-notion-text-dark transition-all hover:bg-notion-pink-dark sm:w-auto"
            >
              <LogIn size={18} />
              <span>Get Started</span>
            </button>
            <a
              href="#featured-courses"
              className="font-geist group flex w-full items-center justify-center gap-2 rounded-lg border border-notion-text-light/10 bg-transparent px-8 py-3 font-medium text-notion-text-light transition-all hover:border-notion-pink/30 hover:bg-notion-pink/5 dark:border-notion-text-dark/10 dark:text-notion-text-dark dark:hover:border-notion-pink/30 sm:w-auto"
            >
              <BookOpen size={18} />
              <span>Browse Courses</span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </div>

          {/* Decorative Elements */}
          <div className="mt-16 flex items-center justify-center gap-8">
            <Circle
              size={8}
              className="fill-notion-pink/20 text-notion-pink/20"
            />
            <Circle
              size={6}
              className="fill-notion-pink/30 text-notion-pink/30"
            />
            <Circle
              size={8}
              className="fill-notion-pink/20 text-notion-pink/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
