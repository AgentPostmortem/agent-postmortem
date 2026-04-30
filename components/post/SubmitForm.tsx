"use client";

import { useState, useCallback, useEffect } from "react";
import { z } from "zod";
import { submitSchema } from "@/lib/schemas/submit";
import { cn } from "@/lib/utils/cn";

interface AgentOption { slug: string; name: string; company: string }
interface TagOption { slug: string; label: string }

type FormData = Partial<z.infer<typeof submitSchema>>;
type FieldErrors = Partial<Record<keyof z.infer<typeof submitSchema>, string>>;
type SubmitStatus = "idle" | "submitting" | "success" | "error";

const DAMAGE_LABELS: Record<number, { label: string; desc: string }> = {
  1: { label: "Minimal",  desc: "Inconvenience, easily recovered" },
  2: { label: "Low",      desc: "Minor financial or time loss" },
  3: { label: "Moderate", desc: "Significant disruption or cost" },
  4: { label: "Severe",   desc: "Major financial or reputational harm" },
  5: { label: "Critical", desc: "Catastrophic, irreversible damage" },
};

function FormSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded border border-border-default bg-bg-surface">
      <div className="flex items-center gap-3 border-b border-border-default bg-bg-elevated px-4 py-2.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border-strong font-mono text-[10px] text-text-tertiary">
          {number}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-text-tertiary">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
      {children}
      {required && <span className="ml-1 text-accent-red">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 font-mono text-[10px] text-accent-red">{message}</p>;
}

const inputBase =
  "w-full rounded border border-border-default bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder-text-tertiary transition-colors focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong";

export function SubmitForm() {
  const [form, setForm] = useState<FormData>({ damageLevel: 3, isAnonymous: true });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [attribution, setAttribution] = useState<"anonymous" | "handle" | "company">("anonymous");
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [tags, setTags] = useState<TagOption[]>([]);

  useEffect(() => {
    fetch("/api/agents").then((r) => r.json()).then(setAgents).catch(() => {});
    fetch("/api/tags").then((r) => r.json()).then(setTags).catch(() => {});
  }, []);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  }

  function toggleTag(slug: string) {
    setSelectedTags((p) => p.includes(slug) ? p.filter((t) => t !== slug) : [...p, slug]);
  }

  const handleFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - screenshotFiles.length);
    setScreenshotFiles((p) => [...p, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadPreviews((p) => [...p, ev.target?.result as string]);
      reader.readAsDataURL(file);
    });
  }, [screenshotFiles]);

  function removeFile(i: number) {
    setScreenshotFiles((p) => p.filter((_, j) => j !== i));
    setUploadPreviews((p) => p.filter((_, j) => j !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, tags: selectedTags, isAnonymous: attribution === "anonymous" };
    const result = submitSchema.safeParse(payload);
    if (!result.success) {
      const fe: FieldErrors = {};
      result.error.issues.forEach((iss) => {
        const f = iss.path[0] as keyof FieldErrors;
        if (!fe[f]) fe[f] = iss.message;
      });
      setErrors(fe);
      return;
    }
    setStatus("submitting");
    try {
      const screenshotUrls: string[] = [];
      for (const file of screenshotFiles) {
        const r = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        if (r.ok) {
          const { url, publicUrl } = await r.json() as { url: string; publicUrl: string };
          await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
          screenshotUrls.push(publicUrl);
        }
      }
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, screenshotUrls }),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded border border-border-default bg-bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded border border-border-strong bg-bg-elevated">
          <span className="font-mono text-lg text-text-tertiary">✓</span>
        </div>
        <h2 className="font-serif text-xl text-text-primary">Case Filed</h2>
        <p className="mt-2 text-sm text-text-secondary">
          Your report is in the moderation queue. Once approved, it will be assigned a permanent case number.
        </p>
        {form.email && (
          <p className="mt-2 text-sm text-text-secondary">
            An edit token has been sent to <span className="font-mono text-text-primary">{form.email}</span>.
          </p>
        )}
      </div>
    );
  }

  const damageLevel = (form.damageLevel ?? 3) as 1 | 2 | 3 | 4 | 5;
  const damageInfo = DAMAGE_LABELS[damageLevel];

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>

      {/* Section 1: Agent */}
      <FormSection number="1" title="Agent Involved">
        <FieldLabel required>Which AI agent failed?</FieldLabel>
        <select
          value={form.agentSlug ?? ""}
          onChange={(e) => set("agentSlug", e.target.value)}
          className={cn(inputBase, "appearance-none")}
        >
          <option value="">— Select agent —</option>
          {agents.map((a) => (
            <option key={a.slug} value={a.slug}>{a.name} ({a.company})</option>
          ))}
        </select>
        <FieldError message={errors.agentSlug} />
      </FormSection>

      {/* Section 2: Summary */}
      <FormSection number="2" title="Summary">
        <div className="space-y-3">
          <div>
            <FieldLabel required>One-line title</FieldLabel>
            <input
              type="text"
              value={form.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Agent deleted production database during migration"
              maxLength={120}
              className={inputBase}
            />
            <div className="mt-1 flex justify-between">
              <FieldError message={errors.title} />
              <span className="ml-auto font-mono text-[10px] text-text-tertiary">
                {(form.title ?? "").length}/120
              </span>
            </div>
          </div>

          <div>
            <FieldLabel>Prompt / Instruction given <span className="normal-case tracking-normal text-text-tertiary">(optional)</span></FieldLabel>
            <textarea
              value={form.prompt ?? ""}
              onChange={(e) => set("prompt", e.target.value)}
              placeholder="Paste the exact instruction or prompt you gave the agent…"
              rows={3}
              className={cn(inputBase, "resize-none font-mono text-xs")}
            />
          </div>

          <div>
            <FieldLabel required>What actually happened?</FieldLabel>
            <textarea
              value={form.outcome ?? ""}
              onChange={(e) => set("outcome", e.target.value)}
              placeholder="Describe what the agent did, what went wrong, and the consequences…"
              rows={5}
              className={cn(inputBase, "resize-y")}
            />
            <FieldError message={errors.outcome} />
          </div>
        </div>
      </FormSection>

      {/* Section 3: Damage */}
      <FormSection number="3" title="Damage Assessment">
        <div className="space-y-4">
          <div>
            <FieldLabel required>Severity level</FieldLabel>
            <div className="space-y-2">
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={damageLevel}
                onChange={(e) => set("damageLevel", Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                className="w-full accent-accent-red"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={cn(
                        "h-1.5 w-6 rounded-full transition-colors",
                        n <= damageLevel
                          ? damageLevel >= 4 ? "bg-accent-red" : "bg-accent-red/50"
                          : "bg-border-strong"
                      )}
                    />
                  ))}
                </div>
                <div className="text-right">
                  <span className={cn("font-mono text-xs font-semibold", damageLevel >= 4 ? "text-accent-red" : "text-text-secondary")}>
                    {damageLevel} — {damageInfo.label}
                  </span>
                  <p className="font-mono text-[10px] text-text-tertiary">{damageInfo.desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <FieldLabel>Estimated financial damage <span className="normal-case tracking-normal text-text-tertiary">(optional)</span></FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-text-tertiary">$</span>
              <input
                type="number"
                min={0}
                value={form.estimatedCostUsd ?? ""}
                onChange={(e) => set("estimatedCostUsd", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="0"
                className={cn(inputBase, "pl-7")}
              />
            </div>
            <p className="mt-1 font-mono text-[10px] text-text-tertiary">USD. Best estimate — leave blank if unknown.</p>
          </div>
        </div>
      </FormSection>

      {/* Section 4: Tags */}
      <FormSection number="4" title="Classification Tags">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = selectedTags.includes(tag.slug);
            return (
              <button
                key={tag.slug}
                type="button"
                onClick={() => toggleTag(tag.slug)}
                className={cn(
                  "rounded border px-2.5 py-1 font-mono text-xs transition-all",
                  active
                    ? "border-accent-red bg-accent-red-soft text-accent-red"
                    : "border-border-default text-text-tertiary hover:border-border-strong hover:text-text-secondary"
                )}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
        <FieldError message={errors.tags} />
      </FormSection>

      {/* Section 5: Evidence */}
      <FormSection number="5" title="Evidence / Screenshots (optional)">
        {uploadPreviews.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {uploadPreviews.map((src, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Preview ${i + 1}`} className="h-20 w-20 rounded border border-border-default object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label="Remove screenshot"
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-bg-elevated border border-border-strong font-mono text-xs text-text-secondary hover:text-accent-red"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {screenshotFiles.length < 5 && (
          <div className="rounded border border-dashed border-border-strong bg-bg-elevated p-6 text-center">
            <input
              type="file"
              id="screenshot-upload"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="sr-only"
            />
            <label htmlFor="screenshot-upload" className="cursor-pointer">
              <div className="font-mono text-xs text-text-tertiary">
                Click to upload
                <span className="ml-1 text-text-secondary">PNG, JPG, WEBP</span>
              </div>
              <div className="mt-1 font-mono text-[10px] text-text-tertiary">
                Max 5MB per file · {5 - screenshotFiles.length} remaining
              </div>
            </label>
          </div>
        )}
      </FormSection>

      {/* Section 6: Attribution */}
      <FormSection number="6" title="Attribution">
        <div className="grid grid-cols-1 gap-2 xs:grid-cols-3 sm:grid-cols-3">
          {(["anonymous", "handle", "company"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setAttribution(opt);
                set("isAnonymous", opt === "anonymous");
              }}
              className={cn(
                "rounded border py-2.5 font-mono text-[11px] uppercase tracking-wider transition-all",
                attribution === opt
                  ? "border-accent-red bg-accent-red-soft text-accent-red"
                  : "border-border-default text-text-tertiary hover:border-border-strong"
              )}
            >
              {opt === "anonymous" ? "Anonymous" : opt === "handle" ? "@ Handle" : "Company"}
            </button>
          ))}
        </div>
        {attribution !== "anonymous" && (
          <div className="mt-3">
            <input
              type="text"
              value={form.authorHandle ?? ""}
              onChange={(e) => set("authorHandle", e.target.value)}
              placeholder={attribution === "handle" ? "@your_handle" : "Your Company Name"}
              className={inputBase}
            />
          </div>
        )}

        <div className="mt-4">
          <FieldLabel>Email <span className="normal-case tracking-normal text-text-tertiary">(optional — for edit token)</span></FieldLabel>
          <input
            type="email"
            value={form.email ?? ""}
            onChange={(e) => set("email", e.target.value || undefined)}
            placeholder="you@example.com"
            className={inputBase}
          />
          <FieldError message={errors.email} />
          <p className="mt-1 font-mono text-[10px] text-text-tertiary">
            Used only to send your edit token. Not stored after delivery.
          </p>
        </div>
      </FormSection>

      {/* Error */}
      {status === "error" && (
        <div className="rounded border border-accent-red bg-accent-red-soft px-4 py-3">
          <p className="font-mono text-xs text-accent-red">
            Submission failed. Please try again or email hello@agentpostmortem.com.
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded border border-accent-red bg-accent-red py-3 font-mono text-[11px] uppercase tracking-wider text-white transition-all hover:bg-accent-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Filing Case…" : "Submit Case Report →"}
      </button>

      <p className="text-center font-mono text-[10px] text-text-tertiary">
        All submissions are reviewed before publication · PII automatically redacted
      </p>
    </form>
  );
}
