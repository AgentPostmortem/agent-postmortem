"use client";

import { useState, useEffect, useRef } from "react";

interface Comment {
  id: string;
  body: string;
  is_anonymous: boolean;
  author_handle: string | null;
  created_at: string;
}

interface CommentsResponse {
  comments?: Comment[];
  comment?: Comment;
  error?: string;
}

function CommentAnchorLink({ commentId }: { commentId: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    const url = `${window.location.origin}${window.location.pathname}#c-${commentId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      onClick={copy}
      className="font-mono text-[10px] text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100 hover:text-text-secondary"
      title="Copy link to comment"
    >
      {copied ? "Copied" : "#"}
    </button>
  );
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
  const highlightRef = useRef<string | null>(null);

  useEffect(() => {
    // Pick up anchor from URL hash
    const hash = window.location.hash;
    if (hash.startsWith("#c-")) {
      highlightRef.current = hash.slice(3);
    }

    fetch(`/api/comments?post_id=${postId}`)
      .then((r) => r.json())
      .then((json) => {
        const response = json as CommentsResponse;
        setComments(response.comments ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [postId]);

  // Scroll to anchored comment after load
  useEffect(() => {
    if (loaded && highlightRef.current) {
      const el = document.getElementById(`c-${highlightRef.current}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loaded]);

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
      const json = (await res.json()) as CommentsResponse;
      if (!res.ok) {
        setError(json.error ?? "Failed to post comment.");
        return;
      }
      if (json.comment) {
        setComments((prev) => [...prev, json.comment as Comment]);
      }
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
    <div className="mt-10 border-t border-border-default pt-8" id="discussion">
      <div className="mb-5 font-mono text-[9px] uppercase tracking-[0.2em] text-text-tertiary">
        Discussion{comments.length > 0 ? ` · ${comments.length}` : ""}
      </div>

      {/* Skeleton */}
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

      {/* Comment list */}
      {loaded && comments.length > 0 && (
        <div className="mb-8 space-y-4">
          {comments.map((c) => {
            const isHighlighted = highlightRef.current === c.id;
            return (
              <div
                key={c.id}
                id={`c-${c.id}`}
                className={[
                  "group rounded border bg-bg-surface px-4 py-3 transition-colors",
                  isHighlighted
                    ? "border-accent-red/40 bg-accent-red/5"
                    : "border-border-default",
                ].join(" ")}
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
                      timeZone: "UTC",
                    }).format(new Date(c.created_at))}
                  </span>
                  <CommentAnchorLink commentId={c.id} />
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
                  {c.body}
                </p>
              </div>
            );
          })}
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
          className="w-full resize-none rounded border border-border-default bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none"
        />

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer select-none items-center gap-2">
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
          className="rounded border border-border-default bg-bg-elevated px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-text-secondary transition-colors hover:border-accent-red hover:text-accent-red disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
