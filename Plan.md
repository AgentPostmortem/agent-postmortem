Got it. Plan, not calendar.

---

## AgentPostmortem — Build Plan

### Stack
Next.js 14 (App Router) + TypeScript + Tailwind, Supabase (DB + Auth + Storage), Cloudflare (Registrar + R2 + CDN), Resend (email), Vercel (hosting).

---

### Database (Supabase)
- **agents** — slug, name, company, icon, total_failures
- **posts** — case_number (auto-increment), agent_id, title, prompt, outcome, damage_level (1–5), estimated_cost, screenshot_urls, submitter_handle, submitter_email, edit_token, vote counts, status
- **tags** + **post_tags** — hallucination, expensive-mistake, wrong-recipient, deleted-data, security-fail, social-blunder, code-disaster, etc.
- **votes** — IP-hashed, one per post per voter
- **comments** — threaded one level
- **team_waitlist** — for B2B leads

Seed agents (Claude, GPT-4, Devin, Cursor, Gemini, Replit, Copilot, Perplexity) and tags before launch.

---

### Pages
- `/` — feed with tabs: Hot / New / Top this week / Hall of Fame
- `/submit` — submission form, no auth required
- `/case/[caseNumber]` — individual post with comments + share
- `/agent/[slug]` — all failures for an agent
- `/tag/[slug]` — all posts under a tag
- `/hall-of-fame` — top 100 all-time
- `/teams` — B2B landing + waitlist
- `/about` — what this is + content guidelines
- `/admin` — env-password gated moderation dashboard
- `/api/og/[caseNumber]` — generated share image

---

### Submit Flow
No signup required. Fields: which agent, one-line summary, prompt (optional), what actually happened, damage level slider (1–5), estimated $ cost (optional), up to 5 screenshots, tags, attribution choice (anon or @handle), email (private, for edit token).

Every submission auto-emails an edit link via Resend. First 30 days: all submissions go through a manual review queue. After ~500 posts, switch to auto-publish with reactive moderation.

---

### The Share Image (most important feature)
`@vercel/og` endpoint generating 1200x630 PNG per post, designed as a forensic case file: case number, subject (agent), cause of failure (the outcome text), severity bar, damages, watermark. This is the entire growth engine — every share on X/LinkedIn/Reddit pulls people back.

Spend real time making it actually beautiful: proper typography, subtle grain, correct line breaks for any text length.

---

### Anti-Abuse & Safety
- Rate limit: 3 submissions per IP per hour, votes IP-hashed
- Auto-blur PII in screenshots (regex for emails/phones, optional face detection)
- Light profanity filter — allow humor, block slurs and named individuals
- Manual review queue for first month
- "Report" button on every post and comment
- Block real names of individuals, unredacted PII, confidential data, targeted harassment

---

### Brand
- Name: **AgentPostmortem**
- Tagline: *Every agent failure, documented.*
- Aesthetic: forensic / medical case file. Cold whites, deep blacks, single red accent. Serif headlines, mono for case data.

---

### Content Seeding (before public launch)
Target: **100 quality posts before going live.**

Sources: X search ("AI agent" + deleted/ordered/booked/sent/deployed), Reddit (r/ChatGPT, r/ClaudeAI, r/OpenAI, r/programming, r/devops), HN comments, public incidents, DMs to 30 friends in tech. Rewrite cleanly, attribute where permitted, anonymize otherwise. Spread across agents and tags so it doesn't look skewed.

---

### Launch
- **Show HN** Tuesday morning PT
- **X thread** — "20 most cursed agent failures of 2026"
- **Reddit** — r/ChatGPT, r/OpenAI, r/programming (staggered)
- **LinkedIn** — B2B-angled post planting the team-product seed
- **Product Hunt** — schedule for following Tuesday
- **Newsletter outreach** — Ben's Bites, The Rundown, Latent Space, TLDR AI
- Reply personally to every comment and submission for first 72 hours

---

### Retention Engine
- "Friday 5" — top 5 fails of the week, posted as X thread + emailed digest
- Following specific agents (like sports teams)
- Personal submission scoreboard
- Monthly "Worst Agent" awards

---

### Monetization (don't build until traction)
- **Phase 1 (0–30 days):** nothing, just grow
- **Phase 2 (30–90 days):** merch (tombstone shirts, case-file posters via Printful), sponsored "Agent of the Month"
- **Phase 3 (90+ days):** **AgentPostmortem for Teams** — private B2B SaaS for engineering teams to log, tag, and learn from internal agent failures. $99 / $499 / $2k+ per month tiers. The consumer site is the marketing engine for this — every viral post is a billboard.

---

### Success Targets at Day 30
500–2000 submissions, 10k–50k unique visitors, 1–2 viral X moments, 100+ teams waitlist signups, 1 major newsletter mention.

---

That's the whole plan. Build away — ping me when you hit a decision point or need a spec for a specific piece.