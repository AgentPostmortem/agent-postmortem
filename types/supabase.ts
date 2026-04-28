/**
 * Auto-generated Supabase TypeScript types.
 *
 * In production, regenerate this file with:
 *   npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
 *
 * The stub below ensures TypeScript compilation succeeds before generation.
 */
export type Database = {
  public: {
    Tables: {
      agents: {
        Row: {
          id: string;
          slug: string;
          name: string;
          company: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          company: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          company?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          case_number: string;
          title: string;
          agent_id: string;
          outcome: string;
          prompt: string | null;
          damage_level: number;
          estimated_cost_usd: number | null;
          vote_score: number;
          is_anonymous: boolean;
          author_handle: string | null;
          ip_hash: string;
          status: "pending" | "approved" | "rejected";
          screenshots: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          case_number?: string;
          title: string;
          agent_id: string;
          outcome: string;
          prompt?: string | null;
          damage_level: number;
          estimated_cost_usd?: number | null;
          vote_score?: number;
          is_anonymous?: boolean;
          author_handle?: string | null;
          ip_hash: string;
          status?: "pending" | "approved" | "rejected";
          screenshots?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          case_number?: string;
          title?: string;
          agent_id?: string;
          outcome?: string;
          prompt?: string | null;
          damage_level?: number;
          estimated_cost_usd?: number | null;
          vote_score?: number;
          is_anonymous?: boolean;
          author_handle?: string | null;
          ip_hash?: string;
          status?: "pending" | "approved" | "rejected";
          screenshots?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          slug: string;
          label: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          label: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          label?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          post_id: string;
          ip_hash: string;
          direction: "up" | "down";
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          ip_hash: string;
          direction: "up" | "down";
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          ip_hash?: string;
          direction?: "up" | "down";
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          body: string;
          is_anonymous: boolean;
          author_handle: string | null;
          ip_hash: string;
          status: "visible" | "hidden" | "removed";
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          body: string;
          is_anonymous?: boolean;
          author_handle?: string | null;
          ip_hash: string;
          status?: "visible" | "hidden" | "removed";
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          body?: string;
          is_anonymous?: boolean;
          author_handle?: string | null;
          ip_hash?: string;
          status?: "visible" | "hidden" | "removed";
          created_at?: string;
        };
      };
      team_waitlist: {
        Row: {
          id: string;
          email: string;
          company: string;
          role: string;
          use_case: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          company: string;
          role: string;
          use_case?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          company?: string;
          role?: string;
          use_case?: string | null;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          post_id: string;
          reason: string;
          ip_hash: string;
          resolved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          reason: string;
          ip_hash: string;
          resolved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          reason?: string;
          ip_hash?: string;
          resolved?: boolean;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
