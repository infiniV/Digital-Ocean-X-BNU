"use client";

import { useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  courseName: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ayesha Khan",
    role: "Frontend Developer",
    quote:
      "The mentorship and guidance I received helped me transition into tech. I'm now working as a frontend developer at a leading company in Karachi!",
    courseName: "Web Development Bootcamp",
  },
  {
    id: 2,
    name: "Fatima Malik",
    role: "Data Scientist",
    quote:
      "The data science course was exactly what I needed to advance my career in Pakistan's growing tech sector. The hands-on projects were especially valuable.",
    courseName: "Data Science Fundamentals",
  },
  {
    id: 3,
    name: "Zainab Ahmed",
    role: "Product Manager",
    quote:
      "The product management course gave me the confidence to lead tech teams in Lahore. The community support was incredible throughout my journey.",
    courseName: "Product Management Essentials",
  },
  {
    id: 4,
    name: "Hira Raza",
    role: "UX Designer",
    quote:
      "As a woman in tech from Islamabad, this program opened doors I never thought possible. The skills I learned helped me land my dream design role.",
    courseName: "UX/UI Design Fundamentals",
  },
  {
    id: 5,
    name: "Sana Mahmood",
    role: "Blockchain Developer",
    quote:
      "Coming from Peshawar, I never thought I'd be working in blockchain. This program made it possible and helped me overcome the barriers to tech.",
    courseName: "Blockchain Development",
  },
];

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1,
    );
  };

  const prevSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1,
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <section className="bg-notion-gray-light py-16 dark:bg-notion-gray-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Success Stories</h2>
          <p className="mt-2 text-notion-text-light/70 dark:text-notion-text-dark/70">
            Hear from our community members
          </p>
        </div>

        <div className="relative mt-12">
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-xl bg-white p-8 dark:bg-notion-dark">
            <div
              className="transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
              }}
            >
              <div className="flex">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 space-y-4 px-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-notion-pink text-white">
                        {getInitials(testimonial.name)}
                      </div>
                      <div>
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                    <blockquote className="text-lg italic">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                    <div className="text-sm text-notion-pink">
                      {testimonial.courseName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-lg bg-notion-pink p-2 text-notion-text-light transition-colors hover:bg-notion-pink-dark"
            aria-label="Previous testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l-lg bg-notion-pink p-2 text-notion-text-light transition-colors hover:bg-notion-pink-dark"
            aria-label="Next testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          <div className="mt-4 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeIndex ? "bg-notion-pink" : "bg-notion-pink/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
