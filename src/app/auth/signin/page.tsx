"use client";

import { signIn } from "next-auth/react";
import { Github, Loader2 } from "lucide-react";
import { useState } from "react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }));
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="from-notion-purple-light to-notion-blue-light dark:from-notion-purple-dark dark:to-notion-blue-dark relative min-h-screen bg-gradient-to-br via-notion-background dark:via-notion-background-dark">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-fade-in w-full max-w-md">
          {/* Logo and Title */}
          <div className="mb-8 text-center">
            <div className="bg-notion-purple-light dark:bg-notion-purple-dark/30 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl p-3 shadow-lg transition-transform hover:scale-105">
              <svg
                className="text-notion-purple dark:text-notion-purple-light h-10 w-10"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                />
              </svg>
            </div>
            <h2 className="animate-slide-down font-geist text-3xl font-bold tracking-tight text-notion-text-light dark:text-notion-text-dark">
              Welcome to Women Empower
            </h2>
            <p className="animate-slide-down mt-2 font-geist text-sm text-notion-text-light/70 dark:text-notion-text-dark/70">
              Sign in to continue to the platform
            </p>
          </div>

          {/* Auth Providers */}
          <div className="animate-scale-in overflow-hidden rounded-xl border border-notion-gray-light/20 bg-white/80 backdrop-blur-sm transition-all hover:shadow-notion dark:border-notion-gray-dark/20 dark:bg-notion-gray-dark/50">
            <div className="space-y-4 p-6">
              {/* Google Sign In */}
              <button
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading.google}
                className="hover:border-notion-purple hover:bg-notion-purple-light/10 dark:hover:border-notion-purple-light dark:hover:bg-notion-purple-dark/20 group flex w-full items-center justify-center gap-3 rounded-lg border border-notion-gray-light/30 bg-white px-5 py-3.5 font-geist text-sm font-medium text-notion-text-light shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark"
              >
                {isLoading.google ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
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
                className="hover:border-notion-blue hover:bg-notion-blue-light/10 dark:hover:border-notion-blue-light dark:hover:bg-notion-blue-dark/20 group flex w-full items-center justify-center gap-3 rounded-lg border border-notion-gray-light/30 bg-white px-5 py-3.5 font-geist text-sm font-medium text-notion-text-light shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-notion-gray-dark/30 dark:bg-notion-gray-dark/20 dark:text-notion-text-dark"
              >
                {isLoading.github ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                <span>Continue with GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
