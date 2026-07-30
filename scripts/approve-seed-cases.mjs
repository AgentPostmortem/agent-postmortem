// Auto-approve ONLY curated registry-seed cases that meet quality restrictions.
// Replicates the admin PATCH approval logic (sequential APM-#### assignment).
// Never touches organic public submissions. Run: node scripts/approve-seed-cases.mjs
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const SEED_HANDLE = "registry-seed";

// Restriction gate: only curated seed cases that are well-formed and sourced.
function qualifies(p) {
  const reasons = [];
  if (p.submitter_handle !== SEED_HANDLE) reasons.push("not registry-seed");
  if (!p.source_url || !/^https?:\/\//i.test(p.source_url)) reasons.push("no http(s) source_url");
  if (!Array.isArray(p.verified_facts) || p.verified_facts.length < 1) reasons.push("no verified_facts");
  if (!p.title || p.title.length < 20 || p.title.length > 200) reasons.push("title length");
  if (!p.outcome || p.outcome.length < 100) reasons.push("outcome too short");
  if (p.status !== "pending") reasons.push(`status=${p.status}`);
  return reasons;
}

const { data: candidates, error: selErr } = await supabase
  .from("posts")
  .select("id, title, status, submitter_handle, source_url, verified_facts, outcome, submitter_email, case_number")
  .eq("status", "pending")
  .eq("submitter_handle", SEED_HANDLE)
  .order("created_at", { ascending: true });

if (selErr) {
  console.error("select failed:", selErr.message);
  process.exit(1);
}

console.log(`Found ${candidates.length} pending registry-seed candidates.\n`);

let approved = 0,
  skipped = 0;

for (const p of candidates) {
  const reasons = qualifies(p);
  if (reasons.length) {
    console.log(`  ↩ skip — ${p.title.slice(0, 55)} [${reasons.join(", ")}]`);
    skipped++;
    continue;
  }

  // Sequential case number, mirroring app/api/admin/posts/[id]/route.ts
  let caseNumber = p.case_number;
  if (!caseNumber) {
    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");
    caseNumber = `APM-${((count ?? 0) + 1).toString().padStart(4, "0")}`;
  }

  const { data, error } = await supabase
    .from("posts")
    .update({ status: "approved", case_number: caseNumber })
    .eq("id", p.id)
    .eq("status", "pending") // guard: don't double-process
    .select("case_number, title")
    .single();

  if (error || !data) {
    console.error(`  ✗ approve failed — ${p.title.slice(0, 50)}: ${error?.message}`);
    continue;
  }
  approved++;
  console.log(`  ✓ ${data.case_number} — ${data.title.slice(0, 58)}`);
}

console.log(`\nDone. approved=${approved} skipped=${skipped} (of ${candidates.length})`);
