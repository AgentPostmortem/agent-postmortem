import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "380px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        serif: ["Georgia", "serif"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        "bg-canvas": "#0a0a0b",
        "bg-surface": "#111113",
        "bg-elevated": "#1a1a1e",
        "text-primary": "#f0f0f0",
        "text-secondary": "#9a9a9a",
        "text-tertiary": "#888888",
        "border-default": "#222226",
        "border-strong": "#333338",
        "accent-red": "#dc2626",
        "accent-red-soft": "#1f0a0a",
        "accent-red-muted": "#f87171",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#f0f0f0",
            a: { color: "#dc2626" },
            h1: { color: "#f0f0f0" },
            h2: { color: "#f0f0f0" },
            h3: { color: "#f0f0f0" },
            strong: { color: "#f0f0f0" },
            code: { color: "#f0f0f0" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
