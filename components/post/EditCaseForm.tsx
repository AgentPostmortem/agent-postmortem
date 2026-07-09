"use client";

import { useState } from "react";
import type { SubmitFormValues } from "@/lib/schemas/submit";
import { cn } from "@/lib/utils/cn";

interface AgentOption {
  slug: string;
  name: string;
  company: string;
}

interface TagOption {
  slug: string;
  label: string;
}

interface EditablePost {
  caseNumber: string | null;
  status: "pending" | "approved" | "rejected";
  screenshotUrls: string[];
}

type FieldErrors = Partial<Record<keyof SubmitFormValues, string>>;

const inputBase =
  "w-full rounded border border-border-default bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder-text-tertiary transition-colors focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong";

export function EditCaseForm({
  token,
  initialValues,
  post,
  agents,
  tags,
}: {
  token: string;
  initialValues: SubmitFormValues;
  post: EditablePost;
  agents: AgentOption[];
  tags: TagOption[];
}) {
  const [form, setForm] = useState<SubmitFormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );

  function set<K extends keyof SubmitFormValues>(
    key: K,
    value: SubmitFormValues[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function toggleTag(slug: string) {
    const currentTags = form.tags ?? [];
    set(
      "tags",
      currentTags.includes(slug)
        ? currentTags.filter((tag) => tag !== slug)
        : [...currentTags, slug],
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("saving");

    try {
      const response = await fetch(`/api/posts/edit/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.status === 400) {
        const body = (await response.json()) as {
          issues?: Array<{ path: Array<string | number>; message: string }>;
          error?: string;
        };
        const nextErrors: FieldErrors = {};
        body.issues?.forEach((issue) => {
          const field = issue.path[0] as keyof SubmitFormValues;
          if (!nextErrors[field]) {
            nextErrors[field] = issue.message;
          }
        });
        setErrors(nextErrors);
        setStatus("error");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded border border-border-default bg-bg-surface">
        <div className="border-b border-border-default bg-bg-elevated px-4 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Submission Details
          </span>
        </div>
        <div className="space-y-4 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Agent
              </label>
              <select
                value={form.agentSlug}
                onChange={(event) => set("agentSlug", event.target.value)}
                className={cn(inputBase, "appearance-none")}
              >
                <option value="">— Select agent —</option>
                {agents.map((agent) => (
                  <option key={agent.slug} value={agent.slug}>
                    {agent.name} ({agent.company})
                  </option>
                ))}
              </select>
              {errors.agentSlug ? (
                <p className="mt-1 font-mono text-[10px] text-accent-red">
                  {errors.agentSlug}
                </p>
              ) : null}
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Severity
              </label>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={form.damageLevel}
                onChange={(event) =>
                  set(
                    "damageLevel",
                    Number(
                      event.target.value,
                    ) as SubmitFormValues["damageLevel"],
                  )
                }
                className="mt-3 w-full accent-accent-red"
              />
              <p className="mt-2 font-mono text-xs text-text-secondary">
                Level {form.damageLevel} of 5
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
              className={inputBase}
            />
            {errors.title ? (
              <p className="mt-1 font-mono text-[10px] text-accent-red">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Prompt / Instruction
            </label>
            <textarea
              value={form.prompt ?? ""}
              onChange={(event) => set("prompt", event.target.value)}
              rows={4}
              className={cn(inputBase, "resize-y font-mono text-xs")}
            />
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              What happened
            </label>
            <textarea
              value={form.outcome}
              onChange={(event) => set("outcome", event.target.value)}
              rows={8}
              className={cn(inputBase, "resize-y")}
            />
            {errors.outcome ? (
              <p className="mt-1 font-mono text-[10px] text-accent-red">
                {errors.outcome}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
              Estimated Damage (USD)
            </label>
            <input
              type="number"
              min={0}
              value={form.estimatedCostUsd ?? ""}
              onChange={(event) =>
                set(
                  "estimatedCostUsd",
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
              className={inputBase}
            />
          </div>
        </div>
      </div>

      <div className="rounded border border-border-default bg-bg-surface">
        <div className="border-b border-border-default bg-bg-elevated px-4 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Classification
          </span>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = form.tags.includes(tag.slug);
              return (
                <button
                  key={tag.slug}
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className={cn(
                    "rounded border px-2.5 py-1 font-mono text-xs transition-all",
                    active
                      ? "border-accent-red bg-accent-red-soft text-accent-red-muted"
                      : "border-border-default text-text-tertiary hover:border-border-strong hover:text-text-secondary",
                  )}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
          {errors.tags ? (
            <p className="mt-2 font-mono text-[10px] text-accent-red">
              {errors.tags}
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded border border-border-default bg-bg-surface">
        <div className="border-b border-border-default bg-bg-elevated px-4 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Attribution
          </span>
        </div>
        <div className="space-y-4 p-4">
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={form.isAnonymous}
              onChange={(event) => set("isAnonymous", event.target.checked)}
              className="accent-accent-red"
            />
            Keep this submission anonymous
          </label>

          {!form.isAnonymous ? (
            <div>
              <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
                Handle or Company
              </label>
              <input
                type="text"
                value={form.authorHandle ?? ""}
                onChange={(event) => set("authorHandle", event.target.value)}
                className={inputBase}
              />
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded border border-border-default bg-bg-surface">
        <div className="border-b border-border-default bg-bg-elevated px-4 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            Evidence
          </span>
        </div>
        <div className="space-y-3 p-4">
          {post.screenshotUrls.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {post.screenshotUrls.map((src, index) => (
                <div key={src} className="space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Uploaded evidence ${index + 1}`}
                    className="rounded border border-border-default"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-tertiary">
              No screenshots attached.
            </p>
          )}
          <p className="font-mono text-[10px] text-text-tertiary">
            Screenshot replacement is not supported from this edit page yet. If
            you need evidence removed, email hello@agentpostmortem.com.
          </p>
        </div>
      </div>

      {status === "success" ? (
        <div className="rounded border border-border-default bg-bg-surface px-4 py-3">
          <p className="text-sm text-text-secondary">
            Changes saved. Your submission has been returned to the moderation
            queue for review.
          </p>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded border border-accent-red bg-accent-red-soft px-4 py-3">
          <p className="font-mono text-xs text-accent-red">
            We couldn&apos;t save your changes. Please review the form and try
            again.
          </p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "saving"}
        className="w-full rounded-full border border-accent-red bg-accent-red py-3 font-mono text-[11px] uppercase tracking-wider text-bg-canvas transition-all hover:border-accent-red-muted hover:bg-accent-red-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
