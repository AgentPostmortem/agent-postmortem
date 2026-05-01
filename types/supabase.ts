/**
 * Supabase TypeScript types — kept in sync with supabase/migrations/0001_init.sql.
 * Regenerate after schema changes with:
 *   npx supabase gen types typescript --project-id <id> > types/supabase.ts
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
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          case_number: string;
          agent_id: string;
          title: string;
          prompt: string | null;
          outcome: string;
          damage_level: 1 | 2 | 3 | 4 | 5;
          estimated_cost_usd: number | null;
          screenshot_urls: string[];
          submitter_handle: string | null;
          submitter_email: string | null;
          edit_token_hash: string;
          edit_token_expires_at: string | null;
          ip_hash: string;
          is_anonymous: boolean;
          vote_score: number;
          status: "pending" | "approved" | "rejected";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          case_number?: string;
          agent_id: string;
          title: string;
          prompt?: string | null;
          outcome: string;
          damage_level: 1 | 2 | 3 | 4 | 5;
          estimated_cost_usd?: number | null;
          screenshot_urls?: string[];
          submitter_handle?: string | null;
          submitter_email?: string | null;
          edit_token_hash?: string;
          edit_token_expires_at?: string | null;
          ip_hash: string;
          is_anonymous?: boolean;
          vote_score?: number;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          case_number?: string;
          agent_id?: string;
          title?: string;
          prompt?: string | null;
          outcome?: string;
          damage_level?: 1 | 2 | 3 | 4 | 5;
          estimated_cost_usd?: number | null;
          screenshot_urls?: string[];
          submitter_handle?: string | null;
          submitter_email?: string | null;
          edit_token_hash?: string;
          edit_token_expires_at?: string | null;
          ip_hash?: string;
          is_anonymous?: boolean;
          vote_score?: number;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
        Relationships: [];
      };
      post_tags: {
        Row: { post_id: string; tag_id: string };
        Insert: { post_id: string; tag_id: string };
        Update: { post_id?: string; tag_id?: string };
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
      rate_limits: {
        Row: {
          key: string;
          window_started_at: string;
          count: number;
          updated_at: string;
        };
        Insert: {
          key: string;
          window_started_at: string;
          count: number;
          updated_at?: string;
        };
        Update: {
          key?: string;
          window_started_at?: string;
          count?: number;
          updated_at?: string;
        };
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      consume_rate_limit: {
        Args: {
          p_key: string;
          p_window_seconds: number;
          p_max_requests: number;
        };
        Returns: {
          allowed: boolean;
          remaining: number;
          reset_at: string;
          current_count: number;
        }[];
      };
    };
    Enums: Record<string, never>;
  };
};
