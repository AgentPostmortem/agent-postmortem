# Contributing to AgentPostmortem

Thanks for your interest in contributing. This document covers how to set up the project locally, what kinds of contributions are welcome, and how to submit them.

---

## Getting started

### Prerequisites

- Node.js 22+
- A Supabase project (free tier works)
- Git

### Setup

```bash
git clone https://github.com/AgentPostmortem/agentpostmortem
cd agentpostmortem
npm install
```

Copy the environment template and fill in your own values:

```bash
cp .env.example .env.local
```

Schema migrations are managed outside this repository. The expected table shapes are documented by the TypeScript definitions in `types/supabase.ts`, which track the deployed Supabase schema. Once your tables exist, seed sample data with the scripts in `scripts/`.

Start the dev server:

```bash
npm run dev
```

---

## Development workflow

Before pushing, run:

```bash
npx prettier --write .   # Prettier
npm run lint             # ESLint
npx tsc --noEmit         # TypeScript
npx vitest run           # Tests
npm run build            # Production build
```

CI runs all of these on every PR, and failing any of them will block merge.

---

## Commit and PR title convention

This repository follows [Conventional Commits](https://www.conventionalcommits.org/). Pull requests are squash-merged, so **the PR title becomes the commit message** and is validated in CI by `.github/workflows/pr-title.yml`. A PR with a non-conforming title will fail its check.

Format:

```
<type>(<optional scope>): <description>
```

Allowed types:

| Type       | Use for                                     |
| ---------- | ------------------------------------------- |
| `feat`     | A new user-facing capability                |
| `fix`      | A bug fix                                   |
| `docs`     | Documentation only                          |
| `chore`    | Maintenance that does not change behaviour  |
| `refactor` | Code restructuring with no behaviour change |
| `test`     | Adding or fixing tests                      |
| `perf`     | Performance improvements                    |
| `ci`       | CI and workflow changes                     |
| `build`    | Build config or dependency changes          |
| `style`    | Formatting only                             |
| `revert`   | Reverting a previous commit                 |

Examples:

```
feat: add severity filter to the case feed
fix: prevent duplicate case numbers on concurrent approval
docs: document the edit-token flow in the README
chore: bump wrangler to 4.98
refactor: extract severity styling into a shared helper
test: cover rate limiting in the submit route
perf: cache tag counts on the tag index page
ci: run vitest in the CI workflow
```

Scopes are optional and lowercase, naming the area touched:

```
fix(admin): stop the approve button double-firing
feat(api): expose damage totals from /api/export
```

Breaking changes use a `!` before the colon, and explain the break in the PR body:

```
feat(api)!: drop the legacy /api/posts response shape
```

Local commit messages are checked with the same ruleset if you want to run it yourself:

```bash
npx commitlint --from HEAD~1
```

There are no git hooks in this repo on purpose, so nothing is installed behind your back and outside contributors get the same experience as maintainers.

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
- Match the existing design tokens (`bg-canvas`, `accent-red`, `accent-red-muted`, `text-tertiary`, etc.) defined in `tailwind.config.ts`. Use `text-accent-red-muted` (not `text-accent-red`) when placing red text on `bg-accent-red-soft` backgrounds to pass WCAG AA contrast.
- Test on both mobile and desktop before submitting

### New features

Open an issue first to discuss before building. Large PRs without prior discussion may not be merged.

---

## Pull request checklist

- [ ] PR title follows Conventional Commits
- [ ] `npx prettier --check .` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npx vitest run` passes
- [ ] `npm run build` passes
- [ ] Tested locally on dev server
- [ ] PR description explains what changed and why

---

## Project structure

See the [README](README.md) for a full breakdown of the directory structure.

---

## Code style

- **TypeScript strict mode** — no `any`, no type assertions unless unavoidable
- **No comments explaining what code does** — only add a comment when the _why_ is non-obvious
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

## Claiming an issue

Want to pick something up? Just comment on the issue saying you'd like to work on
it. A workflow adds the `claimed` label so nobody else duplicates your effort.

Two small rules keep things fair:

- **Two open claims per person.** If you already hold two claimed issues, we'll ask
  you to finish one first so other people get a turn. Comment again once one lands
  and the next is yours.
- **Claims go stale after 14 days.** If a claimed issue sees no activity for two
  weeks, the label is removed and it goes back in the pool. No hard feelings, and
  you can always claim it again.

Link your pull request to the issue in the PR description (for example
`Closes #12`). When that PR is merged the issue closes itself, and if the PR is
closed without being merged the claim is released so someone else can pick it up.

No pressure on timelines otherwise. Ask questions in the issue thread any time.
