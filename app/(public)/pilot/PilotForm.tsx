"use client";

import { useRef, useState, type FormEvent } from "react";
import {
  PILOT_LIMITS,
  validatePilot,
  type PilotErrors,
  type PilotField,
} from "@/lib/pilot/validation";

type Values = {
  name: string;
  email: string;
  company: string;
  track: string;
  workflow: string;
  website: string;
};

const EMPTY: Values = {
  name: "",
  email: "",
  company: "",
  track: "support",
  workflow: "",
  website: "",
};

const LABEL =
  "mb-1.5 block font-sans text-[13px] font-semibold text-text-secondary";
const HINT = "mt-1.5 text-[13px] leading-relaxed text-text-tertiary";

function fieldClass(invalid: boolean): string {
  return [
    "w-full rounded-lg border bg-bg-surface px-3.5 py-2.5 text-[15px] text-text-primary placeholder-text-tertiary transition-colors focus:outline-none",
    invalid
      ? "border-sev-critical focus:border-sev-critical"
      : "border-border-default focus:border-accent",
  ].join(" ");
}

export function PilotForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<PilotErrors>({});
  const [touched, setTouched] = useState<Partial<Record<PilotField, boolean>>>({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState("");
  const refs = useRef<
    Partial<
      Record<PilotField, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>
    >
  >({});

  function set<K extends keyof Values>(field: K, value: Values[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Revalidate live once a field has shown an error.
    if (field !== "website" && touched[field as PilotField]) {
      const result = validatePilot({ ...next, website: undefined });
      setErrors((prev) => ({
        ...prev,
        [field]: result.ok ? undefined : result.errors[field as PilotField],
      }));
    }
  }

  function touch(field: PilotField) {
    if (touched[field]) return;
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validatePilot({ ...values, website: undefined });
    if (!result.ok && result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  }

  function focusFirstInvalid(next: PilotErrors) {
    const order: PilotField[] = ["name", "email", "company", "track", "workflow"];
    for (const field of order) {
      if (next[field]) {
        setTouched((prev) => ({ ...prev, [field]: true }));
        refs.current[field]?.focus();
        break;
      }
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setFormError("");

    const result = validatePilot(values);
    if (!result.ok) {
      setErrors(result.errors);
      const allTouched = Object.fromEntries(
        Object.keys(result.errors).map((f) => [f, true]),
      ) as Partial<Record<PilotField, boolean>>;
      setTouched((prev) => ({ ...prev, ...allTouched }));
      focusFirstInvalid(result.errors);
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/pilot-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
        errors?: PilotErrors;
      };
      if (res.ok && data.ok) {
        setDone(data.message ?? "Application received.");
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        focusFirstInvalid(data.errors);
      } else {
        setFormError(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setFormError("Network error. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-xl border border-accent/40 bg-accent-soft p-6 text-center">
        <p className="font-sans text-lg font-bold text-text-primary">
          Application received.
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
          {done} If anything is unclear I will ask before starting anything.
        </p>
      </div>
    );
  }

  const workflowCount = values.workflow.trim().length;
  const describedBy = (field: PilotField, extra?: string) =>
    [errors[field] ? `pilot-${field}-error` : null, extra]
      .filter(Boolean)
      .join(" ") || undefined;

  const errorLine = (field: PilotField) =>
    touched[field] && errors[field] ? (
      <p id={`pilot-${field}-error`} role="alert" className="mt-1.5 text-[13px] font-medium text-sev-critical">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pilot-name" className={LABEL}>
            Your name
          </label>
          <input
            id="pilot-name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            maxLength={PILOT_LIMITS.name}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            onBlur={() => touch("name")}
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={describedBy("name")}
            ref={(el) => {
              refs.current.name = el;
            }}
            className={fieldClass(Boolean(touched.name && errors.name))}
          />
          {errorLine("name")}
        </div>
        <div>
          <label htmlFor="pilot-email" className={LABEL}>
            Work email
          </label>
          <input
            id="pilot-email"
            type="email"
            autoComplete="email"
            placeholder="ada@company.com"
            maxLength={PILOT_LIMITS.email}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            onBlur={() => touch("email")}
            aria-invalid={Boolean(touched.email && errors.email)}
            aria-describedby={describedBy("email")}
            ref={(el) => {
              refs.current.email = el;
            }}
            className={fieldClass(Boolean(touched.email && errors.email))}
          />
          {errorLine("email")}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pilot-company" className={LABEL}>
            Company or site <span className="font-normal text-text-tertiary">(optional)</span>
          </label>
          <input
            id="pilot-company"
            autoComplete="organization"
            placeholder="company.com"
            maxLength={PILOT_LIMITS.company}
            value={values.company}
            onChange={(e) => set("company", e.target.value)}
            onBlur={() => touch("company")}
            aria-invalid={Boolean(touched.company && errors.company)}
            aria-describedby={describedBy("company")}
            ref={(el) => {
              refs.current.company = el;
            }}
            className={fieldClass(Boolean(touched.company && errors.company))}
          />
          {errorLine("company")}
        </div>
        <div>
          <label htmlFor="pilot-track" className={LABEL}>
            Which track?
          </label>
          <select
            id="pilot-track"
            value={values.track}
            onChange={(e) => set("track", e.target.value)}
            onBlur={() => touch("track")}
            ref={(el) => {
              refs.current.track = el;
            }}
            className={fieldClass(false)}
          >
            <option value="support">Support triage</option>
            <option value="portal">Portal ops</option>
            <option value="unsure">Not sure yet</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="pilot-workflow" className={LABEL}>
          What repetitive workflow should the agent own?
        </label>
        <textarea
          id="pilot-workflow"
          rows={4}
          placeholder="e.g. Triage 60 Zendesk tickets a day, refund damaged-item orders under $25, pull Monday numbers from three supplier portals…"
          maxLength={PILOT_LIMITS.workflowMax}
          value={values.workflow}
          onChange={(e) => set("workflow", e.target.value)}
          onBlur={() => touch("workflow")}
          aria-invalid={Boolean(touched.workflow && errors.workflow)}
          aria-describedby={describedBy("workflow", "pilot-workflow-count")}
          ref={(el) => {
            refs.current.workflow = el;
          }}
          className={`${fieldClass(Boolean(touched.workflow && errors.workflow))} resize-y`}
        />
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            {errorLine("workflow") ?? (
              <p className={HINT}>A sentence or two is enough.</p>
            )}
          </div>
          <p
            id="pilot-workflow-count"
            className="shrink-0 text-[13px] tabular-nums text-text-tertiary"
            aria-live="polite"
          >
            {workflowCount}/{PILOT_LIMITS.workflowMax}
          </p>
        </div>
      </div>

      {/* Honeypot: invisible to humans, irresistible to bots. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor="pilot-website">Website</label>
        <input
          id="pilot-website"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          value={values.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-stone-900 px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-stone-900/10 transition-colors hover:bg-stone-700 disabled:opacity-50"
      >
        {sending ? "Sending…" : "Apply for the pilot"}
      </button>

      {formError && (
        <p role="alert" className="mt-3 text-sm font-medium text-sev-critical">
          {formError}
        </p>
      )}
      <p className="mt-3 text-[13px] leading-relaxed text-text-tertiary">
        No payment now. Half up front only when we agree on the workflow,
        second half only if it closes real work.
      </p>
    </form>
  );
}
