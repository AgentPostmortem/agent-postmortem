# AgentPostmortem

A public registry of AI agent failures. Real incidents, documented and searchable.

**[agentpostmortem.com](https://agentpostmortem.com)**

---

## What it is

AgentPostmortem is a community-driven database of incidents where AI agents caused real harm — deleted data, sent emails to wrong recipients, ran up unexpected bills, exposed credentials, or otherwise went wrong in production.

Cases are submitted anonymously or with attribution, reviewed before publication, and assigned a permanent case number (APM-XXXX).

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (Postgres + RLS) |
| Storage | Cloudflare R2 (screenshots) |
| Email | Resend (edit token delivery) |
| Hosting | Vercel |
| Styling | Tailwind CSS |

---

## Project structure

```
app/
  (public)/          # Public-facing pages
    page.tsx         # Feed (hot / new / week)
    submit/          # Case submission form
    case/[caseNumber]/ # Individual case page
    agent/[slug]/    # Agent profile page
    tag/[slug]/      # Tag browsing page
    hall-of-fame/    # Top voted cases
  admin/             # Moderation dashboard
  api/
    posts/           # Submit a case, vote
    agents/          # List agents (used by submit form)
    tags/            # List tags (used by submit form)
    admin/posts/     # Admin: list and approve/reject
    upload/presign/  # R2 presigned upload URLs
    og/[caseNumber]/ # OG image generation

components/
  layout/            # Header, Footer
  post/              # PostCard, SubmitForm, VoteButtons, TagBadge
  ui/                # Badge, Button, Card, Input

lib/
  db/posts.ts        # All Supabase read queries
  schemas/submit.ts  # Zod validation for submissions
  supabase/          # Admin + server clients
  r2/                # Upload helpers
  resend/            # Email templates
  utils/             # IP hashing, PII redaction, cn

supabase/
  migrations/        # 0001_init.sql — full schema
```

---

## Local development

**Prerequisites:** Node 20+, a Supabase project, Cloudflare R2 bucket, Resend account.

```bash
git clone https://github.com/AgentPostmortem/agent-postmortem
cd agent-postmortem
npm install
cp .env.example .env.local  # fill in values
npm run dev
```

### Environment variables

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

RESEND_API_KEY=
ADMIN_PASSWORD=

IP_HASH_PEPPER=   # 32+ random hex chars — never change after launch
```

### Database

Run the migration against your Supabase project:

```bash
# Via Supabase CLI (after linking)
npx supabase db push

# Or paste supabase/migrations/0001_init.sql into the SQL editor
```

Seed development data:

```bash
node scripts/seed-cases.mjs
```

### Useful scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run db "SQL"     # Run a query against the remote DB
```

---

## Submitting a case

Go to [agentpostmortem.com/submit](https://agentpostmortem.com/submit). Anonymous submissions are accepted. If you provide an email, you'll receive a one-time edit token to update your case after submission.

All submissions go through moderation before appearing publicly.

---

## Contributing

Issues and PRs welcome. If you want to add a new agent to the registry, open a PR adding it to `lib/constants/agents.ts` — or submit it directly via the admin API once deployed.

---

## License

MIT
