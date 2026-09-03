"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type PostStatus = "pending" | "approved" | "rejected";
type CommentStatus = "visible" | "hidden" | "removed";

interface AdminComment {
  id: string;
  body: string;
  is_anonymous: boolean;
  author_handle: string | null;
  status: CommentStatus;
  created_at: string;
  post_id: string;
  posts: { case_number: string | null; title: string } | null;
}

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

interface AdminPostsResponse {
  posts?: AdminPost[];
  counts?: TabCounts;
}

interface AdminCommentsResponse {
  comments?: AdminComment[];
}

function DamagePip({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5 shrink-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={[
            "h-2 w-2 rounded-sm",
            i < level ? "bg-accent" : "bg-border-strong",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authedPassword, setAuthedPassword] = useState("");
  const authedPasswordRef = useRef("");
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
  const [adminTab, setAdminTab] = useState<"posts" | "comments">("posts");
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [commentStatus, setCommentStatus] = useState<CommentStatus>("visible");
  const [commentsLoading, setCommentsLoading] = useState(false);
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
      const json = (await res.json()) as AdminPostsResponse;
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
      fetchPosts(tab, authedPasswordRef.current);
    }
  }, [tab, authenticated, initialAuthDone, fetchPosts]);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin/posts?status=pending", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      const json = (await res.json()) as AdminPostsResponse;
      setAuthedPassword(password);
      authedPasswordRef.current = password;
      setPosts(json.posts ?? []);
      setCounts(json.counts ?? { pending: 0, approved: 0, rejected: 0 });
      setInitialAuthDone(true);
      setAuthenticated(true);
    } else {
      setAuthError("Incorrect password.");
    }
  }

  async function fetchComments(status: CommentStatus, pwd: string) {
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/admin/comments?status=${status}`, {
        headers: { "x-admin-password": pwd },
      });
      if (res.ok) {
        const json = (await res.json()) as AdminCommentsResponse;
        setComments(json.comments ?? []);
      }
    } finally {
      setCommentsLoading(false);
    }
  }

  async function handleCommentStatus(id: string, status: CommentStatus) {
    await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": authedPassword,
      },
      body: JSON.stringify({ id, status }),
    });
    await fetchComments(commentStatus, authedPassword);
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
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent text-center">
            AgentPostmortem
          </p>
          <p className="mb-6 font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary text-center">
            Admin Access
          </p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-sm border border-border-default bg-bg-surface px-4 py-2.5 text-sm text-text-primary placeholder-text-tertiary focus:border-accent focus:outline-none"
              autoFocus
            />
            {authError && <p className="text-xs text-accent">{authError}</p>}
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
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                Admin
              </p>
              <h1 className="font-sans text-xl font-bold tracking-tight text-text-primary">
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
                <span className="text-accent">{counts.rejected}</span>
                <span className="ml-1 hidden sm:inline">rejected</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top-level tabs: Posts / Comments */}
      <div className="border-b border-border-default bg-bg-surface">
        <div className="mx-auto flex max-w-6xl overflow-x-auto scrollbar-none">
          {(["posts", "comments"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setAdminTab(t);
                if (t === "comments")
                  fetchComments(commentStatus, authedPassword);
              }}
              className={[
                "shrink-0 border-b-2 px-5 py-3 font-mono text-xs uppercase tracking-widest transition-colors",
                adminTab === t
                  ? "border-accent text-text-primary"
                  : "border-transparent text-text-tertiary hover:text-text-secondary",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Posts sub-tabs */}
      {adminTab === "posts" && (
        <div className="border-b border-border-default bg-bg-surface">
          <div className="mx-auto flex max-w-6xl overflow-x-auto scrollbar-none">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={[
                  "shrink-0 border-b-2 px-4 py-3 font-mono text-xs uppercase tracking-widest transition-colors sm:px-5",
                  tab === key
                    ? "border-accent text-text-primary"
                    : "border-transparent text-text-tertiary hover:text-text-secondary",
                ].join(" ")}
              >
                {label}
                <span className="ml-2 text-text-tertiary">{counts[key]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {adminTab === "comments" && (
        <div className="mx-auto max-w-4xl p-4 sm:p-6">
          {/* Comment status filter */}
          <div className="mb-4 flex gap-2">
            {(["visible", "hidden", "removed"] as CommentStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setCommentStatus(s);
                  fetchComments(s, authedPassword);
                }}
                className={[
                  "rounded-sm border px-3 py-1.5 font-sans text-[13px] font-semibold transition-colors",
                  commentStatus === s
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border-default text-text-tertiary hover:text-text-secondary",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>

          {commentsLoading ? (
            <p className="py-12 text-center font-mono text-sm text-text-tertiary">
              Loading…
            </p>
          ) : comments.length === 0 ? (
            <p className="py-12 text-center font-mono text-sm text-text-tertiary">
              No {commentStatus} comments.
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="rounded-sm border border-border-default bg-bg-surface p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-sans text-xs text-text-tertiary">
                      <span>
                        {c.is_anonymous || !c.author_handle
                          ? "Anonymous"
                          : `@${c.author_handle}`}
                      </span>
                      <span>·</span>
                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                      {c.posts && (
                        <>
                          <span>·</span>
                          <span className="text-text-secondary">
                            {c.posts.case_number ?? "—"}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {c.status !== "visible" && (
                        <button
                          onClick={() => handleCommentStatus(c.id, "visible")}
                          className="rounded-sm border border-border-default px-2 py-0.5 font-mono text-[10px] text-text-secondary transition-colors hover:border-green-500 hover:text-green-400"
                        >
                          Restore
                        </button>
                      )}
                      {c.status !== "hidden" && (
                        <button
                          onClick={() => handleCommentStatus(c.id, "hidden")}
                          className="rounded-sm border border-border-default px-2 py-0.5 font-mono text-[10px] text-text-secondary transition-colors hover:border-yellow-500 hover:text-yellow-400"
                        >
                          Hide
                        </button>
                      )}
                      {c.status !== "removed" && (
                        <button
                          onClick={() => handleCommentStatus(c.id, "removed")}
                          className="rounded-sm border border-border-default px-2 py-0.5 font-mono text-[10px] text-text-secondary transition-colors hover:border-accent hover:text-accent"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-text-primary">{c.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {adminTab === "posts" && (
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
                        "w-full rounded-sm border p-4 text-left transition-colors",
                        selected?.id === post.id
                          ? "border-accent bg-accent/5"
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
                <div className="rounded-sm border border-border-default bg-bg-surface p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-xs text-text-tertiary">
                          {selected.case_number ?? "Unassigned"}
                        </p>
                        <button
                          onClick={() => setEditing((e) => !e)}
                          className="shrink-0 rounded-sm border border-border-default px-2 py-0.5 font-sans text-[13px] font-semibold text-text-secondary transition-colors hover:border-accent hover:text-accent"
                        >
                          {editing ? "Cancel" : "Edit fields"}
                        </button>
                      </div>
                      {editing ? (
                        <input
                          className="mt-1 w-full rounded-sm border border-border-default bg-bg-elevated px-3 py-1.5 text-sm text-text-primary focus:border-accent focus:outline-none"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              title: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        <h3 className="mt-1 font-sans text-lg font-semibold leading-snug text-text-primary">
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
                      <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                        Agent
                      </dt>
                      <dd className="mt-0.5 text-text-secondary">
                        {selected.agents?.name ?? "—"}
                      </dd>
                    </div>

                    <div className="flex gap-6">
                      <div>
                        <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                          Severity
                        </dt>
                        <dd className="mt-0.5 text-text-secondary">
                          {selected.damage_level} / 5
                        </dd>
                      </div>
                      {selected.estimated_cost_usd != null && (
                        <div>
                          <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                            Est. Cost
                          </dt>
                          <dd className="mt-0.5 text-text-secondary">
                            ${selected.estimated_cost_usd.toLocaleString()}
                          </dd>
                        </div>
                      )}
                    </div>

                    <div>
                      <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
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
                              className="hover:text-accent hover:underline"
                            >
                              {selected.submitter_email}
                            </a>
                          </span>
                        )}
                      </dd>
                    </div>

                    {selected.post_tags.length > 0 && (
                      <div>
                        <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
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
                        <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                          Damage Level
                        </dt>
                        <dd className="mt-1">
                          <select
                            className="rounded-sm border border-border-default bg-bg-elevated px-2 py-1 text-sm text-text-primary focus:border-accent focus:outline-none"
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
                      <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                        Outcome
                      </dt>
                      {editing ? (
                        <dd className="mt-1">
                          <textarea
                            className="w-full rounded-sm border border-border-default bg-bg-elevated px-3 py-2 text-sm text-text-primary leading-relaxed focus:border-accent focus:outline-none scrollbar-none"
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
                        <dt className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
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
                        className="flex-1 rounded-sm border border-border-default px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/5 disabled:opacity-50"
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
                        className="rounded-sm border border-border-default px-3 py-1.5 font-sans text-[13px] font-semibold text-text-secondary transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                      >
                        Resend Edit Link
                      </button>
                    </div>
                  )}

                  {tab !== "pending" && (
                    <div className="mt-6">
                      <Badge
                        variant={tab === "approved" ? "success" : "danger"}
                      >
                        {tab}
                      </Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-sm border border-dashed border-border-default">
                  <p className="font-mono text-sm text-text-tertiary">
                    Select a case to review
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
