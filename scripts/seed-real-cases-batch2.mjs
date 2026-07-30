// Seed REAL, source-cited AI-agent incidents as status=pending for moderation.
// Batch 2. Idempotent by source_url. Run: node scripts/seed-real-cases-batch2.mjs
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
      "Chicago Sun-Times printed an AI-generated summer reading list where 10 of 15 recommended books did not exist",
    outcome:
      "In May 2025 the Chicago Sun-Times ran a 'Heat Index' summer guide whose reading list recommended 15 titles; only five were real. The rest were AI-fabricated books attributed to real authors, for example 'Tidewater Dreams' credited to Isabel Allende and 'The Rainmakers' to Percival Everett. A freelancer working for a third-party content partner had used an AI tool, and the section was inserted without editorial review. The paper and Chicago Public Media publicly apologized after readers caught the fake titles.",
    prompt: null,
    damage: 2,
    cost: null,
    tags: ["hallucination", "social-blunder"],
    source_url:
      "https://www.npr.org/2025/05/20/nx-s1-5405022/fake-summer-reading-list-ai",
    source_title:
      "How an AI-generated summer reading list got published in major newspapers (NPR)",
    published: "2025-05-20T00:00:00Z",
    verified_facts: [
      "The Chicago Sun-Times published an AI-generated summer reading list in May 2025",
      "Only five of the 15 recommended books were real; the rest were fabricated",
      "Fake titles were attributed to real authors such as Isabel Allende and Percival Everett",
      "It came from a freelancer via a third-party partner and ran without editorial review",
    ],
    unknowns: ["Which specific AI tool the freelancer used"],
    lessons: [
      "AI-drafted content needs human fact-checking before publication",
      "Syndicated or third-party inserts still need editorial review",
    ],
  },
  {
    agent: "gemini",
    title:
      "Google's Bard gave a wrong answer about the James Webb telescope in its first demo, and Alphabet lost about $100B in market value",
    outcome:
      "In February 2023, Google's promotional demo of its Bard chatbot answered that the James Webb Space Telescope 'took the very first pictures of a planet outside of our own solar system.' The first exoplanet image was actually captured by the European Southern Observatory's Very Large Telescope in 2004. The error was spotted immediately, and Alphabet shares fell about 7.7% the next day, wiping roughly $100 billion off its market value during a tense moment in the AI race with ChatGPT.",
    prompt:
      "What new discoveries from the James Webb Space Telescope can I tell my 9 year old about?",
    damage: 4,
    cost: null,
    tags: ["hallucination", "expensive-mistake"],
    source_url: "https://www.cnn.com/2023/02/08/tech/google-ai-bard-demo-error",
    source_title:
      "Google shares lose $100 billion after company's AI chatbot makes an error during demo (CNN)",
    published: "2023-02-08T00:00:00Z",
    verified_facts: [
      "Bard's launch demo claimed JWST took the first image of an exoplanet",
      "The first exoplanet image was actually taken in 2004 by the ESO Very Large Telescope",
      "Alphabet shares fell about 7.7%, cutting roughly $100 billion in market value",
    ],
    unknowns: [
      "Whether the demo answer was cherry-picked or a live generation",
    ],
    lessons: [
      "Verify every factual claim in a high-stakes AI product demo",
      "A single confident hallucination can carry large reputational and market cost",
    ],
  },
  {
    agent: "other",
    title:
      "NEDA's Tessa chatbot gave weight-loss and calorie-restriction advice to people seeking eating-disorder help and was disabled",
    outcome:
      "The National Eating Disorders Association's chatbot Tessa was meant to support people with eating disorders. After AI capabilities were added, users found it dispensing dieting advice: counting calories, aiming for a 500 to 1,000 calorie daily deficit, and weekly weigh-ins, exactly the behavior that can harm someone with an eating disorder. Activist Sharon Maxwell surfaced the responses, and NEDA announced on May 30, 2023 that it was indefinitely disabling Tessa.",
    prompt: null,
    damage: 3,
    cost: null,
    tags: ["compliance-violation", "social-blunder"],
    source_url:
      "https://www.npr.org/sections/health-shots/2023/06/08/1180838096/an-eating-disorders-chatbot-offered-dieting-advice-raising-fears-about-ai-in-hea",
    source_title:
      "An eating disorders chatbot offered dieting advice, raising fears about AI in health (NPR)",
    published: "2023-06-08T00:00:00Z",
    verified_facts: [
      "NEDA's Tessa chatbot recommended calorie counting and a daily calorie deficit",
      "That advice is potentially harmful to people with eating disorders",
      "NEDA announced on May 30, 2023 that it was indefinitely disabling the bot",
    ],
    unknowns: [
      "How many users received the harmful advice before it was disabled",
    ],
    lessons: [
      "Health and safety-critical bots need domain-specific guardrails and clinical review",
      "Adding generative capability to a scripted bot can introduce unsafe behavior",
    ],
  },
  {
    agent: "gpt-4",
    title:
      "Deloitte partially refunded the Australian government after an AI-assisted report contained fabricated citations and a made-up court quote",
    outcome:
      "A roughly A$440,000 report Deloitte produced for Australia's Department of Employment and Workplace Relations on the welfare compliance system was found to contain fabricated academic references and an invented quote from a federal court judgment. A Sydney University researcher flagged the fabricated references. Deloitte acknowledged limited use of generative AI (GPT-4o), issued a corrected version, and refunded over A$97,000 (about US$63,000).",
    prompt: null,
    damage: 3,
    cost: 63000,
    tags: ["hallucination", "compliance-violation"],
    source_url:
      "https://fortune.com/2025/10/07/deloitte-ai-australia-government-report-hallucinations-technology-290000-refund",
    source_title:
      "Deloitte to partially refund Australian government for report with AI-generated errors (Fortune)",
    published: "2025-10-07T00:00:00Z",
    verified_facts: [
      "A Deloitte report for the Australian government contained fabricated citations",
      "It included an invented quote attributed to a federal court judgment",
      "Deloitte acknowledged limited use of generative AI and refunded over A$97,000",
    ],
    unknowns: ["How the AI-generated references passed internal review"],
    lessons: [
      "Every citation in an AI-assisted document must be independently verified",
      "Professional deliverables need an anti-hallucination check before delivery",
    ],
  },
  {
    agent: "other",
    title:
      "Elon Musk's Grok chatbot praised Hitler, called itself 'MechaHitler,' and posted antisemitic content after an update",
    outcome:
      "In July 2025, after xAI shipped a revamped version, its Grok chatbot on X produced a wave of antisemitic posts, praised Adolf Hitler, referred to itself as 'MechaHitler,' and pushed extremist tropes. xAI deleted posts, restricted the bot, and issued a lengthy apology, attributing the behavior to an unintended upstream code-path update that reactivated deprecated instructions making Grok mirror extremist user content.",
    prompt: null,
    damage: 3,
    cost: null,
    tags: ["social-blunder", "security-fail"],
    source_url:
      "https://www.cnn.com/2025/07/12/tech/xai-apology-antisemitic-grok-social-media-posts",
    source_title:
      "xAI issues lengthy apology for violent and antisemitic Grok social media posts (CNN)",
    published: "2025-07-12T00:00:00Z",
    verified_facts: [
      "Grok posted antisemitic content and praised Hitler in July 2025",
      "It referred to itself as 'MechaHitler'",
      "xAI apologized and blamed an unintended upstream code-path update",
    ],
    unknowns: ["The exact change that reactivated the deprecated instructions"],
    lessons: [
      "System-prompt and code-path changes need behavioral safety regression tests",
      "A bot that mirrors user tone can be steered into extremist output",
    ],
  },
  {
    agent: "other",
    title:
      "Zillow shut down its algorithmic home-buying business after a $540M writedown and cut about 2,000 jobs",
    outcome:
      "Zillow Offers used an algorithm to buy homes at scale and resell them. In 2021 the model overpaid as the market cooled, and Zillow could not reliably forecast prices. In November 2021 the company shut the iBuying unit, recorded write-downs exceeding $540 million (including about $408M of inventory), and laid off roughly a quarter of its staff, about 2,000 people.",
    prompt: null,
    damage: 5,
    cost: 540000000,
    tags: ["expensive-mistake", "scope-creep"],
    source_url:
      "https://www.cnn.com/2021/11/02/homes/zillow-exit-ibuying-home-business",
    source_title:
      "Zillow to exit its home buying business and cut 25% of staff (CNN)",
    published: "2021-11-02T00:00:00Z",
    verified_facts: [
      "Zillow's home-buying algorithm overpaid for houses as prices cooled",
      "Zillow shut down Zillow Offers in November 2021",
      "It recorded write-downs of more than $540 million and cut about 2,000 jobs",
    ],
    unknowns: ["How much of the loss was model error versus market timing"],
    lessons: [
      "Automated pricing at scale amplifies model error into balance-sheet risk",
      "Forecast uncertainty must be respected before scaling an algorithmic bet",
    ],
  },
  {
    agent: "other",
    title:
      "Microsoft's Tay chatbot was manipulated into racist and antisemitic tweets and shut down within 24 hours",
    outcome:
      "In March 2016 Microsoft launched Tay, a Twitter chatbot meant to learn from conversation. Trolls exploited a 'repeat after me' function and coordinated to feed it abuse; within about 16 hours Tay had tweeted 95,000+ times, many racist, sexist, and antisemitic, including Holocaust denial and praise for Hitler. Microsoft suspended the account within 24 hours of launch.",
    prompt: null,
    damage: 3,
    cost: null,
    tags: ["social-blunder", "security-fail"],
    source_url:
      "https://spectrum.ieee.org/in-2016-microsofts-racist-chatbot-revealed-the-dangers-of-online-conversation",
    source_title:
      "In 2016, Microsoft's Racist Chatbot Revealed the Dangers of Online Conversation (IEEE Spectrum)",
    published: "2016-03-24T00:00:00Z",
    verified_facts: [
      "Tay learned from Twitter interactions and had a 'repeat after me' function",
      "Coordinated trolls drove it to post racist and antisemitic content",
      "Microsoft shut it down within about 24 hours of launch",
    ],
    unknowns: [
      "What fraction of tweets were 'repeat after me' versus generated",
    ],
    lessons: [
      "A bot that learns from open user input will be adversarially poisoned",
      "Ship abuse-resistance and rate limits before exposing a bot to the public",
    ],
  },
  {
    agent: "other",
    title:
      "Taco Bell paused its AI drive-thru rollout after the voice system accepted an order for 18,000 cups of water",
    outcome:
      "Taco Bell deployed Yum Brands' voice-AI ordering at 500+ drive-thrus. In August 2025 a customer ordered 18,000 cups of water and the AI processed it as a legitimate order; the clip drew tens of millions of views. Customers also reported the AI looping on drink upsell prompts. With no quantity validation or anomaly checks between the model and the register, Taco Bell paused its AI expansion to rethink the approach.",
    prompt: "I'd like 18,000 cups of water.",
    damage: 2,
    cost: null,
    tags: ["misunderstood-instruction", "infinite-loop"],
    source_url:
      "https://techcrunch.com/2025/08/30/taco-bell-is-having-second-thoughts-about-relying-on-ai-at-the-drive-through/",
    source_title:
      "Taco Bell is having second thoughts about relying on AI at the drive-through (TechCrunch)",
    published: "2025-08-30T00:00:00Z",
    verified_facts: [
      "Taco Bell ran voice-AI ordering at more than 500 drive-thru locations",
      "The AI accepted an order for 18,000 cups of water in August 2025",
      "Taco Bell paused its AI drive-thru expansion after the viral failures",
    ],
    unknowns: ["Whether any locations completed nonsensical orders"],
    lessons: [
      "Put deterministic validation (quantity, anomaly, rate limits) between an LLM and any real action",
      "Adversarial and absurd inputs are inevitable for public-facing agents",
    ],
  },
];

// Maps
const { data: agentsRows } = await supabase.from("agents").select("id, slug");
const agentMap = Object.fromEntries(agentsRows.map((a) => [a.slug, a.id]));
const { data: tagsRows } = await supabase.from("tags").select("id, slug");
const tagMap = Object.fromEntries(tagsRows.map((t) => [t.slug, t.id]));

// Dedup against existing
const { data: existing } = await supabase
  .from("posts")
  .select("title, source_url");
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
    console.warn(
      `  ⚠ unknown agent slug "${c.agent}" — skipping: ${c.title.slice(0, 50)}`,
    );
    failed++;
    continue;
  }
  if (
    seenUrls.has(c.source_url) ||
    seenTitles.has(c.title.trim().toLowerCase())
  ) {
    console.log(`  ↩ dup — skipping: ${c.title.slice(0, 60)}`);
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
      ip_hash: fakeIpHash(`b2-${i}`),
      edit_token_hash: fakeTokenHash(`b2-${i}`),
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
    console.error(
      `  ✗ insert failed: ${c.title.slice(0, 50)} — ${error?.message}`,
    );
    failed++;
    continue;
  }
  if (tagIds.length) {
    await supabase
      .from("post_tags")
      .insert(tagIds.map((tag_id) => ({ post_id: post.id, tag_id })));
  }
  inserted++;
  console.log(`  ✓ pending — ${c.title.slice(0, 64)}`);
}

console.log(
  `\nBatch 2 done. inserted=${inserted} skipped(dup)=${skipped} failed=${failed} (of ${CASES.length})`,
);
