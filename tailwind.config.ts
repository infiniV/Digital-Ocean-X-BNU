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
        white: "#F5EFE0", // Darker coffee/old paper white override
        notion: {
          background: {
            light: "#F5EFE0", // Lighter coffee/old paper tone
            DEFAULT: "#F5EFE0", // Lighter coffee/old paper tone
            dark: "#191919",
          },
          default: "#F8F4E8", // Lighter coffee/old paper tone
          dark: "#191919",
          gray: {
            light: "#F2EAD8", // Warmer coffee/old paper tone
            DEFAULT: "#E9DFCA", // More pronounced coffee/old paper tone
            dark: "#202020",
          },
          text: {
            light: "#3B352D", // Slightly warmer text color
            DEFAULT: "#3B352D", // Slightly warmer text color
            dark: "#FBFBFA",
          },
          accent: {
            light: "#F8B4D9",
            DEFAULT: "#F687B3",
            dark: "#ED64A6",
          },
          pink: {
            light: "#FFD6E5",
            DEFAULT: "#FFC0DB",
            dark: "#FFB3D1",
          },
          disabled: {
            light: "#EFE7D5", // Warmer coffee/old paper tone
            DEFAULT: "#E9DFCA", // Match gray default
            hover: "#E4D9C0", // Darker hover state
            dark: "#2D2D2D",
            "dark-hover": "#333333",
            text: "#A39E8D", // More coffee-toned disabled text
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
        "notion-4xl": "4rem", // 64px
        "notion-5xl": "5rem", // 80px
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
        grain: "grain 8s steps(10) infinite",
        "smooth-appear": "smoothAppear 0.4s ease-out",
        "slide-in-bottom": "slideInBottom 0.3s ease-out",
        "spin-slow": "spin 0.6s ease-in-out",
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
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -5%)" },
          "20%": { transform: "translate(-10%, 5%)" },
          "30%": { transform: "translate(5%, -10%)" },
          "40%": { transform: "translate(-5%, 15%)" },
          "50%": { transform: "translate(-10%, 5%)" },
          "60%": { transform: "translate(15%, 0)" },
          "70%": { transform: "translate(0, 10%)" },
          "80%": { transform: "translate(-15%, 0)" },
          "90%": { transform: "translate(10%, 5%)" },
        },
        smoothAppear: {
          "0%": { opacity: "0", transform: "translateY(5px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInBottom: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
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
        "notion-xs": "0 1px 2px rgba(75,60,40,0.06)", // Softer, warmer shadow
        notion: "0 1px 3px rgba(75,60,40,0.08), 0 1px 2px rgba(75,60,40,0.05)", // Paper-like shadow
        "notion-hover":
          "0 3px 6px rgba(75,60,40,0.09), 0 3px 6px rgba(75,60,40,0.06)", // Softer hover shadow
        "notion-lg":
          "0 10px 20px rgba(75,60,40,0.10), 0 6px 6px rgba(75,60,40,0.06)", // Larger shadow with paper tone
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        grain:
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAGAElEQVR4nO2dS4sdRRTHf3Nn8hBNMIkTUBIRNQYCGVAXLhIXoogrwQ/gxm/hygcouHGtK8GFблBlEQdGEgwKkkkgvhIjED2M5mZ22VX3dtV1VXVdeowHDhMT7+q7/l11TmnTp2qgbWYH4uN363xvls2QANoF8+xThsNG78bbRoL4A7wDJibcRxRY2aBYT1vkHxMfGwUB2nXjgH37B78kSzYyfzhb4z2M2voL3q5WqcRdLA3kUEUAMaBwwnRlJLuqYXP4ZRt2jJJU0DEIBm7Ef3SXXP+TzPXQ84FWB0ZDJmq5fGBWLSEPFJUGZ6NMzAq7rXrJ2B0xAEMhsxUptEg6UQtILJZTmJGk3pWlZHArNDF3uwUNxB5EzSVCFtY5JUm7xAQAWl7nfF6XNJuJQb0YFlgdARoo0AYNE0LEkXkBjGYVjufaDQCYWGUVAyDwZSGvKGBYB1rLNZsHMYONDZZ2vkTwEHgJuHw0WxA1GgIGj5hQ9skLR7WREK4FTyfAdcNtiNyBpFpNdF1qIOthJKCFkgqxiYMXFJBbwD3gPO6OI4EJWY6EY2nU2YCjIZSZXWrKGD8DPzBcA5UwVhhI6EF6qlkKwdEEEi/FD03/XBScFxtA28D54G/GT9EXoVhLEzXJM0P+EC0FIQBDmQx7wKfAbeB+05B+2CNgpAaPolTEJdJFPKLyNzrwAfAVeBfwruIMGOkQFEARTArp9038gnMBnoVCcR7wCXgDnEbe5WlrqKbSjugtECk3TpqLrABnAHeAa6wlgZcYwvirxWQ0BB+3O8gJh03/RBwEvgYuOiUobA4sQoCwgVCiUesXy8MHAPeBt4HLgM3B4UkKGwbUmb6EOFxiadJ5k4M5nwpZwYVqBF26P0G8CpwCvgU+JXhGiJLaicSjVks/Z4mNYMdnZYTr491XjU0L4vyzIh02qODxx8DJ5hdV/+VKPuC0bXO9R1+6HXzYCzrNlADiKmWw9xpNp5uGwHgEPAG8CWDR7WGQIxHQCZ0D21TXUsLL2atJp2unY6HSVTDcY35oo7sC/u/nwbOAnvAX8BPwA/Ab4yPB0lx2gg0aDbIbIAQ8ZSiQNwGngNOO+XyoWh3xvx8WQpK41Wm1lK1AmACLMu6BJwEvmN2XWT40CdI5iNrj5UDxCwiEuqK3wEvMQByGnge+Bq4xTqjqZ0gp3jWJURLD8iYlU39DTwLvA68CHwPXHd+HxvxhmaQqgFkZEbyzEg7Yw94hdnM7xTwJbMZoWmX+tlhyTXsJGdjpQAZGxRvV/9nxKsQ24M1wa2LwSqAk6RfSFLh4eU6dlRtYQ3PmN2V5Uj/PDFRHJCpGeud+A4IKhjWElepuwxl76NOOFNvFsLXCY0ewE2wq4q6lTMEJDSlOAExVbgw1kXBNB2B9pGYbKscGDkbY7dC3WvZzJ1S39mGQWR49krkBEQCpKfVoURqhcbri3gHpFFom3A0XRFBujXuZNDtUPdkNHXgRhZEjNBUoLCSom3Ttvnf4EaZS4RJ68mAKOuAtkt51kG5KCgAW+VcbuRiHbL+FIUgzyurA0HN2lVK7RFhtjdF+0XyqH4wsEMQI+rPptp44xEwKO8QrbJ2cAIQUioL7CDyaYzp35TsKN2v/O4QEK24x7RpNUE2gPG2gDPWboCQjNZwMjLKaqxnljEbDZVKpJ4seiDKKWd0C75+8x9uJoMjglIiF4BAlKBqii1qyh7lQemBGAtY2oT+FGCEXpmoB6QvDURgxsgCY1KVPXGGVlqPpY54CkjigcmUa4hEEJXUpB1JP0twyyUgCgARNpVIdDahP55iKpsu3CspDARKShXqhKZzgpSR5HtIqnC98PtPXSEgEe7LXV9vugFD2mMXB+rBGFqv6Ce14hGFO0kPRJtZk4qBSA3tSKtW7oSfExDf+iO8dDelpB8m0QMRgWqnwIgndyMxGC0UICXFiXZ4+VOr4UIoLTrxVUND5IYtRK2iUheIiedVSBkgZQudFdJvVLu4zRQLQ2EHEZBYji6cKBWvuU9RJXKqZH0jvIFek6QaC2aNW2WUWvx0KKQDnDgAAAAASUVORK5CYII=')",
      },
    },
  },
  plugins: [],
} satisfies Config;
