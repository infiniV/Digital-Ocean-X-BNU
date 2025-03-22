"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteUserButtonProps {
  userId: string;
  userName: string;
}

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Refresh the page to show updated user list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
      title="Delete user"
    >
      <Trash2 size={16} />
    </button>
  );
}