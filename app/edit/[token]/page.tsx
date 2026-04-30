import { createHash } from "crypto";
import { notFound } from "next/navigation";
import { EditCaseForm } from "@/components/post/EditCaseForm";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SubmitFormValues } from "@/lib/schemas/submit";

interface PageProps {
  params: { token: string };
}

interface EditablePostRow {
  case_number: string | null;
  title: string;
  prompt: string | null;
  outcome: string;
  damage_level: 1 | 2 | 3 | 4 | 5;
  estimated_cost_usd: number | null;
  screenshot_urls: string[] | null;
  is_anonymous: boolean;
  submitter_handle: string | null;
  status: "pending" | "approved" | "rejected";
  agents: { slug: string | null } | null;
  post_tags: Array<{ tags: { slug: string | null } | null }> | null;
}

function getTokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export default async function EditSubmissionPage({ params }: PageProps) {
  const supabase = createSupabaseAdminClient();
  const tokenHash = getTokenHash(params.token);

  const [{ data: post }, { data: agents }, { data: tags }] = await Promise.all([
    supabase
      .from("posts")
      .select(
        `
        case_number,
        title,
        prompt,
        outcome,
        damage_level,
        estimated_cost_usd,
        screenshot_urls,
        is_anonymous,
        submitter_handle,
        status,
        agents ( slug ),
        post_tags ( tags ( slug ) )
      `,
      )
      .eq("edit_token_hash", tokenHash)
      .maybeSingle(),
    supabase.from("agents").select("slug, name, company").order("name"),
    supabase.from("tags").select("slug, label").order("label"),
  ]);

  const editablePost = post as EditablePostRow | null;

  if (!editablePost || !agents || !tags) {
    notFound();
  }

  const initialValues: SubmitFormValues = {
    agentSlug: editablePost.agents?.slug ?? "",
    title: editablePost.title,
    prompt: editablePost.prompt ?? undefined,
    outcome: editablePost.outcome,
    damageLevel: editablePost.damage_level,
    estimatedCostUsd: editablePost.estimated_cost_usd ?? undefined,
    tags:
      editablePost.post_tags
        ?.map((row) => row.tags?.slug)
        .filter((value): value is string => Boolean(value)) ?? [],
    isAnonymous: editablePost.is_anonymous,
    authorHandle: editablePost.submitter_handle ?? undefined,
    email: undefined,
    screenshots: editablePost.screenshot_urls ?? [],
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 border-b border-border-default pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-accent-red">
          Private Edit Link
        </p>
        <h1 className="mt-2 font-serif text-3xl text-text-primary sm:text-4xl">
          Update Your Submission
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
          Any edits you save will send the submission back through moderation
          review before it appears publicly again.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          <span>Status: {editablePost.status}</span>
          <span>
            Case: {editablePost.case_number ?? "Pending approval"}
          </span>
        </div>
      </div>

      <EditCaseForm
        token={params.token}
        initialValues={initialValues}
        post={{
          caseNumber: editablePost.case_number,
          status: editablePost.status,
          screenshotUrls: editablePost.screenshot_urls ?? [],
        }}
        agents={agents}
        tags={tags}
      />
    </div>
  );
}
