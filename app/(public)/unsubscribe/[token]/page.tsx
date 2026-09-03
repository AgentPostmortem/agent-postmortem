import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ArrowLeftIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Unsubscribe — AgentPostmortem",
  robots: { index: false },
};

export default async function UnsubscribePage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed" })
    .eq("unsubscribe_token", params.token)
    .select("email")
    .maybeSingle();

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
      <h1 className="font-sans text-2xl font-bold tracking-tight text-text-primary">
        {data ? "Unsubscribed" : "Link not found"}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
        {data
          ? `${data.email} has been removed from the AgentPostmortem newsletter. You won't receive any more digests.`
          : "This unsubscribe link is invalid or has already been used."}
      </p>
      <a
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-text-tertiary hover:text-text-primary"
      >
        <ArrowLeftIcon size={10} /> Back to the registry
      </a>
    </div>
  );
}
