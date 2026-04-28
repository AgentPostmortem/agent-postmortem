"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type SubmissionStatus = "pending" | "approved" | "rejected";

interface PendingSubmission {
  id: string;
  caseNumber: string;
  title: string;
  agentName: string;
  damageLevel: number;
  submittedAt: string;
  status: SubmissionStatus;
  isAnonymous: boolean;
  outcome: string;
  tags: string[];
}

const MOCK_SUBMISSIONS: PendingSubmission[] = [
  {
    id: "s1",
    caseNumber: "APM-0004",
    title: "Replit agent looped infinite API calls causing $3k bill",
    agentName: "Replit",
    damageLevel: 3,
    submittedAt: "2024-11-20T11:30:00Z",
    status: "pending",
    isAnonymous: true,
    outcome:
      "Agent was asked to debug a rate-limiting issue. It entered a recursive test loop that made 180,000 API calls in 4 hours.",
    tags: ["expensive-mistake", "code-disaster"],
  },
  {
    id: "s2",
    caseNumber: "APM-0005",
    title: "Claude agent sent internal memo to all-company Slack",
    agentName: "Claude",
    damageLevel: 2,
    submittedAt: "2024-11-19T09:15:00Z",
    status: "pending",
    isAnonymous: false,
    outcome:
      "Agent drafted an internal memo and was asked to send it to the 'leadership channel'. It resolved this as #general.",
    tags: ["wrong-recipient", "social-blunder"],
  },
];

function DamagePip({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={[
            "h-2 w-2 rounded-sm",
            i < level ? "bg-accent-red" : "bg-border-strong",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [submissions, setSubmissions] =
    useState<PendingSubmission[]>(MOCK_SUBMISSIONS);
  const [selected, setSelected] = useState<PendingSubmission | null>(null);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HINT || password.length > 4) {
      // In production: validate against ADMIN_PASSWORD via API route
      setAuthenticated(true);
    } else {
      setAuthError("Incorrect password.");
    }
  }

  function handleAction(id: string, action: "approved" | "rejected") {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: action } : s))
    );
    setSelected(null);
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-canvas px-4">
        <div className="w-full max-w-sm">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-text-tertiary text-center">
            Admin Access
          </p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded border border-border-default bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-accent-red focus:outline-none"
              autoFocus
            />
            {authError && (
              <p className="text-xs text-accent-red">{authError}</p>
            )}
            <Button type="submit" variant="primary" className="w-full">
              Enter
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const pending = submissions.filter((s) => s.status === "pending");
  const reviewed = submissions.filter((s) => s.status !== "pending");

  return (
    <div className="min-h-screen bg-bg-canvas">
      <div className="border-b border-border-default bg-bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent-red">
              Admin
            </p>
            <h1 className="font-serif text-xl text-text-primary">
              Moderation Dashboard
            </h1>
          </div>
          <div className="flex gap-4 font-mono text-sm text-text-tertiary">
            <span>
              <span className="text-text-primary">{pending.length}</span>{" "}
              pending
            </span>
            <span>
              <span className="text-text-primary">{reviewed.length}</span>{" "}
              reviewed
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Queue */}
          <div>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-text-tertiary">
              Pending Review
            </h2>
            <div className="space-y-2">
              {pending.length === 0 && (
                <p className="py-6 text-center text-sm text-text-tertiary">
                  Queue is empty.
                </p>
              )}
              {pending.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelected(sub)}
                  className={[
                    "w-full rounded border p-4 text-left transition-colors",
                    selected?.id === sub.id
                      ? "border-accent-red bg-accent-red-soft"
                      : "border-border-default bg-bg-surface hover:border-border-strong",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs text-text-tertiary">
                        {sub.caseNumber}
                      </span>
                      <p className="mt-0.5 text-sm text-text-primary line-clamp-2">
                        {sub.title}
                      </p>
                      <p className="mt-1 font-mono text-xs text-text-tertiary">
                        {sub.agentName} ·{" "}
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <DamagePip level={sub.damageLevel} />
                  </div>
                </button>
              ))}
            </div>

            {reviewed.length > 0 && (
              <>
                <h2 className="mb-3 mt-6 font-mono text-xs uppercase tracking-widest text-text-tertiary">
                  Recently Reviewed
                </h2>
                <div className="space-y-2 opacity-60">
                  {reviewed.map((sub) => (
                    <div
                      key={sub.id}
                      className="rounded border border-border-default bg-bg-surface p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">
                          {sub.title.substring(0, 60)}…
                        </span>
                        <Badge
                          variant={
                            sub.status === "approved" ? "success" : "danger"
                          }
                        >
                          {sub.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Detail panel */}
          <div>
            {selected ? (
              <div className="rounded border border-border-default bg-bg-surface p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs text-text-tertiary">
                      {selected.caseNumber}
                    </p>
                    <h3 className="mt-1 font-serif text-lg text-text-primary">
                      {selected.title}
                    </h3>
                  </div>
                  <DamagePip level={selected.damageLevel} />
                </div>

                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                      Agent
                    </dt>
                    <dd className="mt-0.5 text-text-secondary">
                      {selected.agentName}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                      Attribution
                    </dt>
                    <dd className="mt-0.5 text-text-secondary">
                      {selected.isAnonymous ? "Anonymous" : "Named"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                      Tags
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-1">
                      {selected.tags.map((tag) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                      Outcome
                    </dt>
                    <dd className="mt-0.5 text-text-secondary leading-relaxed">
                      {selected.outcome}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant="primary"
                    onClick={() => handleAction(selected.id, "approved")}
                    className="flex-1"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleAction(selected.id, "rejected")}
                    className="flex-1 border border-border-default text-accent-red hover:bg-accent-red-soft"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded border border-dashed border-border-default text-text-tertiary">
                <p className="font-mono text-sm">Select a case to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
