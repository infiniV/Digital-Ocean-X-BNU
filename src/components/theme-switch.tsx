"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { theme, setTheme } = useTheme() as {
    theme: Theme | undefined;
    setTheme: (theme: Theme) => void;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      className="bg-notion-gray-light dark:bg-notion-gray-dark rounded-lg p-2 transition-opacity hover:opacity-80"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}
