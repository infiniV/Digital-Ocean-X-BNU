"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { theme, setTheme } = useTheme() as {
    theme: Theme | undefined;
    setTheme: (theme: Theme) => void;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setIsChanging(true);
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
      setTimeout(() => setIsChanging(false), 300);
    }, 150);
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        className={`rounded-lg bg-notion-gray-light p-2 shadow-notion transition-all duration-300 ease-in-out hover:shadow-notion-hover dark:bg-notion-gray-dark ${
          isChanging ? "animate-spin-slow scale-90" : "scale-100"
        }`}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <span
          className={`block transition-transform duration-300 ${isChanging ? "scale-0" : "scale-100"}`}
        >
          {theme === "dark" ? "🌞" : "🌙"}
        </span>
      </button>
      {isChanging && (
        <div className="absolute left-0 top-0 h-full w-full animate-pulse-slow rounded-lg bg-gradient-to-r from-notion-accent-light to-notion-accent dark:from-notion-accent dark:to-notion-accent-dark"></div>
      )}
    </div>
  );
}
