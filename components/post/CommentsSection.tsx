"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: string;
  body: string;
  is_anonymous: boolean;
  author_handle: string | null;
  created_at: string;
}

export function CommentsSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [body, setBody] = useState("");
  const [handle, setHandle] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?post_id=${postId}`)
      .then((r) => r.json())
      .then((json) => {
        setComments(json.comments ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (body.trim().length < 3) {
      setError("Comment is too short.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          body: body.trim(),
          is_anonymous: isAnonymous,
          author_handle: isAnonymous ? null : handle.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to post comment.");
        return;
      }
      setComments((prev) => [...prev, json.comment]);
      setBody("");
      setHandle("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-10 border-t border-border-default pt-8">
      <div className="mb-5 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
        Discussion{comments.length > 0 ? ` · ${comments.length}` : ""}
      </div>

      {/* Comment list */}
      {loaded && comments.length > 0 && (
        <div className="mb-8 space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded border border-border-default bg-bg-surface px-4 py-3"
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span className="font-mono text-[10px] text-text-secondary">
                  {c.is_anonymous || !c.author_handle
                    ? "Anonymous"
                    : `@${c.author_handle}`}
                </span>
                <span className="text-border-strong">·</span>
                <span className="font-mono text-[10px] text-text-tertiary">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(new Date(c.created_at))}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loaded && (
        <div className="mb-8 space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded border border-border-default bg-bg-surface px-4 py-3"
            >
              <div className="mb-2 flex gap-2">
                <div className="h-3 w-20 animate-pulse rounded bg-bg-elevated" />
                <div className="h-3 w-16 animate-pulse rounded bg-bg-elevated" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-full animate-pulse rounded bg-bg-elevated" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-bg-elevated" />
              </div>
            </div>
          ))}
        </div>
      )}

      {loaded && comments.length === 0 && (
        <p className="mb-6 font-mono text-xs text-text-tertiary">
          No comments yet. Be the first to add context.
        </p>
      )}

      {/* Submit form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add context, a related incident, or a correction…"
          rows={4}
          className="w-full rounded border border-border-default bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none resize-none"
        />

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="accent-accent-red"
            />
            <span className="font-mono text-xs text-text-secondary">
              Post anonymously
            </span>
          </label>

          {!isAnonymous && (
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Your handle (optional)"
              className="rounded border border-border-default bg-bg-surface px-3 py-1.5 font-mono text-xs text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none"
            />
          )}
        </div>

        {error && <p className="font-mono text-xs text-accent-red">{error}</p>}
        {success && (
          <p className="font-mono text-xs text-green-400">Comment posted.</p>
        )}

        <button
          type="submit"
          disabled={submitting || body.trim().length < 3}
          className="rounded border border-border-default bg-bg-elevated px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-colors hover:border-accent-red hover:text-accent-red disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
