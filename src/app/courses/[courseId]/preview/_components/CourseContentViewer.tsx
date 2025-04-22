"use client";

import { useState, useEffect } from "react";
import { Download, AlertCircle } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  originalFilename: string;
  order: number;
}

interface CourseContentViewerProps {
  slide: Slide;
}

export function CourseContentViewer({ slide }: CourseContentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0); // Added to force iframe refresh when slide changes

  // Function to determine appropriate viewer URL based on file type
  const getViewerUrl = (slide: Slide): string => {
    const encodedFileUrl = encodeURIComponent(slide.fileUrl);

    // For PowerPoint files
    if (
      slide.fileType.includes("powerpoint") ||
      slide.fileType.includes("presentation") ||
      slide.originalFilename.toLowerCase().endsWith(".pptx") ||
      slide.originalFilename.toLowerCase().endsWith(".ppt")
    ) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedFileUrl}`;
    }

    // For PDF files - use Google Docs Viewer instead of direct URL
    if (
      slide.fileType.includes("pdf") ||
      slide.originalFilename.toLowerCase().endsWith(".pdf")
    ) {
      // Option 1: Google Docs Viewer
      return `https://docs.google.com/viewer?url=${encodedFileUrl}&embedded=true`;

      // Option 2: PDF.js (if implemented)
      // return `/pdfjs/web/viewer.html?file=${encodedFileUrl}`;
    }

    // For other documents, return the direct URL
    return slide.fileUrl;
  };

  // When the slide changes, reset loading state and iframe key
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setIframeKey((prevKey) => prevKey + 1);
  }, [slide.id]);

  // Handle iframe load error with a fallback approach
  const handleIframeError = () => {
    setIsLoading(false);

    // Try alternative viewers based on file type
    if (
      slide.fileType.includes("powerpoint") ||
      slide.fileType.includes("presentation") ||
      slide.originalFilename.toLowerCase().endsWith(".pptx") ||
      slide.originalFilename.toLowerCase().endsWith(".ppt")
    ) {
      const encodedFileUrl = encodeURIComponent(slide.fileUrl);
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodedFileUrl}&embedded=true`;

      const iframe = document.getElementById(
        "content-iframe",
      ) as HTMLIFrameElement;
      if (iframe) {
        iframe.src = googleDocsUrl;
        return;
      }
    }

    // For PDF files - try alternative viewer if first one fails
    if (
      slide.fileType.includes("pdf") ||
      slide.originalFilename.toLowerCase().endsWith(".pdf")
    ) {
      const iframe = document.getElementById(
        "content-iframe",
      ) as HTMLIFrameElement;
      if (iframe) {
        // If we're using Google Docs Viewer and it fails, switch to direct URL with object tag
        if (iframe.src.includes("docs.google.com")) {
          // Create an object element to replace the iframe
          const parentDiv = iframe.parentElement;
          if (parentDiv) {
            const objectElem = document.createElement("object");
            objectElem.setAttribute("data", slide.fileUrl);
            objectElem.setAttribute("type", "application/pdf");
            objectElem.setAttribute("width", "100%");
            objectElem.setAttribute("height", "100%");

            const fallbackLink = document.createElement("a");
            fallbackLink.setAttribute("href", slide.fileUrl);
            fallbackLink.setAttribute("target", "_blank");
            fallbackLink.setAttribute("rel", "noopener noreferrer");
            fallbackLink.textContent = "Click to view PDF";

            objectElem.appendChild(fallbackLink);

            // Replace iframe with object
            parentDiv.innerHTML = "";
            parentDiv.appendChild(objectElem);
            setIsLoading(false);
            return;
          }
        }
      }
    }

    setError("Failed to load document. Please download the file to view it.");
  };

  return (
    <div className="overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white shadow-sm transition-all dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/40">
      {/* Content Header */}
      <div className="border-b border-notion-gray-light/20 bg-notion-gray-light/5 p-4 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/60 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h3 className="font-geist text-base font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-lg">
              {slide.title}
            </h3>
            {slide.description && (
              <p className="text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                {slide.description}
              </p>
            )}
          </div>

          <a
            href={slide.fileUrl}
            download={slide.originalFilename}
            className="inline-flex items-center gap-1.5 rounded-lg bg-notion-accent/10 px-3 py-2 text-sm font-medium text-notion-accent transition-all hover:bg-notion-accent hover:text-white"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      {/* Content Display - Adjusted height */}
      <div className="relative h-[calc(100vh-20rem)] min-h-[400px] w-full sm:h-[calc(100vh-16rem)] md:h-[calc(100vh-14rem)]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-notion-gray-light/5 dark:bg-notion-gray-dark/20">
            <div className="flex animate-scale-in flex-col items-center space-y-notion-md">
              <div className="h-12 w-12 animate-pulse-slow rounded-full border-4 border-notion-accent-light/30 border-t-notion-accent"></div>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Loading content...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-notion-xl">
            <div className="max-w-md animate-scale-in rounded-lg bg-red-50/80 p-notion-lg shadow-notion-xs backdrop-blur-sm dark:bg-red-900/20">
              <div className="mx-auto mb-notion-md flex h-14 w-14 items-center justify-center rounded-full bg-red-100/80 dark:bg-red-800/30">
                <AlertCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="mb-notion-sm font-geist text-lg font-semibold tracking-tight text-red-800 dark:text-red-300">
                Unable to Display Content
              </h3>
              <p className="mb-notion-lg font-geist text-sm text-red-600/90 dark:text-red-400/90">
                {error}
              </p>
              <p className="mb-4 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70">
                This usually happens if the file is not publicly accessible or your storage does not have CORS enabled. Please contact your course administrator if this persists.
              </p>
              <a
                href={slide.fileUrl}
                download={slide.originalFilename}
                className="group inline-flex items-center gap-2 rounded-md bg-notion-accent px-notion-md py-notion-sm font-geist text-base font-semibold text-white shadow-notion-xs transition-all hover:bg-notion-accent-dark hover:shadow-notion"
              >
                <Download
                  size={20}
                  className="transition-transform group-hover:-translate-y-0.5"
                />
                <span>Download File</span>
              </a>
            </div>
          </div>
        )}

        {slide.fileType.startsWith("image/") ? (
          <div className="flex h-full w-full animate-fade-in items-center justify-center bg-[url('/grid.svg')] p-notion-xl dark:bg-notion-gray-dark/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.fileUrl}
              alt={slide.title}
              className="max-h-full max-w-full rounded-lg object-contain shadow-notion transition-all hover:shadow-notion-hover"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setError("Failed to load image");
              }}
            />
          </div>
        ) : (
          <div className="h-full w-full" id="content-container">
            <iframe
              id="content-iframe"
              key={`iframe-${slide.id}-${iframeKey}`}
              src={getViewerUrl(slide)}
              className="h-full w-full border-0"
              title={slide.title}
              onLoad={() => setIsLoading(false)}
              onError={handleIframeError}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-presentation"
            />
          </div>
        )}
      </div>
    </div>
  );
}
