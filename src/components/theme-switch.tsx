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

  // Micro-interaction state for ripple
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const [rippleActive, setRippleActive] = useState(false);

  // Ripple effect handler
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setRippleActive(true);
    handleThemeToggle();
    setTimeout(() => setRippleActive(false), 400);
  };

  // Keyboard focus ring animation
  const [focusVisible, setFocusVisible] = useState(false);

  // Haptic feedback (if supported)
  const triggerHaptic = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        className={`group relative flex items-center justify-center rounded-xl border border-notion-gray-light bg-notion-background p-2 shadow-notion transition-all duration-500 hover:-rotate-2 hover:scale-105 hover:border-notion-accent hover:shadow-notion-hover focus:outline-none focus:ring-2 focus:ring-notion-accent/30 active:rotate-1 active:scale-95 dark:border-notion-gray-dark dark:bg-notion-background-dark dark:hover:border-notion-accent-dark ${
          isChanging ? "scale-90 blur-[0.5px]" : "scale-100 blur-0"
        } ${focusVisible ? "ring-2 ring-notion-pink/20" : ""}`}
        aria-label="Toggle theme"
        tabIndex={0}
        onClick={(e) => {
          handleButtonClick(e);
          triggerHaptic();
          setFocusVisible(false); // Remove focus/active after click
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleThemeToggle();
            triggerHaptic();
            setFocusVisible(false); // Remove focus/active after key
          }
        }}
        onFocus={() => setFocusVisible(true)}
        onBlur={() => setFocusVisible(false)}
        type="button"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span className="sr-only">Toggle theme</span>
        <span className="relative flex h-7 w-7 items-center justify-center">
          {/* Icon with animated shadow, color pop, and 3D effect */}
          <span
            className={`absolute -inset-1 z-0 rounded-full blur-[6px] transition-all duration-500 ${theme === "dark" ? "scale-110 bg-notion-pink/20 opacity-50" : "scale-100 bg-notion-accent/20 opacity-30"}`}
          ></span>
          <span
            className={`relative z-10 drop-shadow-[0_2px_8px_rgba(246,135,179,0.18)] transition-transform duration-500 will-change-transform ${isChanging ? "rotate-[18deg] scale-75" : "rotate-0 scale-100"} ${theme === "dark" ? "text-notion-pink" : "text-notion-accent-dark"}`}
            style={{
              filter:
                theme === "dark"
                  ? "drop-shadow(0 0 8px #F687B3)"
                  : "drop-shadow(0 0 8px #F8B4D9)",
            }}
          >
            {theme === "dark" ? (
              <Moon {...iconProps} />
            ) : (
              <Sun {...iconProps} />
            )}
          </span>
          {/* Subtle highlight ring for 3D glassy effect */}
          <span className="pointer-events-none absolute inset-0 z-0 rounded-full border-2 border-white/10 dark:border-white/5" />
        </span>
        {/* Animated label with slide/fade and glassmorphism */}
        <span
          className={`pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 translate-y-0 whitespace-nowrap rounded-xl bg-white/70 px-3 py-1 text-xs font-semibold text-notion-text-light opacity-0 shadow-notion ring-1 ring-notion-accent/10 backdrop-blur-md transition-all duration-500 group-hover:translate-y-2 group-hover:opacity-100 dark:bg-notion-gray-dark/80 dark:text-notion-text-dark`}
        >
          {theme === "dark" ? "Dark mode" : "Light mode"}
        </span>
        {/* Animated gradient pulse overlay */}
        {isChanging && (
          <span className="absolute inset-0 z-20 animate-pulse-slow rounded-xl bg-gradient-to-r from-notion-accent-light to-notion-accent opacity-50 dark:from-notion-accent dark:to-notion-accent-dark" />
        )}
        {/* Ripple effect */}
        {ripple && rippleActive && (
          <span
            className="pointer-events-none absolute z-30 h-20 w-20 -translate-x-1/2 -translate-y-1/2 animate-[ripple_0.4s_ease-out] rounded-full bg-notion-pink/40 opacity-70"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
          />
        )}
        {/* Subtle grain overlay for tactile feel */}
        <span className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-grain opacity-10" />
        {/* Animated border shimmer */}
        <span className="pointer-events-none absolute -inset-0.5 z-40 rounded-2xl border-2 border-transparent bg-gradient-to-r from-notion-accent/30 via-notion-pink/20 to-notion-accent-dark/30 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:blur-[2px]" />
      </button>
      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.7;
          }
          80% {
            transform: scale(2.5);
            opacity: 0.3;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
