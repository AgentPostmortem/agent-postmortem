# AGENTS.md

Instructions for AI coding agents working on **AgentPostmortem**.

This file defines the conventions, architecture, and rules for this codebase. Read it fully before making any changes.

---

## Project Overview

**AgentPostmortem** is a public log of AI agent failures. Users submit cases (with screenshots, prompts, outcomes), vote, comment, and share. A future B2B tier (`/teams`) sells private failure logs to engineering teams.

Tagline: *Every agent failure, documented.*

---

## Stack (do not deviate)

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript (strict mode, no `any` without justification)
- **Styling:** Tailwind CSS only — no CSS-in-JS, no separate `.css` files except `globals.css`
- **Database & Auth:** Supabase (Postgres + RLS)
- **Storage:** Cloudflare R2 (S3-compatible)
- **Email:** Resend
- **Hosting:** Vercel
- **DNS / Registrar / CDN:** Cloudflare
- **Analytics:** Plausible (no cookies, no consent banner needed)

Do not introduce new dependencies without explicit approval. Prefer the platform features of the existing stack over adding libraries.

---

## Repository Layout

```
/app                  → Next.js App Router routes
  /(public)           → Public pages (homepage, post, agent, tag, etc.)
  /admin              → Moderation dashboard (env-password gated)
  /api                → API routes
    /og/[caseNumber]  → OG image generator
/components           → Reusable React components
  /ui                 → Primitives (Button, Input, Card, etc.)
  /post               → Post-specific components (PostCard, VoteButtons, etc.)
  /layout             → Header, Footer, Sidebar
/lib                  → Shared utilities
  /supabase           → Supabase clients (server, client, admin)
  /r2                 → R2 upload helpers
  /resend             → Email helpers + templates
  /utils              → Generic helpers
  /constants          → Tag list, agent list, severity labels, etc.
/types                → Shared TypeScript types
/public               → Static assets
/supabase/migrations  → SQL migration files (numbered)
```

Do not create new top-level folders without justification.

---

## TypeScript Rules

- `strict: true` is non-negotiable.
- No `any`. If you genuinely need it, use `unknown` and narrow.
- Prefer `type` over `interface` unless extending.
- Database types are generated from Supabase: `npm run types:db` writes to `/types/db.ts`. Never edit that file by hand.
- Shared domain types live in `/types/index.ts`. Component props stay colocated with the component.
- Exported functions get explicit return types. Inline callbacks can infer.

---

## React & Next.js Rules

- **Server Components by default.** Only mark a component `"use client"` when it actually needs interactivity (state, effects, event handlers).
- Data fetching happens in Server Components, not via `useEffect` + fetch. Use Supabase's server client.
- Mutations use Server Actions (`"use server"`), not API routes — except for webhooks, OG images, and external integrations.
- API routes only for: `/api/og/*`, `/api/webhooks/*`, `/api/cron/*`.
- No `getServerSideProps` / `getStaticProps`. App Router only.
- Loading states use `loading.tsx`. Errors use `error.tsx`. Not-found uses `not-found.tsx`.
- Metadata is exported per route, not set imperatively.

---

## Styling Rules

- Tailwind utility classes only. No inline `style={}` except for dynamic values that can't be expressed in classes (e.g. `style={{ width: \`${percent}%\` }}`).
- Use the design tokens defined in `tailwind.config.ts`. Do not hard-code hex colors in components.
- Mobile-first: write base styles for mobile, use `sm:` `md:` `lg:` to scale up.
- Composition pattern for variants: use `clsx` (or `cn` helper in `/lib/utils`) — do not concatenate strings.
- Order classes consistently: layout → spacing → sizing → typography → color → state. Use the Tailwind Prettier plugin to enforce this.

### Design Tokens (do not invent new ones)

```
Colors:
  bg-canvas        — page background (near-black)
  bg-surface       — card / panel
  bg-elevated      — modal / dropdown
  text-primary     — body
  text-secondary   — labels, meta
  text-tertiary    — captions
  border-default
  border-strong
  accent-red       — severity / damage / single accent
  accent-red-soft  — severity backgrounds

Typography:
  font-serif       — headlines (case titles, page headers)
  font-sans        — body (Inter / Geist)
  font-mono        — case data (case numbers, timestamps, code)
```

The aesthetic is a **forensic case file**: cold, restrained, slightly clinical. Resist the urge to add gradients, glows, or playful color. Single red accent for severity only.

---

## Component Rules

- One component per file. File name matches export name (`PostCard.tsx` exports `PostCard`).
- Props get a typed `Props` type colocated above the component.
- No default exports for components — named exports only. (Default exports allowed for `page.tsx`, `layout.tsx`, route handlers.)
- Components stay under ~150 lines. Split when they grow past that.
- No prop drilling beyond two levels — lift to context or refactor.
- Accessibility is required, not optional: semantic HTML, `aria-*` where needed, focus states visible, keyboard navigation works.

---

## Database Rules

- All migrations live in `/supabase/migrations/` numbered `0001_*.sql`, `0002_*.sql`, etc. Never edit a shipped migration — write a new one.
- Every table has Row Level Security enabled. No exceptions.
- Reads from the public site use the anon key + RLS policies. Writes that need to bypass RLS use the service role key, server-side only.
- Foreign keys are required. Cascading deletes are explicit, not implicit.
- Indexes on every column used in `WHERE` or `ORDER BY` at scale.
- Naming: tables plural (`posts`), columns `snake_case`, primary keys `id`, timestamps `created_at` / `updated_at`.

---

## Supabase Client Usage

Three clients live in `/lib/supabase/`:

- `server.ts` — for Server Components and Server Actions (uses cookies for auth)
- `client.ts` — for Client Components (anon key, browser)
- `admin.ts` — service role, server-only, never imported into a Client Component

If a file imports `admin.ts` and is reachable from a Client Component, that's a bug. Add a build check.

---

## API & Server Action Rules

- Validate every input with Zod. No exceptions. Schemas live next to the action or in `/lib/schemas/`.
- Return shape: `{ data, error }` discriminated union. Never throw across the network boundary.
- Rate limit anything user-facing. Use Supabase or Upstash Redis (if introduced) — keyed by IP hash.
- Never trust the client. Recompute permissions, ownership, and limits server-side.
- Log errors to console with enough context to debug. No `console.log` in production code paths — only `console.error` for genuine errors.

---

## File Uploads (Cloudflare R2)

- All uploads go through a server action that returns a presigned URL. Never expose R2 credentials client-side.
- Validate file type by magic bytes, not just extension or MIME header.
- Max image size: 5 MB. Max 5 images per post.
- Run uploaded screenshots through the PII redaction pass (regex for emails / phone numbers, optional face blur) **before** writing the final URL to the database.
- Store originals in a separate bucket from public-served redacted versions.

---

## Email (Resend)

- All email templates live in `/lib/resend/templates/` as React components.
- Every email has a plain-text fallback.
- Every transactional email has an unsubscribe link except identity-critical ones (edit tokens, password resets — and we don't have passwords).
- The "From" address is `notifications@agentpostmortem.com`. Replies go to `hello@agentpostmortem.com`.

---

## Naming Conventions

- **Files:** `kebab-case.ts` for utilities, `PascalCase.tsx` for components, `lowercase` for Next.js special files (`page.tsx`, `layout.tsx`).
- **Variables / functions:** `camelCase`.
- **Types / components:** `PascalCase`.
- **Constants:** `SCREAMING_SNAKE_CASE` only for true constants (env keys, magic numbers). Otherwise `camelCase`.
- **Database:** `snake_case` everywhere.
- **Booleans:** prefix with `is`, `has`, `can`, `should` (`isPublished`, `hasScreenshots`).
- **Event handlers:** prefix with `handle` (`handleSubmit`, `handleVote`).

---

## Git & Commits

- Branch names: `feat/short-description`, `fix/short-description`, `chore/...`, `refactor/...`.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).
- One logical change per commit. No "fix typo + refactor auth + add page" mega-commits.
- PRs include: what changed, why, screenshots if visual, migration notes if any.
- Never commit `.env*` files. `.env.example` is the source of truth for required env vars.

---

## Environment Variables

Every env var is documented in `.env.example` with a comment explaining what it does. When you add a new one, update `.env.example` in the same commit.

Required at launch:
```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL
RESEND_API_KEY
ADMIN_PASSWORD
```

`NEXT_PUBLIC_*` is for browser-exposed values only. Anything sensitive must not have that prefix.

---

## Performance Rules

- Lighthouse mobile score ≥ 90 for homepage and post pages. CI fails below that.
- No client-side fetching for above-the-fold data — fetch server-side.
- Images: use `next/image` with explicit width and height. AVIF / WebP preferred.
- No client-side date libraries (no Moment, no date-fns full bundle). Use `Intl.DateTimeFormat` or `dayjs` (small) if needed.
- Bundle size budget: keep client JS under 150 KB gzipped per route.

---

## Security Rules

- All forms have CSRF protection (Server Actions handle this; for raw API routes, verify origin).
- Sanitize any user input rendered as HTML. Default to plain text rendering — explicitly opt in to HTML only where required.
- Comments and post body are rendered as plain text, with safe link auto-detection. No raw HTML, no Markdown that can produce arbitrary tags.
- Edit tokens are random 32-byte strings, hashed at rest, single-use where possible.
- IP hashing uses HMAC-SHA256 with a secret pepper from env, not raw SHA.
- Never log full IP addresses. Log only the hashed form.

---

## Content Safety Rules

These are product-level rules, but they bind code:

- Any submission that contains a real, named individual must be flagged for manual review and not auto-published.
- Screenshot uploads must pass through the PII redaction pipeline. Bypassing it is a bug.
- Profanity filter is light: allows humor, blocks slurs, blocks named-person targeting.
- "Report" button on every post and comment writes to a `reports` table. Admin dashboard surfaces these in priority order.

---

## Testing Rules

- Write tests for: Zod schemas, utility functions, anything that calculates votes / scores / rankings, anything that touches money or auth.
- Use Vitest. Tests colocated as `*.test.ts` next to the file under test.
- Don't write tests for trivial components (rendering a `<Button>`). Do write tests for components with state machines or complex conditionals.
- E2E tests with Playwright for the critical paths: submit a post, vote, comment, share. Run on CI for every PR touching those paths.

---

## Accessibility Rules

- Every interactive element is keyboard-reachable.
- Focus indicators are visible (don't `outline: none` without a replacement).
- Color contrast meets WCAG AA at minimum.
- All images have `alt` text. Decorative images have `alt=""`.
- Forms have associated `<label>` elements, not just placeholders.
- Modals trap focus and restore on close.

---

## What Agents Should NEVER Do

- Add a new dependency without explicit approval in the PR description.
- Edit shipped database migrations.
- Bypass RLS or use the service role key from a Client Component.
- Hardcode secrets or env values.
- Disable TypeScript strict checks or ESLint rules to "make it work."
- Use `dangerouslySetInnerHTML` without a written justification in the PR.
- Introduce a state management library (Redux, Zustand, Jotai). React state + URL state + Supabase is sufficient.
- Add tracking pixels, third-party analytics, or anything that requires a cookie banner.
- Commit generated files (`/types/db.ts` is the exception, regenerated on schema change).

---

## When in Doubt

- Read the existing code in the same area first. Match its style.
- Prefer deletion over addition. The smaller the change, the better.
- Ask before doing anything that touches auth, payments, RLS, or email deliverability.
- If a rule here conflicts with a clearer best practice you know of, surface it in the PR — don't silently override.

---

*Last updated: 2026-04-28*