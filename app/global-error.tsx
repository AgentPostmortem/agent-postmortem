"use client";

import { useEffect } from "react";

// This replaces the root layout entirely when something above app/error.tsx
// throws, so it can't rely on globals.css, the font variables, or any
// component from the library -- all of that may be what failed. Everything
// here is a plain inline-styled tag.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
          backgroundColor: "#0a0a0a",
          color: "#e5e5e5",
        }}
      >
        <div style={{ maxWidth: 420, padding: "0 24px", textAlign: "center" }}>
          <div
            style={{
              margin: "0 auto 24px",
              display: "inline-flex",
              height: 48,
              width: 48,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #3a3a3a",
            }}
          >
            <span style={{ fontSize: 18, color: "#e5e5e5" }}>!</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 400, margin: 0 }}>
            Something went badly wrong
          </h1>
          <p style={{ marginTop: 12, fontSize: 14, color: "#a3a3a3" }}>
            The site itself failed to load, not just a page on it. The team has
            been notified.
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontSize: 10, color: "#737373" }}>
              ref: {error.digest}
            </p>
          )}
          <div
            style={{
              marginTop: 32,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <button
              onClick={reset}
              style={{
                border: "1px solid #3a3a3a",
                backgroundColor: "#171717",
                color: "#a3a3a3",
                padding: "8px 16px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                border: "1px solid #3a3a3a",
                backgroundColor: "#171717",
                color: "#737373",
                padding: "8px 16px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
              }}
            >
              Registry
            </a>
            <a
              href="mailto:hello@agentpostmortem.com"
              style={{
                border: "1px solid #3a3a3a",
                backgroundColor: "#171717",
                color: "#737373",
                padding: "8px 16px",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
              }}
            >
              Report this
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
