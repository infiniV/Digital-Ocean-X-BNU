"use client";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { CreateTrainerModal } from "./CreateTrainerModal";

export function CreateTrainerButtonWithModal() {
  const [showModal, setShowModal] = useState(false);
  // Optionally, you can add a callback to refresh trainers list on success
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="group flex items-center justify-between rounded-lg border border-notion-gray-light/20 bg-white p-4 shadow-notion-xs transition-all hover:border-notion-pink hover:shadow-notion dark:border-notion-gray-dark/40 dark:bg-notion-gray-dark/60 dark:hover:border-notion-pink/70 sm:p-5 md:p-6"
      >
        <div className="text-left">
          <h3 className="font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark sm:text-base">
            Add Trainer
          </h3>
          <p className="mt-1 font-geist text-xs text-notion-text-light/70 dark:text-notion-text-dark/70 sm:text-sm">
            Create a new trainer account
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-notion-gray-light/10 group-hover:bg-notion-pink/10 dark:bg-notion-gray-dark/40">
          <UserPlus className="h-4 w-4 text-notion-text-light/50 transition-colors group-hover:text-notion-pink dark:text-notion-text-dark/50 dark:group-hover:text-notion-pink-light sm:h-5 sm:w-5" />
        </div>
      </button>
      <CreateTrainerModal
        isOpen={showModal}
        onCloseAction={() => setShowModal(false)}
        onSuccessAction={() => {
          console.log("Trainer created successfully");
        }}
      />
    </>
  );
}
