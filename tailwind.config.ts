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
        serif: [
          "var(--font-display)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      colors: {
        "bg-canvas": "#0b0b0c",
        "bg-surface": "#111113",
        "bg-elevated": "#18181b",
        "text-primary": "#ededef",
        "text-secondary": "#a0a0a6",
        "text-tertiary": "#8a8a93",
        "border-default": "rgba(237,237,240,0.09)",
        "border-strong": "rgba(237,237,240,0.17)",
        "accent-red": "#e2674e",
        "accent-red-soft": "#1f120e",
        "accent-red-muted": "#f28b70",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#ededef",
            a: { color: "#e2674e" },
            h1: { color: "#ededef" },
            h2: { color: "#ededef" },
            h3: { color: "#ededef" },
            strong: { color: "#ededef" },
            code: { color: "#ededef" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
