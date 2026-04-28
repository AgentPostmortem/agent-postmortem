# AgentPostmortem — Local Setup Guide

## API Keys Required

### 1. Supabase — https://supabase.com
Create a new project, then grab from **Project Settings → API**:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon / public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (keep secret) |

### 2. Cloudflare R2 — https://dash.cloudflare.com
Create an R2 bucket, then from **R2 → Manage R2 API Tokens**:

| Variable | Where to find it |
|---|---|
| `R2_ACCOUNT_ID` | Cloudflare Account ID (top-right of dashboard) |
| `R2_ACCESS_KEY_ID` | R2 token Access Key ID |
| `R2_SECRET_ACCESS_KEY` | R2 token Secret Access Key |
| `R2_BUCKET_NAME` | Your bucket name (e.g. `agentpostmortem-screenshots`) |
| `R2_PUBLIC_URL` | Custom domain or `*.r2.dev` URL for public reads |

### 3. Resend — https://resend.com
Create an API key and verify your sending domain (`agentpostmortem.com`):

| Variable | Where to find it |
|---|---|
| `RESEND_API_KEY` | Resend dashboard → API Keys |

### 4. App Config (no external service)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally, `https://agentpostmortem.com` in prod |
| `ADMIN_PASSWORD` | Any strong password you choose — gates the `/admin` route |
| `IP_HASH_PEPPER` | Random secret string — generate with `openssl rand -hex 32` |

---

## Commands to Run Locally

### Step 1 — Copy env file and fill in keys
```bash
cp .env.example .env.local
# Edit .env.local and fill in all values above
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Push database schema to Supabase

**Option A — Supabase CLI (recommended):**
```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

**Option B — Supabase SQL Editor (manual):**
Paste and run the following files in order in the Supabase dashboard SQL editor:
1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_seed.sql`

### Step 4 — Generate TypeScript database types
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/db.ts
```

### Step 5 — Start the dev server
```bash
npm run dev
# Open http://localhost:3000
```

---

## Other Useful Commands

```bash
# Type check
npx tsc --noEmit

# Unit tests
npx vitest run

# E2E tests (requires dev server running in another terminal)
npx playwright test

# Lint
npx eslint .
```

---

## Minimum to Get Running Locally

You only need **Supabase** wired up to see the site work. R2 (file uploads) and Resend (emails) will fail gracefully until you add those keys — everything else will work fine.

Priority order:
1. Supabase URL + anon key + service role key
2. `ADMIN_PASSWORD` (any string)
3. `IP_HASH_PEPPER` (`openssl rand -hex 32`)
4. R2 keys (needed for screenshot uploads)
5. Resend key (needed for edit-token emails)
