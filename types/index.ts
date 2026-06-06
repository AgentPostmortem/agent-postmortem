import type { SeverityLevel } from "@/lib/constants/severity";

/** A published case report */
export interface Post {
  id: string;
  caseNumber: string;
  title: string;
  agentSlug: string;
  agentName: string;
  /** Full description of what went wrong */
  outcome: string;
  /** The instruction or prompt that triggered the failure */
  prompt?: string;
  damageLevel: SeverityLevel;
  estimatedCostUsd: number | null;
  tags: string[];
  voteScore: number;
  createdAt: string;
  isAnonymous: boolean;
  authorHandle?: string;
  screenshots?: string[];
  sourceUrl?: string;
  sourceTitle?: string;
  sourcePublishedAt?: string;
  verifiedFacts: string[];
  unknowns: string[];
  lessons: string[];
}

/** A pending (unreviewed) submission */
export interface Submission {
  id: string;
  title: string;
  agentSlug: string;
  outcome: string;
  prompt?: string;
  damageLevel: SeverityLevel;
  estimatedCostUsd: number | null;
  tags: string[];
  isAnonymous: boolean;
  authorHandle?: string;
  /** SHA-256 HMAC of submitter IP — never the raw IP */
  ipHash: string;
  editTokenHash: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  screenshots?: string[];
}

/** An AI agent profile */
export interface Agent {
  slug: string;
  name: string;
  company: string;
  description: string;
  postCount?: number;
}

/** A taxonomy tag */
export interface Tag {
  slug: string;
  label: string;
  description: string;
  postCount?: number;
}

/** A vote on a post */
export interface Vote {
  id: string;
  postId: string;
  ipHash: string;
  direction: "up" | "down";
  createdAt: string;
}

/** A comment on a post */
export interface Comment {
  id: string;
  postId: string;
  body: string;
  isAnonymous: boolean;
  authorHandle?: string;
  ipHash: string;
  createdAt: string;
  status: "visible" | "hidden" | "removed";
}

/** Team waitlist entry */
export interface TeamWaitlistEntry {
  id: string;
  email: string;
  company: string;
  role: string;
  useCase?: string;
  createdAt: string;
}

/** Report / flag on a post */
export interface Report {
  id: string;
  postId: string;
  reason: string;
  ipHash: string;
  createdAt: string;
  resolved: boolean;
}
