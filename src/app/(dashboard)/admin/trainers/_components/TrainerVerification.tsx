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
      const response = await fetch(`/api/admin/trainers/${trainerId}/verification`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

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
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleStatusChange("approved")}
        disabled={isUpdating || status === "approved"}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
          status === "approved"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : "border border-notion-gray-light/20 bg-white text-notion-text-light hover:border-green-500/50 hover:bg-green-50 hover:text-green-700 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 dark:text-notion-text-dark dark:hover:border-green-500/30 dark:hover:bg-green-900/20 dark:hover:text-green-400"
        }`}
      >
        <CheckCircle size={16} />
        Approve
      </button>

      <button
        onClick={() => handleStatusChange("rejected")}
        disabled={isUpdating || status === "rejected"}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
          status === "rejected"
            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            : "border border-notion-gray-light/20 bg-white text-notion-text-light hover:border-red-500/50 hover:bg-red-50 hover:text-red-700 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 dark:text-notion-text-dark dark:hover:border-red-500/30 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        }`}
      >
        <XCircle size={16} />
        Reject
      </button>

      <button
        onClick={() => handleStatusChange("pending")}
        disabled={isUpdating || status === "pending"}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
          status === "pending"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            : "border border-notion-gray-light/20 bg-white text-notion-text-light hover:border-yellow-500/50 hover:bg-yellow-50 hover:text-yellow-700 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 dark:text-notion-text-dark dark:hover:border-yellow-500/30 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-400"
        }`}
      >
        <Clock size={16} />
        Pending
      </button>
    </div>
  );
}