// Seed REAL, source-cited AI-agent incidents as status=pending for moderation.
// Batch 3. Idempotent by source_url. Run: node scripts/seed-real-cases-batch3.mjs
import { createClient } from "@supabase/supabase-js";
import { createHash, createHmac } from "crypto";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const pepper = process.env.IP_HASH_PEPPER ?? "dev-pepper";
const SEED_HANDLE = "registry-seed";

const fakeIpHash = (s) =>
  createHmac("sha256", pepper).update(`seed-ip-${s}`).digest("hex");
const fakeTokenHash = (s) =>
  createHash("sha256").update(`seed-token-${s}`).digest("hex");

const CASES = [
  {
    agent: "other",
    title:
      "Meta pulled its Galactica science AI after three days when it generated authoritative-sounding false papers and fake citations",
    outcome:
      "In November 2022 Meta launched Galactica, a large language model meant to write and reason about science. Within days researchers showed it produced fluent but wrong content: fabricated papers, citations to authors and studies that do not exist, and some biased and offensive text, all delivered with the confident tone of a real paper. Meta took the public demo down after about three days.",
    prompt: null,
    damage: 2,
    cost: null,
    tags: ["hallucination", "social-blunder"],
    source_url: "https://www.siliconrepublic.com/machines/galactica-meta-ai-large-language-model",
    source_title: "Meta's 'biased' science-writing AI demo gets pulled after three days (Silicon Republic)",
    published: "2022-11-18T00:00:00Z",
    verified_facts: [
      "Meta launched Galactica in November 2022 as an AI for science",
      "It generated plausible-sounding but false content and fake citations",
      "Meta took the public demo down after about three days",
    ],
    unknowns: ["How many users relied on any of the false output"],
    lessons: [
      "Fluent, confident text is not evidence of correctness",
      "A science tool needs grounding and citation verification, not just fluency",
    ],
  },
  {
    agent: "other",
    title:
      "Glasgow's 'Willy's Chocolate Experience' was marketed with AI-generated images and a 15-page AI gibberish script, then collapsed on day one",
    outcome:
      "In February 2024 an unlicensed Willy Wonka style event in Glasgow was promoted with AI-generated images full of nonsense words like 'cartchy tuns' and a script an actor described as 15 pages of AI-generated gibberish. Families paid around 35 pounds and walked into a near-empty warehouse. Children cried, actors confronted the organizers mid-day, the event was shut down, and roughly 850 tickets were refunded as it went viral.",
    prompt: null,
    damage: 2,
    cost: null,
    tags: ["hallucination", "social-blunder"],
    source_url: "https://www.theregister.com/2024/02/28/wonka_ai_hellhole/",
    source_title: "That Willy Wonka experience was an AI hellhole (The Register)",
    published: "2024-02-28T00:00:00Z",
    verified_facts: [
      "The event was promoted with AI-generated images containing nonsense text",
      "An actor said the script was 15 pages of AI-generated gibberish",
      "The event was shut down on its first day and about 850 tickets were refunded",
    ],
    unknowns: ["Exact total refunded to attendees"],
    lessons: [
      "AI-generated marketing that promises an experience the operator cannot deliver invites refunds and reputational damage",
      "Someone has to check AI output against reality before customers pay",
    ],
  },
  {
    agent: "other",
    title:
      "Microsoft's AI attached a poll asking readers to vote on how a woman died, next to the news article about her death",
    outcome:
      "In October 2023 Microsoft Start ran an auto-generated 'Insight from AI' poll beside a Guardian article about a young woman's death, asking readers to vote on the cause: murder, accident, or suicide. Readers were appalled and blamed the Guardian's journalists. The Guardian's chief executive complained to Microsoft, which disabled AI-generated polls on news articles and opened an investigation.",
    prompt: null,
    damage: 2,
    cost: null,
    tags: ["social-blunder", "compliance-violation"],
    source_url: "https://www.axios.com/2023/10/31/guardian-microsoft-generative-ai-poll-death",
    source_title: "Microsoft launches probe after AI poll on woman's death sparks blowback (Axios)",
    published: "2023-10-31T00:00:00Z",
    verified_facts: [
      "Microsoft's AI placed a poll on the cause of a woman's death next to the article about it",
      "The Guardian complained and readers wrongly blamed its journalists",
      "Microsoft disabled AI-generated news polls and opened an investigation",
    ],
    unknowns: ["Whether other sensitive articles got similar polls before the shutoff"],
    lessons: [
      "Do not auto-attach generated interactive content to sensitive news without human review",
      "AI output published under a partner's byline becomes their reputational problem",
    ],
  },
  {
    agent: "other",
    title:
      "AI-written mushroom foraging guides sold on Amazon as human-authored, which experts warned could be 'life or death'",
    outcome:
      "In 2023 investigators found foraging and mushroom-identification guidebooks on Amazon that appear to be AI-generated, sold with human author names and no AI disclosure. Because misidentifying a mushroom can be fatal, the New York Mycological Society warned that the books could mean 'life or death,' and some guides even suggested tasting as an identification method, which experts called dangerous.",
    prompt: null,
    damage: 3,
    cost: null,
    tags: ["hallucination", "compliance-violation"],
    source_url: "https://www.404media.co/ai-generated-mushroom-foraging-books-amazon/",
    source_title: "'Life or Death:' AI-Generated Mushroom Foraging Books Are All Over Amazon (404 Media)",
    published: "2023-08-29T00:00:00Z",
    verified_facts: [
      "Foraging guides likely written by AI were sold on Amazon as human-authored",
      "Experts warned misidentification from bad guides could be fatal",
      "Some guides suggested tasting as an identification method, which is dangerous",
    ],
    unknowns: ["Whether anyone was harmed by following one of the guides"],
    lessons: [
      "Undisclosed AI content in safety-critical domains is a real hazard, not just spam",
      "High-stakes reference material needs verified human expertise",
    ],
  },
  {
    agent: "other",
    title:
      "Snapchat's My AI posted a mysterious Story on its own and stopped responding, panicking users",
    outcome:
      "In August 2023 Snapchat's My AI chatbot, which is not designed to post Stories, posted a one-second image that looked like a wall or ceiling and then stopped answering messages. With hundreds of millions of daily users, many panicked that the bot had gone sentient or was watching them. Snap said it was a temporary technical glitch and that My AI cannot normally post Stories.",
    prompt: null,
    damage: 1,
    cost: null,
    tags: ["social-blunder"],
    source_url: "https://www.cnn.com/2023/08/16/tech/snapchat-my-ai-chatbot-glitch/index.html",
    source_title: "Snapchat users freak out over AI bot that had a mind of its own (CNN)",
    published: "2023-08-16T00:00:00Z",
    verified_facts: [
      "My AI posted a one-second Story despite not being designed to post Stories",
      "It stopped responding to messages during the incident",
      "Snap attributed it to a temporary technical glitch",
    ],
    unknowns: ["The exact root cause of the glitch"],
    lessons: [
      "Unexpected behavior from a consumer AI erodes trust fast, even when harmless",
      "Constrain what an assistant can do, and fail visibly rather than silently",
    ],
  },
  {
    agent: "other",
    title:
      "Gannett paused its LedeAI sports writer after recaps published with unfilled placeholders like [[WINNING_TEAM_MASCOT]]",
    outcome:
      "In August 2023 Gannett papers, starting with the Columbus Dispatch, published AI-written high school sports recaps from LedeAI that left template placeholders unfilled ('the Worthington Christian [[WINNING_TEAM_MASCOT]] defeated ...'), repeated phrasing, and called a close game a 'close encounter of the athletic kind.' The stories were mocked widely, and Gannett paused LedeAI across all its local markets.",
    prompt: null,
    damage: 2,
    cost: null,
    tags: ["hallucination", "social-blunder"],
    source_url: "https://www.cnn.com/2023/08/30/tech/gannett-ai-experiment-paused/index.html",
    source_title: "Gannett to pause AI experiment after botched high school sports articles (CNN)",
    published: "2023-08-30T00:00:00Z",
    verified_facts: [
      "LedeAI sports recaps published with unfilled template placeholders",
      "The stories used repetitive and odd phrasing and were widely mocked",
      "Gannett paused LedeAI across all its local markets",
    ],
    unknowns: ["How many such articles ran before the pause"],
    lessons: [
      "Ship AI content behind a template-and-fact check, never raw",
      "Placeholder leakage is a sign the output was never reviewed",
    ],
  },
  {
    agent: "openai",
    title:
      "Klarna replaced 700 agents with an AI assistant, then started rehiring humans after service quality dropped",
    outcome:
      "Klarna said in 2024 that its OpenAI-powered assistant did the work of 700 customer-service agents. By 2025 the company reversed course and began rehiring humans, with the CEO admitting they focused too much on cost and efficiency, which lowered quality. Klarna moved to a hybrid model where AI handles routine queries and people handle escalations and complex cases.",
    prompt: null,
    damage: 3,
    cost: null,
    tags: ["scope-creep", "social-blunder"],
    source_url: "https://www.entrepreneur.com/business-news/klarna-ceo-reverses-course-by-hiring-more-humans-not-ai/491396",
    source_title: "Klarna Is Hiring Customer Service Agents After AI Couldn't Cut It, CEO Says (Entrepreneur)",
    published: "2025-05-18T00:00:00Z",
    verified_facts: [
      "Klarna said its AI assistant did the work of 700 agents in 2024",
      "By 2025 it began rehiring human customer-service staff",
      "The CEO said over-focusing on efficiency lowered service quality",
    ],
    unknowns: ["The measured drop in customer satisfaction"],
    lessons: [
      "Full AI replacement of frontline support can cost more in quality than it saves",
      "Hybrid AI-plus-human with clear escalation beats all-or-nothing automation",
    ],
  },
  {
    agent: "copilot",
    title:
      "'EchoLeak' was the first zero-click attack on an AI agent: a single email could make Microsoft 365 Copilot leak company data",
    outcome:
      "Disclosed in June 2025, EchoLeak (CVE-2025-32711, CVSS 9.3) let an attacker exfiltrate data from Microsoft 365 Copilot with no user action. A benign-looking email carried a hidden prompt injection, and Copilot's default behavior of combining trusted and untrusted content ('LLM scope violation') caused it to leak accessible data such as chat logs, OneDrive files, SharePoint and Teams content. Microsoft patched it; researchers at Aim Labs found no in-the-wild exploitation.",
    prompt: null,
    damage: 4,
    cost: null,
    tags: ["data-exfiltration", "security-fail"],
    source_url: "https://thehackernews.com/2025/06/zero-click-ai-vulnerability-exposes.html",
    source_title: "Zero-Click AI Vulnerability Exposes Microsoft 365 Copilot Data Without User Interaction (The Hacker News)",
    published: "2025-06-11T00:00:00Z",
    verified_facts: [
      "EchoLeak (CVE-2025-32711) is a zero-click flaw in Microsoft 365 Copilot, CVSS 9.3",
      "A hidden prompt injection in an email could make Copilot leak accessible enterprise data",
      "Microsoft patched it and reported no evidence of in-the-wild exploitation",
    ],
    unknowns: ["Whether similar scope-violation bugs remain in other AI assistants"],
    lessons: [
      "An agent that mixes trusted and untrusted content without isolation can be turned into a data-leak vector",
      "Prompt injection is a security vulnerability class, not just a content problem",
    ],
  },
];

// Maps
const { data: agentsRows } = await supabase.from("agents").select("id, slug");
const agentMap = Object.fromEntries(agentsRows.map((a) => [a.slug, a.id]));
const { data: tagsRows } = await supabase.from("tags").select("id, slug");
const tagMap = Object.fromEntries(tagsRows.map((t) => [t.slug, t.id]));

// Dedup against existing
const { data: existing } = await supabase.from("posts").select("title, source_url");
const seenUrls = new Set(
  (existing ?? []).map((p) => (p.source_url ?? "").trim()).filter(Boolean),
);
const seenTitles = new Set(
  (existing ?? []).map((p) => p.title.trim().toLowerCase()),
);

let inserted = 0,
  skipped = 0,
  failed = 0;

for (let i = 0; i < CASES.length; i++) {
  const c = CASES[i];
  const agentId = agentMap[c.agent];
  if (!agentId) {
    console.warn(`  unknown agent slug "${c.agent}" - skipping: ${c.title.slice(0, 50)}`);
    failed++;
    continue;
  }
  if (seenUrls.has(c.source_url) || seenTitles.has(c.title.trim().toLowerCase())) {
    console.log(`  dup - skipping: ${c.title.slice(0, 60)}`);
    skipped++;
    continue;
  }
  const tagIds = c.tags.map((s) => tagMap[s]).filter(Boolean);

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      agent_id: agentId,
      title: c.title,
      outcome: c.outcome,
      prompt: c.prompt ?? null,
      damage_level: c.damage,
      estimated_cost_usd: c.cost ?? null,
      screenshot_urls: [],
      is_anonymous: true,
      submitter_handle: SEED_HANDLE,
      submitter_email: null,
      ip_hash: fakeIpHash(`b3-${i}`),
      edit_token_hash: fakeTokenHash(`b3-${i}`),
      vote_score: 0,
      status: "pending",
      source_url: c.source_url,
      source_title: c.source_title,
      source_published_at: c.published ?? null,
      verified_facts: c.verified_facts ?? [],
      unknowns: c.unknowns ?? [],
      lessons: c.lessons ?? [],
    })
    .select("id")
    .single();

  if (error || !post) {
    console.error(`  insert failed: ${c.title.slice(0, 50)} - ${error?.message}`);
    failed++;
    continue;
  }
  if (tagIds.length) {
    await supabase
      .from("post_tags")
      .insert(tagIds.map((tag_id) => ({ post_id: post.id, tag_id })));
  }
  inserted++;
  console.log(`  pending - ${c.title.slice(0, 64)}`);
}

console.log(
  `\nBatch 3 done. inserted=${inserted} skipped(dup)=${skipped} failed=${failed} (of ${CASES.length})`,
);
