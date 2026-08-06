# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `SECURITY.md` with a private vulnerability reporting process.
- `CHANGELOG.md` (this file).
- `.github/ISSUE_TEMPLATE/config.yml` routing case submissions, corrections, and
  security reports away from the public issue tracker.
- `.github/dependabot.yml` with weekly, grouped npm and GitHub Actions updates.

## [1.0.0] - 2026-08-06

First tagged release. Marks the public registry as feature complete and running
in production at https://www.agentpostmortem.com/.

### Added

- Public case registry: submit, browse, and read documented AI agent failures,
  with case numbers, severity levels, damage estimates, agents, and tags.
- Case submission flow with file evidence upload via presigned R2 URLs, plus a
  tokenized edit link so submitters can correct a case after filing.
- Voting, comments with moderation, comment permalinks, and a Hall of Fame
  ranking the top cases.
- Search with live debounced queries, server-rendered results, agent and
  severity filters, and CSV export.
- Browse surfaces: agent index grouped by company, tag index of failure
  categories, stats page, status page, and numbered pagination throughout.
- Weekly email newsletter: signup, subscribe and unsubscribe flows, admin digest
  sending through Resend, and a responsive branded email template.
- Admin area for approving, editing, and moderating submissions, resending edit
  tokens, and sending digests.
- SEO and syndication: sitemap, RSS feed, JSON-LD structured data, dynamic OG
  images for cases, agents, and tags, and noindex on admin routes.
- Site pages: about, contact, terms, privacy, teams, and a tools page listing
  the wider agent operating suite.
- Spam protection and shared rate limiting across submission, vote, and comment
  routes.
- Project documentation and automation: README, CONTRIBUTING, Code of Conduct,
  MIT license, `.env.example`, issue and pull request templates, and a CI
  workflow running ESLint, TypeScript, Prettier, and a production build.

### Changed

- Deployment migrated from a Node host to Cloudflare Workers via OpenNext.
- Visual identity reworked into an incident-report look: ember accent, neutral
  ink palette, Space Grotesk, and a widened page shell.
- Independence and accuracy disclaimers strengthened across public pages.
- Homepage load-more replaced with numbered pagination.

### Fixed

- Homepage LCP render delay cut by streaming with Suspense and switching to
  `next/font/local`.
- All remaining WCAG contrast failures and touch target sizes flagged by
  Lighthouse.
- Case page caching keyed correctly by case number, with duplicate fetches
  removed.
- Hydration mismatch, stale closure in the admin view, email storage, and case
  number assignment on seed and insert.
- Tag labels rendered as slugs, breadcrumb links made clickable, and duplicate
  `/edit/[token]` route removed.

### Security

- Next.js upgraded to 14.2.35 to pick up upstream security patches.
- Submitter IP addresses stored only as peppered hashes.
- Admin pages excluded from search engine indexing.

[Unreleased]: https://github.com/AgentPostmortem/agentpostmortem/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/AgentPostmortem/agentpostmortem/releases/tag/v1.0.0
