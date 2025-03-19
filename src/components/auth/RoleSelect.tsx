import React, { useState } from "react";
import { type UserRole } from "~/server/auth/role-utils";

interface RoleSelectProps {
  onRoleSelect: (role: UserRole) => void;
  defaultRole?: UserRole;
}

export function RoleSelect({
  onRoleSelect,
  defaultRole = "trainee",
}: RoleSelectProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    onRoleSelect(role);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="text-lg font-medium">Select your role:</div>
      <div className="flex flex-col space-y-2">
        <RoleOption
          role="trainee"
          label="Trainee"
          description="Access courses and educational content"
          isSelected={selectedRole === "trainee"}
          onSelect={() => handleRoleChange("trainee")}
        />
        <RoleOption
          role="trainer"
          label="Trainer"
          description="Create and upload courses"
          isSelected={selectedRole === "trainer"}
          onSelect={() => handleRoleChange("trainer")}
        />
        <RoleOption
          role="admin"
          label="Administrator"
          description="Platform management with full access rights"
          isSelected={selectedRole === "admin"}
          onSelect={() => handleRoleChange("admin")}
        />
      </div>
    </div>
  );
}

interface RoleOptionProps {
  role: UserRole;
  label: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

function RoleOption({
  label,
  description,
  isSelected,
  onSelect,
}: RoleOptionProps) {
  return (
    <div
      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-muted-foreground text-sm">{description}</div>
        </div>
        <div
          className={`h-5 w-5 rounded-full border ${
            isSelected ? "bg-primary" : "bg-background"
          }`}
        >
          {isSelected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="stroke-background h-5 w-5 stroke-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
