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
    <div className="overflow-hidden rounded-lg border border-notion-gray-light/20 bg-white shadow-sm transition-all hover:shadow-md dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
      {/* Content header - improved spacing and alignment */}
      <div className="flex items-center justify-between border-b border-notion-gray-light/20 bg-notion-gray-light/5 px-6 py-4 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/80">
        <div className="flex-1 pr-4">
          <h3 className="font-geist text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
            {slide.title}
          </h3>
          {slide.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-notion-text-light/70 dark:text-notion-text-dark/70">
              {slide.description}
            </p>
          )}
        </div>

        <a
          href={slide.fileUrl}
          download={slide.originalFilename}
          className="hover:bg-notion-blue dark:hover:bg-notion-blue flex shrink-0 items-center gap-2 rounded-md bg-notion-gray-light/10 px-4 py-2 font-geist text-sm font-medium text-notion-text-light/80 transition-colors hover:text-white dark:bg-notion-gray-dark/30 dark:text-notion-text-dark/80 dark:hover:text-white"
        >
          <Download size={16} />
          <span>Download</span>
        </a>
      </div>

      {/* Content display with better loading state */}
      <div className="h-[70vh] bg-white dark:bg-notion-gray-dark/30">
        {isLoading && (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-notion-gray-light/30 border-t-notion-pink"></div>
              <p className="font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
                Loading content...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex h-full w-full items-center justify-center p-6">
            <div className="max-w-md rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/20">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-800/30">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="mb-2 font-geist text-lg font-medium text-red-800 dark:text-red-300">
                Unable to Display Content
              </h3>
              <p className="mb-4 font-geist text-red-600 dark:text-red-400">
                {error}
              </p>
              <a
                href={slide.fileUrl}
                download={slide.originalFilename}
                className="bg-notion-blue hover:bg-notion-blue-dark inline-flex items-center gap-2 rounded-md px-4 py-2 font-geist text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
              >
                <Download size={16} />
                <span>Download File Instead</span>
              </a>
            </div>
          </div>
        )}

        {slide.fileType.startsWith("image/") ? (
          // For images - improved container
          <div className="flex h-full w-full items-center justify-center bg-notion-gray-light/5 p-6 dark:bg-notion-gray-dark/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.fileUrl}
              alt={slide.title}
              className="max-h-full max-w-full rounded-md object-contain shadow-sm"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setError("Failed to load image");
              }}
            />
          </div>
        ) : (
          // For documents (PDF, PowerPoint, etc.)
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
