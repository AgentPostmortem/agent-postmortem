"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TAGS } from "@/lib/constants/tags";

interface PostData {
  id: string;
  case_number: string | null;
  title: string;
  outcome: string;
  prompt: string | null;
  damage_level: number;
  estimated_cost_usd: number | null;
  is_anonymous: boolean;
  submitter_handle: string | null;
  status: string;
  agents: { slug: string; name: string } | null;
  post_tags: { tags: { slug: string; label: string } | null }[];
}

const DAMAGE_LABELS: Record<number, string> = {
  1: "Minimal",
  2: "Low",
  3: "Moderate",
  4: "Severe",
  5: "Critical",
};

export function EditCaseClient() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [outcome, setOutcome] = useState("");
  const [prompt, setPrompt] = useState("");
  const [damageLevel, setDamageLevel] = useState(3);
  const [estimatedCost, setEstimatedCost] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [authorHandle, setAuthorHandle] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/edit/${token}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) {
          setNotFound(true);
          return;
        }
        const p: PostData = json.post;
        setPost(p);
        setTitle(p.title);
        setOutcome(p.outcome);
        setPrompt(p.prompt ?? "");
        setDamageLevel(p.damage_level);
        setEstimatedCost(p.estimated_cost_usd?.toString() ?? "");
        setSelectedTags(
          (p.post_tags ?? [])
            .map((pt) => pt.tags?.slug)
            .filter(Boolean) as string[],
        );
        setIsAnonymous(p.is_anonymous);
        setAuthorHandle(p.submitter_handle ?? "");
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  function toggleTag(slug: string) {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (selectedTags.length === 0) {
      setError("Please select at least one tag.");
      return;
    }
    if (!isAnonymous && !authorHandle.trim()) {
      setError("Please enter a handle or post anonymously.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/edit/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          outcome,
          prompt: prompt.trim() || null,
          damageLevel,
          estimatedCostUsd: estimatedCost ? parseInt(estimatedCost, 10) : null,
          tags: selectedTags,
          isAnonymous,
          authorHandle: isAnonymous ? null : authorHandle.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to save changes.");
        return;
      }
      setSaved(true);
      if (post?.case_number) {
        setTimeout(
          () => router.push(`/case/${post.case_number!.toLowerCase()}`),
          2000,
        );
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-mono text-sm text-text-tertiary">Loading…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-serif text-2xl text-text-primary">
          Invalid or expired link
        </p>
        <p className="mt-3 text-sm text-text-tertiary">
          Edit links are single-use and expire after use. If you need access,{" "}
          <Link href="/contact" className="text-accent-red hover:underline">
            contact us
          </Link>
          .
        </p>
        <Link
          href="/"
          className="mt-6 inline-block font-mono text-xs uppercase tracking-wider text-text-tertiary hover:text-text-primary"
        >
          ← Back to Registry
        </Link>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-serif text-2xl text-text-primary">Changes saved</p>
        <p className="mt-3 text-sm text-text-tertiary">
          {post?.case_number
            ? "Your edits have been submitted for re-review."
            : "Your edits have been saved and will be reviewed."}
        </p>
        {post?.case_number && (
          <p className="mt-2 font-mono text-xs text-text-tertiary">
            Redirecting to case…
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] text-text-tertiary">
        <Link href="/" className="hover:text-text-secondary">
          Registry
        </Link>
        <span>/</span>
        {post?.case_number ? (
          <>
            <Link
              href={`/case/${post.case_number.toLowerCase()}`}
              className="hover:text-text-secondary"
            >
              {post.case_number}
            </Link>
            <span>/</span>
          </>
        ) : null}
        <span>Edit</span>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <span className="stamp stamp-red">Edit Case</span>
          {post?.case_number && (
            <span className="font-mono text-[10px] text-text-tertiary">
              {post.case_number}
            </span>
          )}
        </div>
        <h1 className="font-serif text-3xl font-normal text-text-primary">
          Amend Your Report
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Changes to approved cases will be re-queued for moderation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={20}
            maxLength={200}
            className="w-full rounded border border-border-default bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none"
          />
        </div>

        {/* Outcome */}
        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            What Happened
          </label>
          <textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            required
            minLength={100}
            rows={6}
            className="w-full resize-none rounded border border-border-default bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none"
          />
        </div>

        {/* Prompt */}
        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Prompt / Instruction{" "}
            <span className="normal-case tracking-normal text-text-tertiary">
              (optional)
            </span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            maxLength={2000}
            className="w-full resize-none rounded border border-border-default bg-bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none"
          />
        </div>

        {/* Damage level */}
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Severity — {DAMAGE_LABELS[damageLevel]}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setDamageLevel(lvl)}
                className={[
                  "flex h-9 w-9 items-center justify-center rounded border font-mono text-sm transition-colors",
                  lvl === damageLevel
                    ? "border-accent-red bg-accent-red/10 text-accent-red"
                    : "border-border-default bg-bg-surface text-text-tertiary hover:border-border-strong",
                ].join(" ")}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Estimated cost */}
        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Estimated Cost (USD){" "}
            <span className="normal-case tracking-normal text-text-tertiary">
              (optional)
            </span>
          </label>
          <input
            type="number"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            min={0}
            placeholder="0"
            className="w-full rounded border border-border-default bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => {
              const active = selectedTags.includes(tag.slug);
              return (
                <button
                  key={tag.slug}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className={[
                    "rounded border px-2.5 py-1 font-mono text-[11px] transition-colors",
                    active
                      ? "border-accent-red bg-accent-red/10 text-accent-red"
                      : "border-border-default bg-bg-surface text-text-tertiary hover:border-border-strong",
                  ].join(" ")}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Attribution */}
        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-2">
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
              value={authorHandle}
              onChange={(e) => setAuthorHandle(e.target.value)}
              placeholder="Your handle or company"
              className="w-full rounded border border-border-default bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-red focus:outline-none"
            />
          )}
        </div>

        {error && <p className="font-mono text-xs text-accent-red">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded border border-accent-red bg-accent-red/10 px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-accent-red transition-colors hover:bg-accent-red/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {post?.case_number && (
            <Link
              href={`/case/${post.case_number.toLowerCase()}`}
              className="font-mono text-xs text-text-tertiary hover:text-text-primary"
            >
              Cancel
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
