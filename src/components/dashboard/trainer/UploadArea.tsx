// "use client";

import { useState, useRef } from "react";
import { Upload, X, FileType } from "lucide-react";

interface UploadAreaProps {
  courseId: string;
  onUploadComplete: () => void;
}

export function UploadArea({ courseId, onUploadComplete }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile) {
        validateAndSetFile(selectedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        validateAndSetFile(selectedFile);
      }
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/png",
    ];

    setError("");

    if (!validTypes.includes(selectedFile.type)) {
      setError(
        "Invalid file type. Only PDFs, PowerPoint files, and images are allowed.",
      );
      return;
    }

    if (selectedFile.size > 150 * 1024 * 1024) {
      // 15MB max
      setError("File size too large. Maximum size is 150MB.");
      return;
    }

    setFile(selectedFile);

    // Auto-fill title with filename if empty
    if (!title) {
      const fileName = selectedFile.name.split(".").slice(0, -1).join(".");
      setTitle(fileName);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);
      formData.append("description", description);

      const response = await fetch(`/api/trainer/courses/${courseId}/slides`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      onUploadComplete();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload slide";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8 rounded-lg border border-notion-gray-light/20 bg-notion-background p-4 shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/30 dark:bg-notion-background-dark sm:p-6">
      <h2 className="mb-5 font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
        Upload Slide Content
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div
          className={`relative mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center font-geist transition-all duration-200 sm:p-6 ${
            isDragging
              ? "border-notion-pink bg-notion-pink/5"
              : "border-notion-gray-light/30 hover:border-notion-pink/50 dark:border-notion-gray-dark/30 dark:hover:border-notion-pink/40"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="w-full">
              <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-notion-gray-dark/30">
                <div className="flex items-center overflow-hidden">
                  <FileType className="mr-3 h-6 w-6 flex-shrink-0 text-notion-pink" />
                  <div className="overflow-hidden">
                    <p className="truncate text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
                      {file.name}
                    </p>
                    <p className="text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="ml-2 flex-shrink-0 rounded-full p-1.5 text-notion-text-light/60 transition-colors hover:bg-notion-gray-light/30 hover:text-notion-text-light dark:text-notion-text-dark/60 dark:hover:bg-notion-gray-dark/50 dark:hover:text-notion-text-dark"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Upload className="mb-3 h-10 w-10 text-notion-pink/70 dark:text-notion-pink/60" />
              <p className="mb-2 text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
                Drag and drop your slides here or
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-geist text-sm font-medium text-notion-pink transition-all hover:text-notion-pink-dark hover:underline focus:outline-none focus:ring-2 focus:ring-notion-pink/30"
              >
                browse files
              </button>
              <p className="mt-3 text-xs text-notion-text-light/60 dark:text-notion-text-dark/60 sm:text-sm">
                Supported formats: PDF, PowerPoint, JPEG, PNG (up to 150MB)
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.ppt,.pptx,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-notion-gray-light/30 bg-notion-background px-3 py-2 font-geist text-sm text-notion-text-light shadow-sm transition-colors focus:border-notion-pink focus:outline-none focus:ring-1 focus:ring-notion-pink/30 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
              placeholder="Enter slide title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-notion-gray-light/30 bg-notion-background px-3 py-2 font-geist text-sm text-notion-text-light shadow-sm transition-colors focus:border-notion-pink focus:outline-none focus:ring-1 focus:ring-notion-pink/30 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
              placeholder="Add a short description about this slide"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 shadow-sm dark:bg-red-900/20">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isUploading || !file}
            className="flex w-full items-center justify-center rounded-md bg-notion-pink px-4 py-2.5 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md focus:outline-none focus:ring-2 focus:ring-notion-pink focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isUploading ? (
              <>
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              "Upload Slide"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
