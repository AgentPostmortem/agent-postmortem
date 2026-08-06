# AgentPostmortem

[![CI](https://github.com/AgentPostmortem/agentpostmortem/actions/workflows/ci.yml/badge.svg)](https://github.com/AgentPostmortem/agentpostmortem/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

AgentPostmortem is a public, searchable registry of real-world AI agent failures, where each incident is documented with what the agent did, how bad it was, and what it cost.

Live at **[www.agentpostmortem.com](https://www.agentpostmortem.com)**.

## Why it exists

AI agents now write code, send email, move money and touch production systems. When they fail, the details usually stay inside one company's incident channel, so the next team hits the same failure mode from scratch. AgentPostmortem keeps those incidents in the open, in a consistent shape, so failures can be searched, compared and learned from instead of repeated.

## How the registry works

**Case numbers.** Every published case gets a permanent identifier of the form `APM-0001`, assigned at approval time (`app/api/admin/posts/[id]/route.ts`) and used as the case URL: `/case/APM-0001`.

**Severity.** Each case carries a damage level from 1 to 5, defined in `lib/constants/severity.ts`:

| Level | Label        | Meaning                                                                                                  |
| ----- | ------------ | -------------------------------------------------------------------------------------------------------- |
| 1     | Minor        | Minor inconvenience. No lasting impact, easily reversed, no financial loss.                              |
| 2     | Moderate     | Recoverable mistake. Required manual intervention but no lasting harm.                                   |
| 3     | Significant  | Significant disruption. Hours of lost work, reputational embarrassment, or under $10k impact.            |
| 4     | Severe       | Serious damage. Customer data affected, security incident, or financial losses $10k to $100k.            |
| 5     | Catastrophic | Catastrophic failure. Permanent data loss, major security breach, six-figure damages, or legal exposure. |

**Agents and tags.** Each case is attributed to one agent (`lib/constants/agents.ts`, browsable at `/agent/[slug]`) and one to eight tags (`lib/constants/tags.ts`, browsable at `/tag/[slug]`).

**Damage figures.** Cases may record an approximate USD cost (`estimated_cost_usd`, 0 to 100,000,000). It is optional: a case with reputational damage only is recorded as 0, and an unknown figure is left null rather than guessed.

**Submit, review, edit.** Anyone can submit at `/submit`, anonymously or with a handle. Submissions are rate limited to 3 per hour per hashed IP, run through PII redaction (`lib/utils/pii.ts`) and land with status `pending`. A maintainer approves or rejects them from `/admin`, and approval is what mints the case number. If the submitter supplies an email, a random edit token is generated: the raw token goes out by email, only its SHA-256 hash is stored, and the token unlocks a private edit page at `/edit/[token]` for later corrections.

## Stack

| Layer     | Tech                                                       |
| --------- | ---------------------------------------------------------- |
| Framework | Next.js 14 (App Router, React server components)           |
| Database  | Supabase (Postgres)                                        |
| Hosting   | Cloudflare Workers via OpenNext (`@opennextjs/cloudflare`) |
| Storage   | Cloudflare R2 (screenshot evidence)                        |
| Email     | Resend (edit tokens, approval notices, newsletter)         |
| Styling   | Tailwind CSS                                               |
| Tests     | Vitest                                                     |

## Local development

**Prerequisites:** Node.js 22+, npm, and a Supabase project. R2 and Resend credentials are only needed to exercise screenshot upload and email.

```bash
git clone https://github.com/AgentPostmortem/agentpostmortem
cd agentpostmortem
npm install
cp .env.example .env.local
npm run dev
```

### Environment variables

Names only. See [`.env.example`](.env.example) for the full template, and never commit real values.

| Variable                                                                      | Purpose                                          |
| ----------------------------------------------------------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_APP_URL`                                 | Canonical URLs used in links, OG tags, feeds     |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`                   | Public Supabase client                           |
| `SUPABASE_SERVICE_ROLE_KEY`                                                   | Server-only writes and moderation                |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` | Presigned screenshot uploads                     |
| `R2_PUBLIC_URL`, `NEXT_PUBLIC_R2_PUBLIC_URL`                                  | Public base URL for stored screenshots           |
| `RESEND_API_KEY`                                                              | Transactional email                              |
| `ADMIN_PASSWORD`                                                              | Access to `/admin`                               |
| `IP_HASH_PEPPER`                                                              | Pepper for hashed IPs; never rotate after launch |

### Database schema

Migrations are managed outside this repository. The expected table shapes are documented by the TypeScript definitions in `types/supabase.ts`, which track the deployed Supabase schema.

## Checks

Everything below is what CI enforces on every pull request.

```bash
npx prettier --check .   # formatting (npx prettier --write . to fix)
npm run lint             # ESLint via next lint
npx tsc --noEmit         # TypeScript
npx vitest run           # unit and route tests
npm run build            # Next.js production build
```

### Seeding scripts

`scripts/` holds Node scripts for populating a database with cases. They read credentials from `.env.local` and are safe to run against a development project only.

```bash
node scripts/seed-cases.mjs             # baseline sample cases
node scripts/seed-real-cases-batch1.mjs  # documented real incidents (also batch2, batch3)
node scripts/approve-seed-cases.mjs      # approve seeded cases and assign case numbers
```

### Deploying

```bash
npm run preview   # build with OpenNext and preview the Worker locally
npm run deploy    # build and deploy to Cloudflare Workers
```

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup, code style, the Conventional Commits requirement and how issue claiming works.

New here? Start with a [good first issue](https://github.com/AgentPostmortem/agentpostmortem/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). Comment on the issue to claim it.

To report a case rather than change code, use [the submit form](https://www.agentpostmortem.com/submit).

## License

[MIT](LICENSE)
