"use client";

import { signIn } from "next-auth/react";
import { Github, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "~/components/ui/logo";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<"oauth" | "trainer">("oauth");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));
    await signIn(provider, { callbackUrl: "/" });
  };

  const handleTrainerSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading((prev) => ({ ...prev, trainer: true }));
    setError(null);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    setIsLoading((prev) => ({ ...prev, trainer: false }));
    if (res?.error) {
      setError("Invalid username or password");
    } else if (res?.ok) {
      window.location.href = "/";
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-notion-background dark:bg-notion-background-dark">
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 w-60">
          <Logo />
        </div>
        <div className="w-full max-w-sm space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-notion-text-light dark:text-notion-text-dark sm:text-3xl">
              Welcome to Empowering Small Scale Businesses Led by Women
            </h2>
            <p className="mt-2 text-sm text-notion-text-light/60 dark:text-notion-text-dark/60">
              Sign in to continue to the platform
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-2">
            <button
              className={`flex-1 rounded-t-md px-4 py-2 text-sm font-medium transition-colors ${tab === "oauth" ? "bg-white text-notion-accent dark:bg-notion-gray-dark dark:text-notion-accent-dark" : "bg-notion-gray-light/10 text-notion-text-light/60 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/60"}`}
              onClick={() => setTab("oauth")}
              type="button"
            >
              Social Login
            </button>
            <button
              className={`flex-1 rounded-t-md px-4 py-2 text-sm font-medium transition-colors ${tab === "trainer" ? "bg-white text-notion-accent dark:bg-notion-gray-dark dark:text-notion-accent-dark" : "bg-notion-gray-light/10 text-notion-text-light/60 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark/60"}`}
              onClick={() => setTab("trainer")}
              type="button"
            >
              Trainer Login
            </button>
          </div>

          {/* Auth Providers Container */}
          <div className="overflow-hidden rounded-lg border border-notion-gray-light/10 bg-white/50 shadow-notion-xs backdrop-blur-sm transition-shadow hover:shadow-notion dark:border-notion-gray-dark/10 dark:bg-notion-gray-dark/50 dark:hover:shadow-notion-hover">
            <div className="space-y-3 p-5">
              {tab === "oauth" && (
                <>
                  {/* Google Sign In */}
                  <button
                    onClick={() => handleOAuthSignIn("google")}
                    disabled={isLoading.google}
                    className="group relative flex w-full items-center justify-center gap-3 rounded-md border border-notion-gray-light/20 bg-white px-4 py-3 text-sm font-medium text-notion-text-light shadow-notion-xs transition-all hover:border-notion-accent hover:bg-notion-accent/5 hover:shadow-notion disabled:cursor-not-allowed disabled:opacity-50 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark dark:hover:border-notion-accent-dark dark:hover:bg-notion-accent-dark/10"
                  >
                    {isLoading.google ? (
                      <Loader2 className="h-4 w-4 animate-spin text-notion-accent dark:text-notion-accent-dark" />
                    ) : (
                      <svg
                        className="h-4 w-4"
                        width="16"
                        height="16"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                          fill="#FFC107"
                        />
                        <path
                          d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                          fill="#FF3D00"
                        />
                        <path
                          d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                          fill="#4CAF50"
                        />
                        <path
                          d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                          fill="#1976D2"
                        />
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </button>

                  {/* GitHub Sign In */}
                  <button
                    onClick={() => handleOAuthSignIn("github")}
                    disabled={isLoading.github}
                    className="group relative flex w-full items-center justify-center gap-3 rounded-md border border-notion-gray-light/20 bg-white px-4 py-3 text-sm font-medium text-notion-text-light shadow-notion-xs transition-all hover:border-notion-accent hover:bg-notion-accent/5 hover:shadow-notion disabled:cursor-not-allowed disabled:opacity-50 dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark dark:hover:border-notion-accent-dark dark:hover:bg-notion-accent-dark/10"
                  >
                    {isLoading.github ? (
                      <Loader2 className="h-4 w-4 animate-spin text-notion-accent dark:text-notion-accent-dark" />
                    ) : (
                      <Github className="h-4 w-4 text-notion-text-light dark:text-notion-text-dark" />
                    )}
                    <span>Continue with GitHub</span>
                  </button>
                </>
              )}
              {tab === "trainer" && (
                <form className="space-y-4" onSubmit={handleTrainerSignIn}>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
                    >
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-notion-gray-light/20 bg-white px-3 py-2 text-notion-text-light shadow-sm focus:border-notion-accent focus:ring-notion-accent dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark dark:focus:border-notion-accent-dark dark:focus:ring-notion-accent-dark"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-notion-text-light dark:text-notion-text-dark"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-notion-gray-light/20 bg-white px-3 py-2 text-notion-text-light shadow-sm focus:border-notion-accent focus:ring-notion-accent dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/40 dark:text-notion-text-dark dark:focus:border-notion-accent-dark dark:focus:ring-notion-accent-dark"
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-500 dark:text-red-400">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading.trainer}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-notion-gray-light/20 bg-notion-accent px-4 py-3 text-sm font-medium text-white shadow-notion-xs transition-all hover:bg-notion-accent/90 disabled:cursor-not-allowed disabled:opacity-50 dark:border-notion-gray-dark/20 dark:bg-notion-accent-dark dark:text-notion-text-dark dark:hover:bg-notion-accent-dark/90"
                  >
                    {isLoading.trainer && (
                      <Loader2 className="h-4 w-4 animate-spin text-white dark:text-notion-text-dark" />
                    )}
                    <span>Sign in as Trainer</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-notion-text-light/40 dark:text-notion-text-dark/40">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
