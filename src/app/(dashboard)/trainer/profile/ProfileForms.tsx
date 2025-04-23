"use client";

import { useState, useRef } from "react";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";

interface TrainerProfile {
  name: string | null;
  email: string | null;
  bio: string | null;
  image: string | null;
}

export function TrainerProfileForm({ trainer }: { trainer: TrainerProfile }) {
  const [form, setForm] = useState({
    name: trainer.name ?? "",
    email: trainer.email ?? "",
    bio: trainer.bio ?? "",
    image: trainer.image ?? "",
  });
  const [imagePreview, setImagePreview] = useState(trainer.image ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    // Upload image to server
    const data = new FormData();
    data.append("file", file);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      if (!res.ok) throw new Error("Failed to upload image");
      const { url } = (await res.json()) as { url: string };
      setForm((prev) => ({ ...prev, image: url }));
    } catch {
      setError("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/trainer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setSuccess("Profile updated successfully");
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mx-auto max-w-xl space-y-notion-xl rounded-xl border border-notion-gray-light/20 bg-white p-notion-xl shadow-notion transition-all dark:border-notion-gray-dark/20 dark:bg-notion-background-dark"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-notion-pink/30 bg-notion-gray-light/10 shadow-notion-xs dark:border-notion-pink/40 dark:bg-notion-gray-dark/30">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Profile"
              width={96}
              height={96}
              className="h-24 w-24 object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-notion-accent/30 to-notion-pink/20 font-geist text-3xl font-bold text-white/80">
              {form.name ? form.name[0] : "T"}
            </div>
          )}
          <button
            type="button"
            className="absolute bottom-1 right-1 flex items-center gap-1 rounded-full bg-notion-pink px-2 py-1 font-geist text-xs font-medium text-white shadow-notion-xs transition-all hover:bg-notion-pink-dark focus:outline-none focus:ring-2 focus:ring-notion-pink/30 disabled:opacity-60"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload size={14} className="mr-1" />
            Change
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>
        <div className="flex-1 space-y-4">
          <label className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
            Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2 font-geist text-base text-notion-text-light focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
            disabled={loading}
            autoComplete="off"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
          Email
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2 font-geist text-base text-notion-text-light focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
          disabled={loading}
          autoComplete="off"
        />
      </div>
      <div>
        <label className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
          Bio
        </label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2 font-geist text-base text-notion-text-light focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
          rows={3}
          disabled={loading}
        />
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-notion-pink px-5 py-2.5 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </span>
          ) : (
            <>
              <CheckCircle size={16} className="shrink-0" />
              Save Changes
            </>
          )}
        </button>
      </div>
      {success && (
        <div className="flex items-start gap-2 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </form>
  );
}

export function TrainerPasswordForm() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/trainer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to change password");
      }
      setSuccess("Password changed successfully");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mx-auto max-w-xl space-y-notion-xl rounded-xl border border-notion-gray-light/20 bg-white p-notion-xl shadow-notion transition-all dark:border-notion-gray-dark/20 dark:bg-notion-background-dark"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
          Current Password
        </label>
        <input
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          className="w-full rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2 font-geist text-base text-notion-text-light focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
          disabled={loading}
        />
      </div>
      <div>
        <label className="mb-1 block font-geist text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
          New Password
        </label>
        <input
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          className="w-full rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2 font-geist text-base text-notion-text-light focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
          disabled={loading}
        />
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-notion-pink px-5 py-2.5 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Changing...
            </span>
          ) : (
            <>
              <CheckCircle size={16} className="shrink-0" />
              Change Password
            </>
          )}
        </button>
      </div>
      {success && (
        <div className="flex items-start gap-2 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
          <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </form>
  );
}
