"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "~/lib/utils/slugify";

interface CourseFormProps {
  trainerId: string;
}

interface CourseResponse {
  id: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  skillLevel?: string;
  price?: number;
  trainerId?: string;
  [key: string]: string | number | undefined; // More specific type for additional properties
}

export function CourseForm({ trainerId }: CourseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    skillLevel: "beginner",
    price: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const slug = slugify(formData.title);

      const response = await fetch("/api/trainer/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          slug,
          trainerId,
        }),
      });

      const course = (await response.json()) as CourseResponse;

      // Redirect to the course details page
      router.push(`/trainer/courses/${course.id}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create course";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-12">
      <div className="mb-4">
        <label
          htmlFor="title"
          className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
        >
          Course Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-notion-gray-light/30 bg-notion-background px-3 py-2 font-geist text-notion-text-light focus:border-notion-pink focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
          placeholder="Enter course title"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="shortDescription"
          className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
        >
          Short Description *
        </label>
        <input
          id="shortDescription"
          name="shortDescription"
          type="text"
          value={formData.shortDescription}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-notion-gray-light/30 bg-notion-background px-3 py-2 font-geist text-notion-text-light focus:border-notion-pink focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
          placeholder="Enter a brief description"
          maxLength={150}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
        >
          Full Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className="w-full rounded-md border border-notion-gray-light/30 bg-notion-background px-3 py-2 font-geist text-notion-text-light focus:border-notion-pink focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
          placeholder="Enter detailed course description"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="skillLevel"
            className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
          >
            Skill Level
          </label>
          <select
            id="skillLevel"
            name="skillLevel"
            value={formData.skillLevel}
            onChange={handleChange}
            className="w-full rounded-md border border-notion-gray-light/30 bg-notion-background px-3 py-2 font-geist text-notion-text-light focus:border-notion-pink focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="price"
            className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
          >
            Price (₹)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-md border border-notion-gray-light/30 bg-notion-background px-3 py-2 font-geist text-notion-text-light focus:border-notion-pink focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
            placeholder="0"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-notion-pink px-4 py-2 font-geist text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating..." : "Create Course"}
      </button>
    </form>
  );
}
