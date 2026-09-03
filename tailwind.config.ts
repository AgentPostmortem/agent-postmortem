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
        // Grotesk for headlines and display text
        // Editorial serif carries display type and section headings
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: [
          "var(--font-display)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        // Mono carries all registry metadata: case numbers, dates, severity
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        // Light paper canvas
        "bg-canvas": "#fafaf9",
        "bg-surface": "#ffffff",
        "bg-elevated": "#f5f5f4",
        "text-primary": "#1c1917",
        "text-secondary": "#57534e",
        "text-tertiary": "#6f6860",
        "border-default": "rgba(28,25,23,0.10)",
        "border-strong": "rgba(28,25,23,0.22)",
        // Signal emerald: the one brand accent
        accent: "#047857",
        "accent-soft": "#ecfdf5",
        "accent-strong": "#065f46",
        // Semantic severity scale, deliberately separate from the accent
        "sev-critical": "#dc2626",
        "sev-critical-soft": "#fef2f2",
        "sev-high": "#b45309",
        "sev-high-soft": "#fffbeb",
        "sev-medium": "#ca8a04",
        "sev-medium-soft": "#fefce8",
        "sev-low": "#64748b",
        "sev-low-soft": "#f1f5f9",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#1c1917",
            a: { color: "#047857" },
            h1: { color: "#1c1917" },
            h2: { color: "#1c1917" },
            h3: { color: "#1c1917" },
            strong: { color: "#1c1917" },
            code: { color: "#1c1917" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
