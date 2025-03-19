"use client";

import { useState } from "react";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // TODO: Implement newsletter signup
    // This is where you'd integrate with your email service
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("success");
    setEmail("");
  };

  return (
    <section className="border-y border-notion-gray-light py-16 dark:border-notion-gray-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold">Stay Connected</h2>
          <p className="mt-4 text-notion-text-light/70 dark:text-notion-text-dark/70">
            Get weekly updates on new courses, events, and community highlights.
            Join our growing community of women in tech.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-lg border border-notion-gray-light bg-notion-default px-4 py-3 focus:border-notion-pink focus:outline-none focus:ring-2 focus:ring-notion-pink/20 dark:border-notion-gray-dark dark:bg-notion-dark"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-lg bg-notion-pink px-6 py-3 font-medium text-notion-text-light transition-colors hover:bg-notion-pink-dark disabled:bg-notion-pink/70"
              >
                {status === "loading"
                  ? "Subscribing..."
                  : status === "success"
                    ? "Subscribed!"
                    : "Subscribe"}
              </button>
            </div>
          </form>

          <p className="mt-4 text-sm text-notion-text-light/50 dark:text-notion-text-dark/50">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
}
