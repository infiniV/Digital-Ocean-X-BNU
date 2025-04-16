"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "dark" | "light" | "system";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { theme, setTheme, systemTheme } = useTheme() as {
    theme: Theme | undefined;
    setTheme: (theme: Theme) => void;
    systemTheme?: Theme;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only two options: light and dark. Set initial theme based on system theme.
  useEffect(() => {
    if (!mounted && systemTheme) {
      setTheme(systemTheme === "dark" ? "dark" : "light");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, systemTheme]);

  const handleThemeToggle = () => {
    setIsChanging(true);
    // Toggle between light and dark
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => setIsChanging(false), 350);
  };

  // Icon logic
  const iconProps = {
    className:
      "transition-all duration-300 w-5 h-5 mx-auto " +
      (isChanging ? "scale-0 opacity-0" : "scale-100 opacity-100"),
    strokeWidth: 2,
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        className={`group relative flex items-center justify-center rounded-lg border border-notion-gray-light bg-notion-background p-2 shadow-notion transition-all duration-300 hover:border-notion-accent hover:shadow-notion-hover focus:outline-none focus:ring-2 focus:ring-notion-accent/30 dark:border-notion-gray-dark dark:bg-notion-background-dark dark:hover:border-notion-accent-dark ${
          isChanging ? "scale-95" : "scale-100"
        }`}
        aria-label="Toggle theme"
        tabIndex={0}
        onClick={handleThemeToggle}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") handleThemeToggle();
        }}
        type="button"
      >
        <span className="sr-only">Toggle theme</span>
        <span className="relative flex h-5 w-5 items-center justify-center">
          {theme === "dark" ? <Moon {...iconProps} /> : <Sun {...iconProps} />}
        </span>
        <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-notion-gray-light px-2 py-1 text-xs font-medium text-notion-text-light opacity-0 shadow-notion transition-all group-hover:opacity-100 dark:bg-notion-gray-dark dark:text-notion-text-dark">
          {theme === "dark" ? "Dark mode" : "Light mode"}
        </span>
        {isChanging && (
          <span className="absolute inset-0 z-10 animate-pulse-slow rounded-lg bg-gradient-to-r from-notion-accent-light to-notion-accent opacity-30 dark:from-notion-accent dark:to-notion-accent-dark" />
        )}
      </button>
    </div>
  );
}
