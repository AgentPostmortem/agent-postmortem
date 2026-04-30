# Contributing to AgentPostmortem

Thanks for your interest in contributing. This document covers how to set up the project locally, what kinds of contributions are welcome, and how to submit them.

---

## Getting started

### Prerequisites

- Node.js 20+
- A Supabase project (free tier works)
- Git

### Setup

```bash
git clone https://github.com/AgentPostmortem/agent-postmortem
cd agent-postmortem
npm install
```

Copy the environment template and fill in your own values:

```bash
cp .env.example .env.local
```

Run the database migration in your Supabase project (paste into the SQL editor or use the CLI):

```bash
# Via Supabase CLI
npx supabase link --project-ref <your-ref>
npx supabase db push
```

Start the dev server:

```bash
npm run dev
```

---

## Development workflow

Before pushing, run:

```bash
npm run lint        # ESLint
npm run format      # Prettier
npx tsc --noEmit    # TypeScript
```

CI runs all three on every PR — failing any of them will block merge.

---

## What to contribute

### Adding a new agent

Agents live in two places:

1. **`lib/constants/agents.ts`** — add the agent metadata (slug, name, company, description)
2. **Database** — the submit form fetches agents dynamically from the DB, so the agent also needs to be seeded

For local testing, insert it directly:

```bash
npm run db "INSERT INTO agents (slug, name, company, description) VALUES ('my-agent', 'My Agent', 'Company', 'Description.');"
```

For production, include the INSERT in your PR description and a maintainer will run it.

### Adding a new tag

Tags follow the same pattern — add to `lib/constants/tags.ts` and include the DB insert in your PR.

### UI / bug fixes

- Keep changes focused — one fix or feature per PR
- Match the existing design tokens (`bg-canvas`, `accent-red`, `text-tertiary`, etc.) defined in `tailwind.config.ts`
- Test on both mobile and desktop before submitting

### New features

Open an issue first to discuss before building. Large PRs without prior discussion may not be merged.

---

## Pull request checklist

- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run format` applied
- [ ] Tested locally on dev server
- [ ] PR description explains what changed and why

---

## Project structure

See the [README](README.md) for a full breakdown of the directory structure.

---

## Code style

- **TypeScript strict mode** — no `any`, no type assertions unless unavoidable
- **No comments explaining what code does** — only add a comment when the *why* is non-obvious
- **No unused code** — don't leave dead imports or variables
- **Tailwind only** — no inline styles, no CSS modules
- **Server components by default** — only add `"use client"` when interactivity is required

---

## Reporting issues

Open a GitHub issue with:
- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser / OS if it's a UI bug
