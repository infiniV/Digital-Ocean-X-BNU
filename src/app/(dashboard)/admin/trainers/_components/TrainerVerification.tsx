"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface TrainerVerificationProps {
  trainerId: string;
  currentStatus?: string | null;
}

export function TrainerVerification({
  trainerId,
  currentStatus,
}: TrainerVerificationProps) {
  const [status, setStatus] = useState(currentStatus ?? "pending");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/admin/trainers/${trainerId}/verification`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating verification status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="animate-fade-in rounded-lg bg-notion-background p-notion-md shadow-notion transition-all hover:shadow-notion-hover dark:bg-notion-background-dark">
      <div className="flex flex-col gap-notion-md">
        {/* Status Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-notion-xs">
            <h3 className="font-geist text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
              Verification Status
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide ${
                status === "approved"
                  ? "bg-green-100/90 text-green-700 ring-1 ring-green-500/20 dark:bg-green-900/30 dark:text-green-200 dark:ring-green-400/20"
                  : status === "rejected"
                    ? "bg-red-100/90 text-red-700 ring-1 ring-red-500/20 dark:bg-red-900/30 dark:text-red-200 dark:ring-red-400/20"
                    : "bg-yellow-100/90 text-yellow-700 ring-1 ring-yellow-500/20 dark:bg-yellow-900/30 dark:text-yellow-200 dark:ring-yellow-400/20"
              } animate-fade-in`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-notion-xs">
          <button
            onClick={() => handleStatusChange("approved")}
            disabled={isUpdating || status === "approved"}
            className={`group relative inline-flex items-center gap-2 rounded-lg px-notion-md py-notion-xs text-sm font-medium shadow-notion-xs transition-all duration-200 ease-out ${
              status === "approved"
                ? "bg-green-100/90 text-green-700 ring-1 ring-green-500/20 dark:bg-green-900/30 dark:text-green-200 dark:ring-green-400/20"
                : "bg-notion-background hover:bg-green-50 hover:text-green-600 hover:ring-1 hover:ring-green-500/30 dark:bg-notion-gray-dark dark:hover:bg-green-900/20 dark:hover:text-green-200"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <CheckCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            Approve
          </button>

          <button
            onClick={() => handleStatusChange("rejected")}
            disabled={isUpdating || status === "rejected"}
            className={`group relative inline-flex items-center gap-2 rounded-lg px-notion-md py-notion-xs text-sm font-medium shadow-notion-xs transition-all duration-200 ease-out ${
              status === "rejected"
                ? "bg-red-100/90 text-red-700 ring-1 ring-red-500/20 dark:bg-red-900/30 dark:text-red-200 dark:ring-red-400/20"
                : "bg-notion-background hover:bg-red-50 hover:text-red-600 hover:ring-1 hover:ring-red-500/30 dark:bg-notion-gray-dark dark:hover:bg-red-900/20 dark:hover:text-red-200"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <XCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            Reject
          </button>

          <button
            onClick={() => handleStatusChange("pending")}
            disabled={isUpdating || status === "pending"}
            className={`group relative inline-flex items-center gap-2 rounded-lg px-notion-md py-notion-xs text-sm font-medium shadow-notion-xs transition-all duration-200 ease-out ${
              status === "pending"
                ? "bg-yellow-100/90 text-yellow-700 ring-1 ring-yellow-500/20 dark:bg-yellow-900/30 dark:text-yellow-200 dark:ring-yellow-400/20"
                : "bg-notion-background hover:bg-yellow-50 hover:text-yellow-600 hover:ring-1 hover:ring-yellow-500/30 dark:bg-notion-gray-dark dark:hover:bg-yellow-900/20 dark:hover:text-yellow-200"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <Clock className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            Pending
          </button>
        </div>
      </div>
    </div>
  );
}
