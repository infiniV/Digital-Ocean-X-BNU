"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <style jsx global>{`
        html {
          transition:
            background-color 0.5s ease,
            color 0.5s ease,
            border-color 0.5s ease,
            fill 0.5s ease,
            stroke 0.5s ease;
        }
        body {
          transition:
            background-color 0.5s ease,
            color 0.5s ease;
        }
        * {
          transition-property:
            background-color, border-color, color, fill, stroke;
          transition-duration: 0.5s;
          transition-timing-function: ease;
        }
      `}</style>
      <div className="min-h-screen">{children}</div>
    </NextThemesProvider>
  );
}
