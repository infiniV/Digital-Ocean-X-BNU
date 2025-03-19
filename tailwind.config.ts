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
      },
      colors: {
        notion: {
          background: {
            DEFAULT: "#FFFFFF",
            dark: "#191919",
          },
          default: "#fff",
          dark: "#191919",
          gray: {
            light: "#F7F6F3",
            dark: "#202020",
          },
          text: {
            light: "#37352F",
            dark: "#FBFBFA",
          },
          accent: "#E16259",
          pink: {
            light: "#FFD6E5",
            DEFAULT: "#FFC0DB",
            dark: "#FFB3D1",
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'var(--tw-prose-body)',
            'font-family': 'var(--font-geist-sans)',
          }
        }
      },
      boxShadow: {
        'notion': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'notion-hover': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      },
    },
  },
  plugins: [],
} satisfies Config;
