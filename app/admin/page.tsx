"use client";

import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type PostStatus = "pending" | "approved" | "rejected";

interface AdminPost {
  id: string;
  case_number: string | null;
  title: string;
  outcome: string;
  prompt: string | null;
  damage_level: number;
  estimated_cost_usd: number | null;
  is_anonymous: boolean;
  submitter_handle: string | null;
  submitter_email: string | null;
  vote_score: number;
  status: PostStatus;
  created_at: string;
  agents: { id: string; name: string; slug: string } | null;
  post_tags: {
    tag_id: string;
    tags: { id: string; slug: string; label: string } | null;
  }[];
}

interface TabCounts {
  pending: number;
  approved: number;
  rejected: number;
}

function DamagePip({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5 shrink-0">
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
  const [password, setPassword] = useState("");
  const [authedPassword, setAuthedPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [tab, setTab] = useState<PostStatus>("pending");
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [counts, setCounts] = useState<TabCounts>({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [selected, setSelected] = useState<AdminPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    outcome: "",
    damage_level: 3,
  });

  const fetchPosts = useCallback(async (status: PostStatus, pwd: string) => {
    setLoading(true);
    setSelected(null);
    try {
      const res = await fetch(`/api/admin/posts?status=${status}`, {
        headers: { "x-admin-password": pwd },
      });
      if (res.status === 401) {
        setAuthenticated(false);
        setAuthError("Session expired.");
        return;
      }
      if (!res.ok) {
        console.error("[admin] fetch failed:", res.status, await res.text());
        return;
      }
      const json = await res.json();
      setPosts(json.posts ?? []);
      setCounts(json.counts ?? { pending: 0, approved: 0, rejected: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Only re-fetch when the tab changes after auth — not on initial auth
  const [initialAuthDone, setInitialAuthDone] = useState(false);
  useEffect(() => {
    if (authenticated && initialAuthDone) {
      fetchPosts(tab, authedPassword);
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin/posts?status=pending", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      const json = await res.json();
      setAuthedPassword(password);
      setPosts(json.posts ?? []);
      setCounts(json.counts ?? { pending: 0, approved: 0, rejected: 0 });
      setInitialAuthDone(true);
      setAuthenticated(true);
    } else {
      setAuthError("Incorrect password.");
    }
  }

  async function handleResendToken(postId: string) {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}/resend-token`, {
        method: "POST",
        headers: { "x-admin-password": authedPassword },
      });
      if (res.ok) alert("Edit link resent.");
      else alert("Failed to resend.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAction(id: string, status: "approved" | "rejected") {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": authedPassword,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchPosts(tab, authedPassword);
      }
    } finally {
      setActionLoading(false);
    }
  }

  async function handleEdit() {
    if (!selected) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${selected.id}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": authedPassword,
        },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditing(false);
        await fetchPosts(tab, authedPassword);
      }
    } finally {
      setActionLoading(false);
    }
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-canvas px-4">
        <div className="w-full max-w-sm">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent-red text-center">
            AgentPostmortem
          </p>
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

  const tabs: { key: PostStatus; label: string }[] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="min-h-screen bg-bg-canvas">
      {/* Header */}
      <div className="border-b border-border-default bg-bg-surface px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-accent-red">
                Admin
              </p>
              <h1 className="font-serif text-xl text-text-primary">
                Moderation Dashboard
              </h1>
            </div>
            <div className="flex gap-3 font-mono text-xs sm:gap-6 sm:text-sm">
              <span className="text-text-tertiary">
                <span className="text-yellow-400">{counts.pending}</span>
                <span className="ml-1 hidden sm:inline">pending</span>
              </span>
              <span className="text-text-tertiary">
                <span className="text-green-400">{counts.approved}</span>
                <span className="ml-1 hidden sm:inline">approved</span>
              </span>
              <span className="text-text-tertiary">
                <span className="text-accent-red">{counts.rejected}</span>
                <span className="ml-1 hidden sm:inline">rejected</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-default bg-bg-surface">
        <div className="mx-auto flex max-w-6xl overflow-x-auto scrollbar-none">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={[
                "shrink-0 border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors sm:px-5",
                tab === key
                  ? "border-accent-red text-text-primary"
                  : "border-transparent text-text-tertiary hover:text-text-secondary",
              ].join(" ")}
            >
              {label}
              <span className="ml-2 text-text-tertiary">{counts[key]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* Queue */}
          <div>
            {loading ? (
              <p className="py-12 text-center font-mono text-sm text-text-tertiary">
                Loading…
              </p>
            ) : posts.length === 0 ? (
              <p className="py-12 text-center font-mono text-sm text-text-tertiary">
                No {tab} submissions.
              </p>
            ) : (
              <div className="space-y-2">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => {
                      setSelected(post);
                      setEditForm({
                        title: post.title,
                        outcome: post.outcome,
                        damage_level: post.damage_level,
                      });
                      setEditing(false);
                    }}
                    className={[
                      "w-full rounded border p-4 text-left transition-colors",
                      selected?.id === post.id
                        ? "border-accent-red bg-accent-red/5"
                        : "border-border-default bg-bg-surface hover:border-border-strong",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-text-tertiary">
                            {post.case_number ?? "—"}
                          </span>
                          {post.is_anonymous && (
                            <span className="font-mono text-xs text-text-tertiary">
                              · anon
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-text-primary line-clamp-2">
                          {post.title}
                        </p>
                        <p className="mt-1 font-mono text-xs text-text-tertiary">
                          {post.agents?.name ?? "Unknown"} ·{" "}
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <DamagePip level={post.damage_level} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            {selected ? (
              <div className="rounded border border-border-default bg-bg-surface p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-xs text-text-tertiary">
                        {selected.case_number ?? "Unassigned"}
                      </p>
                      <button
                        onClick={() => setEditing((e) => !e)}
                        className="shrink-0 rounded border border-border-default px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:border-accent-red hover:text-accent-red"
                      >
                        {editing ? "Cancel" : "Edit fields"}
                      </button>
                    </div>
                    {editing ? (
                      <input
                        className="mt-1 w-full rounded border border-border-default bg-bg-elevated px-3 py-1.5 text-sm text-text-primary focus:border-accent-red focus:outline-none"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, title: e.target.value }))
                        }
                      />
                    ) : (
                      <h3 className="mt-1 font-serif text-lg leading-snug text-text-primary">
                        {selected.title}
                      </h3>
                    )}
                  </div>
                  <DamagePip
                    level={
                      editing ? editForm.damage_level : selected.damage_level
                    }
                  />
                </div>

                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                      Agent
                    </dt>
                    <dd className="mt-0.5 text-text-secondary">
                      {selected.agents?.name ?? "—"}
                    </dd>
                  </div>

                  <div className="flex gap-6">
                    <div>
                      <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                        Severity
                      </dt>
                      <dd className="mt-0.5 text-text-secondary">
                        {selected.damage_level} / 5
                      </dd>
                    </div>
                    {selected.estimated_cost_usd != null && (
                      <div>
                        <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                          Est. Cost
                        </dt>
                        <dd className="mt-0.5 text-text-secondary">
                          ${selected.estimated_cost_usd.toLocaleString()}
                        </dd>
                      </div>
                    )}
                  </div>

                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                      Attribution
                    </dt>
                    <dd className="mt-0.5 text-text-secondary">
                      {selected.is_anonymous
                        ? "Anonymous"
                        : (selected.submitter_handle ?? "Named (no handle)")}
                      {selected.submitter_email && (
                        <span className="ml-2 text-text-tertiary">
                          ·{" "}
                          <a
                            href={`mailto:${selected.submitter_email}`}
                            className="hover:text-accent-red hover:underline"
                          >
                            {selected.submitter_email}
                          </a>
                        </span>
                      )}
                    </dd>
                  </div>

                  {selected.post_tags.length > 0 && (
                    <div>
                      <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                        Tags
                      </dt>
                      <dd className="mt-1 flex flex-wrap gap-1">
                        {selected.post_tags.map(({ tags }) =>
                          tags ? (
                            <Badge key={tags.id} variant="default">
                              {tags.label}
                            </Badge>
                          ) : null,
                        )}
                      </dd>
                    </div>
                  )}

                  {editing && (
                    <div>
                      <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                        Damage Level
                      </dt>
                      <dd className="mt-1">
                        <select
                          className="rounded border border-border-default bg-bg-elevated px-2 py-1 text-sm text-text-primary focus:border-accent-red focus:outline-none"
                          value={editForm.damage_level}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              damage_level: Number(e.target.value),
                            }))
                          }
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </dd>
                    </div>
                  )}

                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                      Outcome
                    </dt>
                    {editing ? (
                      <dd className="mt-1">
                        <textarea
                          className="w-full rounded border border-border-default bg-bg-elevated px-3 py-2 text-sm text-text-primary leading-relaxed focus:border-accent-red focus:outline-none scrollbar-none"
                          rows={6}
                          value={editForm.outcome}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              outcome: e.target.value,
                            }))
                          }
                        />
                        <Button
                          variant="primary"
                          onClick={handleEdit}
                          disabled={actionLoading}
                          className="mt-2"
                        >
                          {actionLoading ? "Saving…" : "Save changes"}
                        </Button>
                      </dd>
                    ) : (
                      <dd className="mt-1 text-text-secondary leading-relaxed max-h-40 overflow-y-auto scrollbar-none">
                        {selected.outcome}
                      </dd>
                    )}
                  </div>

                  {selected.prompt && (
                    <div>
                      <dt className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                        Prompt
                      </dt>
                      <dd className="mt-1 text-text-secondary leading-relaxed max-h-32 overflow-y-auto scrollbar-none text-xs font-mono bg-bg-elevated rounded p-2">
                        {selected.prompt}
                      </dd>
                    </div>
                  )}
                </dl>

                {tab === "pending" && (
                  <div className="mt-6 flex gap-3">
                    <Button
                      variant="primary"
                      onClick={() => handleAction(selected.id, "approved")}
                      disabled={actionLoading}
                      className="flex-1"
                    >
                      {actionLoading ? "…" : "Approve"}
                    </Button>
                    <button
                      onClick={() => handleAction(selected.id, "rejected")}
                      disabled={actionLoading}
                      className="flex-1 rounded border border-border-default px-4 py-2 text-sm text-accent-red transition-colors hover:bg-accent-red/5 disabled:opacity-50"
                    >
                      {actionLoading ? "…" : "Reject"}
                    </button>
                  </div>
                )}

                {selected.submitter_email && (
                  <div className="mt-3">
                    <button
                      onClick={() => handleResendToken(selected.id)}
                      disabled={actionLoading}
                      className="rounded border border-border-default px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-secondary transition-colors hover:border-accent-red hover:text-accent-red disabled:opacity-50"
                    >
                      Resend Edit Link
                    </button>
                  </div>
                )}

                {tab !== "pending" && (
                  <div className="mt-6">
                    <Badge variant={tab === "approved" ? "success" : "danger"}>
                      {tab}
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded border border-dashed border-border-default">
                <p className="font-mono text-sm text-text-tertiary">
                  Select a case to review
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
