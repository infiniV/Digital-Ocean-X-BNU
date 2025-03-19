"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

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
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.21, 1.02, 0.73, 0.97],
      }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={isInView ? { scale: 1 } : { scale: 0.5 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1 + 0.2,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="text-4xl font-bold text-notion-pink sm:text-5xl"
      >
        {count.toLocaleString()}
        {suffix}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1 + 0.3,
        }}
        className="mt-2 text-notion-text-light/70 dark:text-notion-text-dark/70"
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
    { value: 5000, label: "Women Trained", suffix: "+" },
    { value: 100, label: "Expert Trainers", suffix: "+" },
    { value: 250, label: "Courses Available" },
    { value: 95, label: "Success Rate", suffix: "%" },
  ];

  return (
    <section className="relative border-y border-notion-gray-light bg-gradient-to-r from-notion-pink/5 to-notion-accent/5 py-16 dark:border-notion-gray-dark">
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        ref={containerRef}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold">Our Impact</h2>
          <p className="mt-2 text-notion-text-light/70 dark:text-notion-text-dark/70">
            Making a difference in women&apos;s lives through education
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((stat, index) => (
            <AnimatedStat key={stat.label} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
