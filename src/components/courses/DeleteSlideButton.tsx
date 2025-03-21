import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteSlideButtonProps {
  slideId: string;
  slideTitle: string;
  onDelete: () => void;
}

export function DeleteSlideButton({
  slideId,
  slideTitle,
  onDelete,
}: DeleteSlideButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${slideTitle}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/trainer/slides/${slideId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete slide");
      }

      onDelete();
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Failed to delete slide");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
      title="Delete slide"
    >
      <Trash2 size={16} className={isDeleting ? "animate-pulse" : ""} />
    </button>
  );
}
