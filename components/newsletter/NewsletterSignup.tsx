"use client";

import { useState, type FormEvent } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("ok");
        setEmail("");
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  }

  if (status === "ok") {
    return (
      <p className="font-mono text-[11px] leading-relaxed text-text-secondary">
        Subscribed — check your inbox to confirm.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex max-w-xs flex-col gap-2">
      <label
        htmlFor="newsletter-email"
        className="font-sans text-[13px] font-semibold text-text-tertiary"
      >
        Get the weekly digest by email
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-sm border border-border-default bg-bg-surface px-2.5 py-1.5 font-mono text-[11px] text-text-primary placeholder:text-text-tertiary focus:border-border-strong focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-sm border border-accent bg-accent px-3 py-1.5 font-sans text-[13px] font-semibold text-bg-canvas transition-all hover:border-accent-strong hover:bg-accent-strong disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {status === "err" && (
        <p className="font-sans text-xs font-medium text-accent">
          Could not subscribe. Check the email and try again.
        </p>
      )}
    </form>
  );
}
