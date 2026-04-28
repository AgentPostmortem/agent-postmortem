-- ─── AgentPostmortem — Seed Data ─────────────────────────────────────────────
-- Migration: 0002_seed.sql
-- Seeds initial agents and tags. Safe to re-run (ON CONFLICT DO NOTHING).

-- ─── Agents ──────────────────────────────────────────────────────────────────
INSERT INTO agents (slug, name, company, description) VALUES
  (
    'claude',
    'Claude',
    'Anthropic',
    'Anthropic''s large language model assistant and agent, used via API and consumer products.'
  ),
  (
    'gpt-4',
    'GPT-4',
    'OpenAI',
    'OpenAI''s flagship language model, used via ChatGPT, API, and third-party integrations.'
  ),
  (
    'devin',
    'Devin',
    'Cognition AI',
    'Autonomous AI software engineer capable of executing long-horizon coding tasks independently.'
  ),
  (
    'cursor',
    'Cursor',
    'Anysphere',
    'AI-native code editor with agentic capabilities including autonomous edit, terminal, and commit actions.'
  ),
  (
    'gemini',
    'Gemini',
    'Google DeepMind',
    'Google''s multimodal AI model available via Google Workspace, Gemini app, and API.'
  ),
  (
    'replit',
    'Replit Agent',
    'Replit',
    'Agentic AI coding assistant embedded in the Replit development environment.'
  ),
  (
    'copilot',
    'GitHub Copilot',
    'Microsoft / GitHub',
    'AI pair programmer and Copilot Workspace agent integrated into GitHub and VS Code.'
  ),
  (
    'perplexity',
    'Perplexity',
    'Perplexity AI',
    'AI-powered search and research agent capable of browsing the web and synthesizing results.'
  )
ON CONFLICT (slug) DO NOTHING;

-- ─── Tags ────────────────────────────────────────────────────────────────────
INSERT INTO tags (slug, label, description) VALUES
  (
    'hallucination',
    'hallucination',
    'The agent confidently generated false information, fabricated APIs, URLs, or facts.'
  ),
  (
    'expensive-mistake',
    'expensive-mistake',
    'The agent''s actions resulted in significant unexpected financial costs.'
  ),
  (
    'wrong-recipient',
    'wrong-recipient',
    'Messages, emails, or data were sent to unintended recipients.'
  ),
  (
    'deleted-data',
    'deleted-data',
    'The agent permanently deleted files, database records, or storage objects.'
  ),
  (
    'security-fail',
    'security-fail',
    'Credentials, secrets, or sensitive data were exposed or mishandled.'
  ),
  (
    'social-blunder',
    'social-blunder',
    'The agent caused embarrassment, reputation damage, or interpersonal harm.'
  ),
  (
    'code-disaster',
    'code-disaster',
    'The agent produced, committed, or deployed broken, destructive, or insecure code.'
  ),
  (
    'infinite-loop',
    'infinite-loop',
    'The agent entered an unrecoverable loop, causing resource exhaustion or runaway costs.'
  ),
  (
    'scope-creep',
    'scope-creep',
    'The agent took actions far beyond the intended scope of the task.'
  ),
  (
    'compliance-violation',
    'compliance-violation',
    'The agent''s actions violated legal, regulatory, or policy requirements.'
  ),
  (
    'data-exfiltration',
    'data-exfiltration',
    'The agent transmitted sensitive data to external or unintended destinations.'
  ),
  (
    'misunderstood-instruction',
    'misunderstood-instruction',
    'The agent fundamentally misinterpreted a clear instruction and acted on the wrong assumption.'
  )
ON CONFLICT (slug) DO NOTHING;
