"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type VoteState = "up" | "down" | null;

type VoteButtonsProps = {
  postId: string;
  initialScore: number;
  compact?: boolean;
};

export function VoteButtons({
  postId,
  initialScore,
  compact = false,
}: VoteButtonsProps) {
  const [vote, setVote] = useState<VoteState>(null);
  const [score, setScore] = useState(initialScore);
  const [loading, setLoading] = useState(false);

  async function handleVote(direction: "up" | "down") {
    if (loading) return;
    setLoading(true);
    const prev = vote;
    let delta = 0;
    if (prev === direction) {
      setVote(null);
      delta = direction === "up" ? -1 : 1;
    } else {
      if (prev === "up") delta = -2;
      else if (prev === "down") delta = 2;
      else delta = direction === "up" ? 1 : -1;
      setVote(direction);
    }
    setScore((s) => s + delta);
    try {
      await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direction: prev === direction ? null : direction,
        }),
      });
    } catch {
      setVote(prev);
      setScore((s) => s - delta);
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => handleVote("up")}
          disabled={loading}
          aria-label="Upvote"
          className={cn(
            "leading-none transition-colors disabled:opacity-40",
            vote === "up"
              ? "text-accent-red"
              : "text-text-tertiary hover:text-text-secondary",
          )}
        >
          <svg width="10" height="7" viewBox="0 0 10 7" fill="currentColor">
            <path d="M5 0L10 7H0L5 0Z" />
          </svg>
        </button>
        <span
          className={cn(
            "font-mono text-[11px] font-medium tabular-nums leading-none",
            vote === "up" ? "text-accent-red" : "text-text-secondary",
          )}
        >
          {fmt(score)}
        </span>
        <button
          onClick={() => handleVote("down")}
          disabled={loading}
          aria-label="Downvote"
          className={cn(
            "leading-none transition-colors disabled:opacity-40",
            vote === "down"
              ? "text-text-secondary"
              : "text-text-tertiary hover:text-text-secondary",
          )}
        >
          <svg width="10" height="7" viewBox="0 0 10 7" fill="currentColor">
            <path d="M5 7L0 0H10L5 7Z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote("up")}
        disabled={loading}
        aria-label="Upvote"
        className={cn(
          "flex items-center gap-1.5 rounded border px-2.5 py-1.5 font-mono text-xs transition-all disabled:opacity-40",
          vote === "up"
            ? "border-accent-red bg-accent-red-soft text-accent-red-muted"
            : "border-border-default text-text-tertiary hover:border-border-strong hover:text-text-secondary",
        )}
      >
        <svg width="8" height="6" viewBox="0 0 10 7" fill="currentColor">
          <path d="M5 0L10 7H0L5 0Z" />
        </svg>
        <span>{fmt(score)}</span>
      </button>
      <button
        onClick={() => handleVote("down")}
        disabled={loading}
        aria-label="Downvote"
        className={cn(
          "rounded border px-2 py-1.5 text-xs transition-all disabled:opacity-40",
          vote === "down"
            ? "border-border-strong text-text-secondary"
            : "border-border-default text-text-tertiary hover:border-border-strong",
        )}
      >
        <svg width="8" height="6" viewBox="0 0 10 7" fill="currentColor">
          <path d="M5 7L0 0H10L5 7Z" />
        </svg>
      </button>
    </div>
  );
}
