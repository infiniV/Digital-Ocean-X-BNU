"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "~/lib/utils/slugify";
import Image from "next/image";
import { Book, Clock, Upload, AlertCircle, Star } from "lucide-react";

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
  trainerId?: string;
  [key: string]: string | number | undefined;
}

// Add interfaces for API responses
interface UploadResponse {
  fileUrl: string;
  error?: string;
}

interface ErrorResponse {
  error: string;
}

export function CourseForm({ trainerId }: CourseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    description: "",
    skillLevel: "beginner",
  });

  // Image upload states
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (1MB limit)
      if (file.size > 1 * 1024 * 1024) {
        setError("Image size must be less than 1MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Selected file must be an image");
        return;
      }

      setCustomImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const uploadCustomImage = async (file: File): Promise<string> => {
    // Create FormData to send the file
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "course-cover");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error(
            "File size is too large. Please choose a smaller image.",
          );
        }
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData?.error ?? "Failed to upload image");
      }

      // Fix: Use type assertion for the expected response
      const data = (await response.json()) as UploadResponse;
      return data.fileUrl;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to upload image",
      );
    }
  };

  interface ImprovedTextResponse {
    improvedText: string;
  }

  const handleImproveText = async (field: keyof typeof formData) => {
    try {
      setIsImproving(true);
      const response = await fetch("/api/improve-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: formData[field] }),
      });

      if (!response.ok) {
        throw new Error("Failed to improve text");
      }

      const data = (await response.json()) as ImprovedTextResponse;
      setFormData((prev) => ({
        ...prev,
        [field]: data.improvedText,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to improve text");
    } finally {
      setIsImproving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setUploadProgress(0);

    try {
      let coverImageUrl = "";

      // Upload image if one is selected
      if (customImage) {
        try {
          setUploadProgress(10);
          coverImageUrl = await uploadCustomImage(customImage);
          setUploadProgress(100);
        } catch (err) {
          throw new Error(
            err instanceof Error ? err.message : "Failed to upload image",
          );
        }
      }

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
          coverImageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrorResponse;
        throw new Error(errorData?.error ?? "Failed to create course");
      }

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Details Section */}
      <div className="overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
        <div className="border-b border-notion-gray-light/20 bg-notion-gray-light/5 px-6 py-4 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/80">
          <h2 className="font-geist text-xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark">
            Course Details
          </h2>
        </div>

        <div className="space-y-6 p-6">
          {/* Course Title Input with AI assistance */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
            >
              Course Title
              <span className="ml-1 text-notion-pink">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                className="flex-1 rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-3 font-geist text-base text-notion-text-light transition-all focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark dark:focus:ring-notion-pink/10"
                placeholder="Enter a descriptive title"
              />
              <button
                type="button"
                onClick={() => handleImproveText("title")}
                disabled={isImproving || !formData.title}
                className="flex items-center justify-center rounded-lg border border-notion-gray-light/30 bg-notion-background p-3 text-notion-text-light/70 transition-all hover:border-notion-pink hover:text-notion-pink disabled:cursor-not-allowed disabled:opacity-50 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark/70 dark:hover:text-notion-pink"
              >
                <Star
                  className={`h-5 w-5 ${isImproving ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Cover Image Upload Section - Enhanced */}
          <div className="rounded-xl border border-notion-gray-light/20 bg-notion-gray-light/5 p-6 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-geist text-base font-medium text-notion-text-light dark:text-notion-text-dark">
                  Course Cover Image
                </h3>
                <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Add a visual preview for your course
                </p>
              </div>
              <label
                htmlFor="courseImage"
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-notion-gray-light/20 px-4 py-2 font-geist text-sm font-medium text-notion-text-light transition-all hover:bg-notion-pink hover:text-white dark:bg-notion-gray-dark/40 dark:text-notion-text-dark dark:hover:bg-notion-pink dark:hover:text-white"
              >
                <Upload size={16} className="shrink-0" />
                <span>{imagePreview ? "Replace" : "Upload"}</span>
              </label>
              <input
                id="courseImage"
                type="file"
                accept="image/*"
                onChange={handleCustomImageSelect}
                className="hidden"
              />
            </div>

            {/* Image Preview Area */}
            <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg border border-notion-gray-light/20 bg-notion-gray-light/10 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/40">
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Course cover preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setCustomImage(null);
                    }}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-1.5 text-notion-text-light shadow-sm backdrop-blur-sm transition-all hover:bg-notion-pink hover:text-white dark:bg-notion-gray-dark/90 dark:text-notion-text-dark dark:hover:bg-notion-pink dark:hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <Upload
                    size={32}
                    className="mb-2 text-notion-text-light/30 dark:text-notion-text-dark/30"
                  />
                  <p className="font-geist text-sm text-notion-text-light/50 dark:text-notion-text-dark/50">
                    Recommended: 1200×630px
                  </p>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-4 space-y-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-notion-gray-light/20 dark:bg-notion-gray-dark/40">
                  <div
                    className="h-full bg-notion-pink transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          {/* Short Description with AI assistance */}
          <div>
            <label
              htmlFor="shortDescription"
              className="mb-2 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
            >
              Short Description *
            </label>
            <div className="flex gap-2">
              <input
                id="shortDescription"
                name="shortDescription"
                type="text"
                value={formData.shortDescription}
                onChange={handleChange}
                required
                className="flex-1 rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2.5 font-geist text-notion-text-light transition-colors focus:border-notion-pink focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
                placeholder="Enter a brief description"
                maxLength={150}
              />
              <button
                type="button"
                onClick={() => handleImproveText("shortDescription")}
                disabled={isImproving || !formData.shortDescription}
                className="flex items-center justify-center rounded-lg border border-notion-gray-light/30 bg-notion-background p-2.5 text-notion-text-light/70 transition-all hover:border-notion-pink hover:text-notion-pink disabled:cursor-not-allowed disabled:opacity-50 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark/70 dark:hover:text-notion-pink"
              >
                <Star
                  className={`h-5 w-5 ${isImproving ? "animate-spin" : ""}`}
                />
              </button>
            </div>
            <p className="mt-1 text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              A short summary that appears in course listings (max 150
              characters)
            </p>
          </div>

          {/* Full Description with AI assistance */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
            >
              Full Description
            </label>
            <div className="flex gap-2">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="flex-1 rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2.5 font-geist text-notion-text-light transition-colors focus:border-notion-pink focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
                placeholder="Enter detailed course description"
              />
              <button
                type="button"
                onClick={() => handleImproveText("description")}
                disabled={isImproving || !formData.description}
                className="flex items-center justify-center self-start rounded-lg border border-notion-gray-light/30 bg-notion-background p-2.5 text-notion-text-light/70 transition-all hover:border-notion-pink hover:text-notion-pink disabled:cursor-not-allowed disabled:opacity-50 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark/70 dark:hover:text-notion-pink"
              >
                <Star
                  className={`h-5 w-5 ${isImproving ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Skill Level */}
          <div>
            <label
              htmlFor="skillLevel"
              className="mb-2 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
            >
              Skill Level
            </label>
            <div className="relative">
              <select
                id="skillLevel"
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleChange}
                className="w-full appearance-none rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2.5 font-geist text-notion-text-light transition-colors focus:border-notion-pink focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <svg
                  className="h-4 w-4 text-notion-text-light/50 dark:text-notion-text-dark/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-notion-gray-light/10 px-3 py-2 font-geist text-sm font-medium text-notion-text-light/80 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/80">
                <Clock size={16} className="text-notion-pink" />
                <span className="capitalize">{formData.skillLevel}</span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="shrink-0 text-red-600 dark:text-red-400"
                />
                <p className="font-geist text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg bg-notion-gray-light/10 px-5 py-2.5 font-geist text-sm font-medium text-notion-text-light transition-all hover:bg-notion-gray-light/20 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark dark:hover:bg-notion-gray-dark/30"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-notion-pink px-5 py-2.5 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-notion-pink disabled:hover:shadow-none"
        >
          {isSubmitting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Book size={16} className="shrink-0" />
              <span>Create Course</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
