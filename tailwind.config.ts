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
        // Warm-neutral archival canvas
        "bg-canvas": "#0c0b0a",
        "bg-surface": "#141210",
        "bg-elevated": "#1c1917",
        "text-primary": "#f2ede4",
        "text-secondary": "#a8a096",
        "text-tertiary": "#7f776c",
        "border-default": "rgba(242,237,228,0.10)",
        "border-strong": "rgba(242,237,228,0.19)",
        // Signal amber: the one brand accent
        accent: "#f5a524",
        "accent-soft": "#20170a",
        "accent-strong": "#ffc25c",
        // Semantic severity scale, deliberately separate from the accent
        "sev-critical": "#e5484d",
        "sev-critical-soft": "#25100f",
        "sev-high": "#f5a524",
        "sev-high-soft": "#20170a",
        "sev-medium": "#d3b04c",
        "sev-medium-soft": "#1d1809",
        "sev-low": "#8aa1b8",
        "sev-low-soft": "#111518",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#f2ede4",
            a: { color: "#f5a524" },
            h1: { color: "#f2ede4" },
            h2: { color: "#f2ede4" },
            h3: { color: "#f2ede4" },
            strong: { color: "#f2ede4" },
            code: { color: "#f2ede4" },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
