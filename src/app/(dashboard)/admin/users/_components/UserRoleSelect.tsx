"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { type UserRole } from "~/server/auth/role-utils";

interface UserRoleSelectProps {
  userId: string;
  currentRole?: string | null;
}

export function UserRoleSelect({ userId, currentRole }: UserRoleSelectProps) {
  const [role, setRole] = useState<UserRole>(
    (currentRole as UserRole) ?? "trainee",
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === role) return;
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      setRole(newRole);
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value as UserRole)}
        disabled={isUpdating}
        className="h-9 appearance-none rounded-lg border border-notion-gray-light/20 bg-white px-3 pr-8 font-geist text-sm text-notion-text-light transition-colors focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/50 dark:text-notion-text-dark dark:focus:ring-notion-pink/5"
      >
        <option value="trainee">Trainee</option>
        <option value="trainer">Trainer</option>
        <option value="admin">Admin</option>
      </select>
      <Shield className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-notion-text-light/50 dark:text-notion-text-dark/50" />
    </div>
  );
}