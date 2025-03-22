import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        geist: ["var(--font-geist-sans)", ...fontFamily.sans],
        serif: ["var(--font-geist-serif)", ...fontFamily.serif],
      },
      colors: {
        notion: {
          background: {
            light: "#FFFFFF",
            DEFAULT: "#FFFFFF",
            dark: "#191919",
          },
          default: "#FFFFFF",
          dark: "#191919",
          gray: {
            light: "#F7F6F3",
            DEFAULT: "#EBEAEA",
            dark: "#202020",
          },
          text: {
            light: "#37352F",
            DEFAULT: "#37352F",
            dark: "#FBFBFA",
          },
          accent: {
            light: "#F8B4D9", // Changed to light pastel pink
            DEFAULT: "#F687B3", // Changed to medium pastel pink
            dark: "#ED64A6", // Changed to deeper pastel pink
          },
          pink: {
            light: "#FFD6E5",
            DEFAULT: "#FFC0DB",
            dark: "#FFB3D1",
          },
          disabled: {
            light: "#F2F2F1",
            DEFAULT: "#EBEAEA",
            hover: "#E8E8E7",
            dark: "#2D2D2D",
            "dark-hover": "#333333",
            text: "#A3A29E",
            "text-dark": "#666666",
          },
        },
      },
      spacing: {
        "notion-xs": "0.5rem", // 8px
        "notion-sm": "0.75rem", // 12px
        "notion-md": "1rem", // 16px
        "notion-lg": "1.5rem", // 24px
        "notion-xl": "2rem", // 32px
        "notion-2xl": "2.5rem", // Added for consistency: 40px
        "notion-3xl": "3rem", // Added for consistency: 48px
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out", // Standardized to ease-out
        "slide-in": "slideIn 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out", // Added for completeness
        "scale-in": "scaleIn 0.2s ease-out",
        "scale-out": "scaleOut 0.2s ease-out", // Added for completeness
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideUp: {
          // Added for completeness
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          // Added for completeness
          "0%": { transform: "scale(1.05)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "var(--tw-prose-body)",
            "font-family": "var(--font-geist-sans)",
            h1: { fontWeight: "600" },
            h2: { fontWeight: "600" },
            h3: { fontWeight: "600" },
            a: { color: "#F687B3" }, // Updated to match new accent color
          },
        },
      },
      boxShadow: {
        "notion-xs": "0 1px 2px rgba(0,0,0,0.08)", // Added for a complete shadow scale
        notion: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "notion-hover":
          "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
        "notion-lg": "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)", // Added for a complete shadow scale
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
} satisfies Config;
