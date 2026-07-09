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
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      colors: {
        "bg-canvas": "#0d0c0a",
        "bg-surface": "#121110",
        "bg-elevated": "#1a1815",
        "text-primary": "#efece5",
        "text-secondary": "#a49e91",
        "text-tertiary": "#847e71",
        "border-default": "rgba(239,236,229,0.09)",
        "border-strong": "rgba(239,236,229,0.17)",
        "accent-red": "#c9a35c",
        "accent-red-soft": "#1c1610",
        "accent-red-muted": "#e2c288",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#efece5",
            a: { color: "#c9a35c" },
            h1: { color: "#efece5" },
            h2: { color: "#efece5" },
            h3: { color: "#efece5" },
            strong: { color: "#efece5" },
            code: { color: "#efece5" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
