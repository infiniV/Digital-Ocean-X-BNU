"use client";

import { useEffect, useState } from "react";

interface StatProps {
  value: number;
  label: string;
  suffix?: string;
}

function AnimatedStat({ value, label, suffix = "" }: StatProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000; // Animation duration in milliseconds
    const steps = 60; // Number of steps in the animation
    const stepTime = duration / steps;
    const increment = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep += 1;
      setCount(Math.min(Math.round(increment * currentStep), value));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-notion-pink sm:text-5xl">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-2 text-notion-text-light/70 dark:text-notion-text-dark/70">
        {label}
      </div>
    </div>
  );
}

export function ImpactStats() {
  return (
    <section className="border-y border-notion-gray-light bg-gradient-to-r from-notion-pink/5 to-notion-accent/5 py-16 dark:border-notion-gray-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Our Impact</h2>
          <p className="mt-2 text-notion-text-light/70 dark:text-notion-text-dark/70">
            Making a difference in women&apos;s lives through education
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          <AnimatedStat value={5000} label="Women Trained" suffix="+" />
          <AnimatedStat value={100} label="Expert Trainers" suffix="+" />
          <AnimatedStat value={250} label="Courses Available" />
          <AnimatedStat value={95} label="Success Rate" suffix="%" />
        </div>
      </div>
    </section>
  );
}
