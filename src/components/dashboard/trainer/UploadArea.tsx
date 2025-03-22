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
    <div className="mb-8 rounded-lg border border-notion-gray-light/20 bg-notion-background p-6 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark">
      <h2 className="mb-4 font-geist text-xl font-medium text-notion-text-light dark:text-notion-text-dark">
        Upload Slide Content
      </h2>

      <form onSubmit={handleSubmit}>
        <div
          className={`mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center font-geist transition-all ${
            isDragging
              ? "border-notion-pink bg-notion-pink/5"
              : "border-notion-gray-light/30 dark:border-notion-gray-dark/30"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="w-full">
              <div className="flex items-center justify-between rounded-lg bg-notion-gray-light/10 p-3 dark:bg-notion-gray-dark/20">
                <div className="flex items-center">
                  <FileType className="mr-2 h-6 w-6 text-notion-pink" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="rounded-full p-1 hover:bg-notion-gray-light/20 dark:hover:bg-notion-gray-dark/40"
                >
                  <X className="h-5 w-5 text-notion-text-light/70 dark:text-notion-text-dark/70" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <Upload className="mb-2 h-10 w-10 text-notion-text-light/50 dark:text-notion-text-dark/50" />
              <p className="mb-1 text-sm font-medium">
                Drag and drop your slides here or
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="font-geist text-sm font-medium text-notion-pink hover:underline"
              >
                browse files
              </button>
              <p className="mt-2 text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
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

        <div className="mb-4">
          <label
            htmlFor="title"
            className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-notion-gray-light/30 bg-notion-background px-3 py-2 font-geist text-sm text-notion-text-light focus:border-notion-pink focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
            placeholder="Enter slide title"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-notion-gray-light/30 bg-notion-background px-3 py-2 font-geist text-sm text-notion-text-light focus:border-notion-pink focus:outline-none dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
            placeholder="Add a short description about this slide"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading || !file}
          className="flex items-center justify-center rounded-md bg-notion-pink px-4 py-2 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
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
      </form>
    </div>
  );
}
