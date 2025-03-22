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
    <div className="bg-notion-background-light overflow-hidden rounded-lg border border-notion-gray-light/20 shadow-notion transition-all duration-300 hover:shadow-notion-hover dark:border-notion-gray-dark/20 dark:bg-notion-background-dark">
      {/* Content header with refined styling */}
      <div className="animate-slide-down border-b border-notion-gray-light/20 bg-gradient-to-r from-notion-gray-light/10 to-transparent px-notion-lg py-notion-md dark:border-notion-gray-dark/20 dark:from-notion-gray-dark/40 dark:to-notion-gray-dark/20">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-notion-xs pr-notion-lg">
            <h3 className="font-geist text-lg font-semibold tracking-tight text-notion-text-light transition-colors dark:text-notion-text-dark">
              {slide.title}
            </h3>
            {slide.description && (
              <p className="font-geist text-sm leading-relaxed text-notion-text-light/70 transition-colors dark:text-notion-text-dark/70">
                {slide.description}
              </p>
            )}
          </div>

          <a
            href={slide.fileUrl}
            download={slide.originalFilename}
            className="bg-notion-accent-light/10 text-notion-accent-dark hover:bg-notion-accent-light dark:bg-notion-accent-dark/20 dark:text-notion-accent-light dark:hover:bg-notion-accent-dark group flex shrink-0 items-center gap-2 rounded-md px-notion-md py-notion-sm font-geist text-sm font-medium transition-all hover:text-white"
          >
            <Download
              size={16}
              className="transition-transform group-hover:-translate-y-0.5"
            />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Content display with enhanced visuals */}
      <div className="bg-notion-background-light h-[70vh] transition-colors dark:bg-notion-background-dark">
        {isLoading && (
          <div className="flex h-full w-full items-center justify-center bg-notion-gray-light/5 dark:bg-notion-gray-dark/20">
            <div className="flex animate-scale-in flex-col items-center space-y-notion-md">
              <div className="border-notion-accent-light/30 h-12 w-12 animate-pulse-slow rounded-full border-4 border-t-notion-accent"></div>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Loading content...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex h-full w-full items-center justify-center p-notion-xl">
            <div className="shadow-notion-xs max-w-md animate-scale-in rounded-lg bg-red-50/80 p-notion-lg backdrop-blur-sm dark:bg-red-900/20">
              <div className="mx-auto mb-notion-md flex h-14 w-14 items-center justify-center rounded-full bg-red-100/80 dark:bg-red-800/30">
                <AlertCircle className="h-7 w-7 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="mb-notion-sm font-geist text-lg font-semibold tracking-tight text-red-800 dark:text-red-300">
                Unable to Display Content
              </h3>
              <p className="mb-notion-lg font-geist text-sm text-red-600/90 dark:text-red-400/90">
                {error}
              </p>
              <a
                href={slide.fileUrl}
                download={slide.originalFilename}
                className="shadow-notion-xs hover:bg-notion-accent-dark group inline-flex items-center gap-2 rounded-md bg-notion-accent px-notion-md py-notion-sm font-geist text-sm font-medium text-white transition-all hover:shadow-notion"
              >
                <Download
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5"
                />
                <span>Download File Instead</span>
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
          <div className="h-full w-full animate-fade-in" id="content-container">
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
