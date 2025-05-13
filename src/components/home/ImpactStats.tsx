"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Circle } from "lucide-react";

interface StatProps {
  value: number;
  label: string;
  suffix?: string;
}

function AnimatedStat({
  value,
  label,
  suffix = "",
  index,
}: StatProps & { index: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
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
  }, [value, isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.21, 1.02, 0.73, 0.97],
      }}
      className="relative rounded-xl p-6 text-center transition-all duration-300 hover:bg-notion-pink/5"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={isInView ? { scale: 1 } : { scale: 0.5 }}
        transition={{
          duration: 0.6,
          delay: index * 0.15 + 0.2,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        className="relative text-5xl font-bold text-notion-pink transition-colors duration-300 dark:text-notion-pink-light sm:text-6xl"
      >
        {count.toLocaleString()}
        {suffix}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.15 + 0.3,
        }}
        className="mt-3 font-medium text-notion-text-light/80 transition-colors duration-300 dark:text-notion-text-dark/80"
      >
        {label}
      </motion.div>
    </motion.div>
  );
}

export function ImpactStats() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const stats = [
    { value: 100, label: "Women Trained", suffix: "+" },
    { value: 15, label: "Expert Trainers", suffix: "+" },
    { value: 15, label: "Courses Available" },
    { value: 95, label: "Success Rate", suffix: "%" },
  ];

  return (
    <section className="relative overflow-hidden border-y border-notion-gray-light bg-gradient-to-r from-notion-pink/5 via-transparent to-notion-accent/5 py-20 dark:border-notion-gray-dark">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="h-full w-full animate-pulse-slow"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="stat-pattern"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" className="fill-notion-pink/10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stat-pattern)" />
        </svg>
      </div>

      <div className="absolute -left-16 -top-16 h-64 w-64 animate-float">
        <div className="absolute h-full w-full rounded-full border-[30px] border-notion-pink/5"></div>
      </div>

      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        ref={containerRef}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center"
        >
          <h2 className="font-geist text-4xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-5xl">
            Our Impact
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
            Making a difference in women&apos;s lives through education
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <AnimatedStat key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* Bottom Decorative Elements */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <Circle
            size={6}
            className="fill-notion-pink/10 text-notion-pink/10"
          />
          <Circle
            size={4}
            className="fill-notion-pink/20 text-notion-pink/20"
          />
          <Circle
            size={6}
            className="fill-notion-pink/10 text-notion-pink/10"
          />
        </div>
      </div>
    </section>
  );
}
