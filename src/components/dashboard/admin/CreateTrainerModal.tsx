"use client";
import { useState, useRef } from "react";
import { Users, Upload, CheckCircle, AlertCircle } from "lucide-react";

export function CreateTrainerModal({
  isOpen,
  onCloseAction,
  onSuccessAction,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  onSuccessAction: () => void;
}) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    bio: "",
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, image: e.target.files?.[0] ?? null }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = new FormData();
      data.append("username", form.username);
      data.append("password", form.password);
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("bio", form.bio);
      if (form.image) data.append("image", form.image);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        body: data,
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setError(err?.error ?? "Failed to create trainer");
        return;
      }
      setSuccess("Trainer created successfully!");
      setForm({
        username: "",
        password: "",
        name: "",
        email: "",
        bio: "",
        image: null,
      });
      onSuccessAction();
      onCloseAction();
    } catch {
      setError("Failed to create trainer");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fade-in rounded-xl border border-notion-gray-light/20 bg-white p-6 shadow-notion-lg dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/90">
        <div className="mb-5 flex items-center gap-3 border-b border-notion-gray-light/10 pb-4 dark:border-notion-gray-dark/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-notion-pink/10 dark:bg-notion-pink/20">
            <Users className="h-4 w-4 text-notion-pink dark:text-notion-pink-light" />
          </div>
          <h2 className="font-geist text-xl font-semibold text-notion-text-light dark:text-notion-text-dark">
            Create Trainer
          </h2>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block font-geist text-sm text-notion-text-light dark:text-notion-text-dark">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              minLength={3}
              className="w-full rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2 font-geist text-base text-notion-text-light focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
            />
          </div>
          <div>
            <label className="mb-1 block font-geist text-sm text-notion-text-light dark:text-notion-text-dark">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2 font-geist text-base text-notion-text-light focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
            />
          </div>
          <div>
            <label className="mb-1 block font-geist text-sm text-notion-text-light dark:text-notion-text-dark">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2 font-geist text-base text-notion-text-light focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
            />
          </div>{" "}
          <div>
            <label className="mb-1 flex items-center gap-1 font-geist text-sm text-notion-text-light dark:text-notion-text-dark">
              Email
              <span className="text-xs text-notion-text-light/50 dark:text-notion-text-dark/50">
                (optional)
              </span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2 font-geist text-base text-notion-text-light focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
            />
          </div>
          <div>
            <label className="mb-1 block font-geist text-sm text-notion-text-light dark:text-notion-text-dark">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-notion-gray-light/30 bg-notion-background px-4 py-2 font-geist text-base text-notion-text-light focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark"
            />
          </div>{" "}
          <div>
            <label className="mb-1 block font-geist text-sm text-notion-text-light dark:text-notion-text-dark">
              Profile Image
            </label>
            <div className="rounded-lg border border-dashed border-notion-gray-light/50 bg-notion-gray-light/5 p-3 dark:border-notion-gray-dark/50 dark:bg-notion-gray-dark/30">
              <div className="flex items-center justify-center">
                {form.image ? (
                  <div className="flex w-full flex-col items-center space-y-2">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-notion-pink/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Upload className="h-5 w-5 text-notion-pink/40" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-notion-pink">
                          Preview
                        </span>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <span className="truncate text-xs text-notion-text-light/70 dark:text-notion-text-dark/70">
                        {form.image.name}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, image: null }))
                        }
                        className="ml-2 rounded-full p-1 text-notion-text-light/40 hover:bg-notion-gray-light/20 hover:text-notion-pink dark:text-notion-text-dark/40 dark:hover:bg-notion-gray-dark/40"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex w-full cursor-pointer flex-col items-center space-y-2 p-4">
                    <Upload className="h-8 w-8 text-notion-pink/40" />
                    <span className="text-sm font-medium text-notion-text-light/70 dark:text-notion-text-dark/70">
                      Click to upload
                    </span>
                    <span className="text-xs text-notion-text-light/50 dark:text-notion-text-dark/50">
                      PNG, JPG up to 10MB
                    </span>
                    <input
                      ref={fileInputRef}
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300">
              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <p>{success}</p>
            </div>
          )}{" "}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCloseAction}
              className="flex items-center gap-2 rounded-lg border border-notion-gray-light/30 bg-white px-4 py-2 font-geist text-sm font-medium text-notion-text-light/80 shadow-sm transition-all hover:border-notion-gray-light/50 hover:bg-notion-gray-light/10 dark:border-notion-gray-dark/30 dark:bg-notion-background-dark dark:text-notion-text-dark/80 dark:hover:border-notion-gray-dark/50 dark:hover:bg-notion-gray-dark/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="relative flex items-center gap-2 rounded-lg bg-notion-pink px-5 py-2 font-geist text-sm font-medium text-white shadow-sm transition-all hover:bg-notion-pink-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span>Create Trainer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
