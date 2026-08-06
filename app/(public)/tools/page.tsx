import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools — AgentPostmortem",
  description:
    "The agent operating suite: tools for building, testing, operating, and supervising AI agents.",
};

type Tool = {
  href: string;
  label: string;
  description: string;
  badge: string;
};

const AGENTS: Tool[] = [
  {
    href: "https://resolvd.agentpostmortem.com",
    label: "Resolvd",
    description:
      "Support inbox operator that auto-resolves within policy and escalates the rest with a proposed action.",
    badge: "Live",
  },
  {
    href: "https://greenlite.agentpostmortem.com",
    label: "Greenlite",
    description:
      "One-tap human-in-the-loop approval cockpit for agent escalations, on web and mobile.",
    badge: "Live",
  },
  {
    href: "https://relayg.agentpostmortem.com",
    label: "RelayG",
    description:
      "Support triage as a LangGraph state machine: typed state, checkpointing, and a human interrupt for risky actions.",
    badge: "Live",
  },
  {
    href: "https://webhands.agentpostmortem.com",
    label: "Webhands",
    description:
      "Computer-use agent for tools with no API: it drives a real browser and refuses any write until you confirm it.",
    badge: "Live",
  },
  {
    href: "https://bridgekit.agentpostmortem.com",
    label: "Bridgekit",
    description:
      "Scoped MCP server that exposes company tools to agents with per-client permission boundaries and an audit log.",
    badge: "Live",
  },
  {
    href: "https://tracecase.agentpostmortem.com",
    label: "Tracecase",
    description:
      "CI for AI agents: record real runs, replay them against prompt and model changes, and catch regressions before they ship.",
    badge: "Live",
  },
  {
    href: "https://mcp.agentpostmortem.com",
    label: "Casebook MCP",
    description:
      "Live Model Context Protocol server that makes this failure registry queryable by any agent.",
    badge: "Live",
  },
  {
    href: "https://chat.agentpostmortem.com",
    label: "Casebook Chat",
    description:
      "Streaming investigation assistant that tool-calls the MCP server and answers with cited real case IDs.",
    badge: "Live",
  },
  {
    href: "https://injection-arena.agentpostmortem.com",
    label: "Injection Arena",
    description:
      "Self-hostable prompt-injection challenge: ten levels stack real defenses and a server-side judge scores every crack.",
    badge: "Live",
  },
];

const TOOLING: Tool[] = [
  {
    href: "https://www.npmjs.com/package/tokencut",
    label: "tokencut",
    description:
      "Measure and cut the token cost of an LLM or agent message payload before you send it: truncate bloated tool results, drop duplicate context, trim to a budget. Zero model calls.",
    badge: "npm",
  },
  {
    href: "https://www.npmjs.com/package/@royalpinto007/mcp-audit",
    label: "MCP-audit",
    description:
      "Security scanner for MCP servers, like npm audit for the Model Context Protocol: 18 rules, SARIF output.",
    badge: "npm",
  },
  {
    href: "https://www.npmjs.com/package/@royalpinto007/skill-audit",
    label: "Skill-audit",
    description:
      "Security scanner for agent skills: flags prompt-injection, dangerous shell, secret access, and exfiltration before you install a Claude/agent Skill. 31 rules, SARIF.",
    badge: "npm",
  },
  {
    href: "https://www.npmjs.com/package/ctxtrim",
    label: "Ctxtrim",
    description:
      "Trims AI-context bloat: finds the files ballooning your Claude Code, Cursor, and Codex token cost and writes the ignore files to cut it.",
    badge: "npm",
  },
  {
    href: "https://www.npmjs.com/package/@royalpinto007/evalgate",
    label: "Evalgate",
    description:
      "Prompt and agent regression CI: the build fails when your prompt gets dumber, with a per-PR quality delta.",
    badge: "npm",
  },
  {
    href: "https://pypi.org/project/ctxlens-cli/",
    label: "Ctxlens",
    description:
      "Context-window profiler for agents: shows what is eating your context per turn and recommends what to cut.",
    badge: "PyPI",
  },
  {
    href: "https://pypi.org/project/answerproof/",
    label: "Answerproof",
    description:
      "Verifiable, tamper-evident receipts for RAG answers: Merkle inclusion proofs and Ed25519 signatures.",
    badge: "PyPI",
  },
  {
    href: "https://github.com/royalpinto007/Agentrace",
    label: "Agentrace",
    description:
      "Observability for AI agents: parses session transcripts with no instrumentation and flags results you should not trust.",
    badge: "GitHub",
  },
  {
    href: "https://github.com/royalpinto007/Voiceeval",
    label: "Voiceeval",
    description:
      "Evaluation for voice agents: catches misheard numbers, missing confirmations, and blown latency budgets.",
    badge: "GitHub",
  },
  {
    href: "https://github.com/royalpinto007/VaultRAG",
    label: "VaultRAG",
    description:
      "Permission-aware RAG where the access-control check lives inside the retrieval query; CI fails on any leak.",
    badge: "GitHub",
  },
  {
    href: "https://github.com/royalpinto007/Tenantq",
    label: "Tenantq",
    description:
      "Multi-tenant hybrid search on Qdrant: payload tenant isolation, dense and sparse RRF, HNSW tuning, and benchmarks.",
    badge: "GitHub",
  },
];

const LISTS: Tool[] = [
  {
    href: "https://mcp-security.agentpostmortem.com",
    label: "Awesome MCP Security",
    description:
      "Curated, auto-updating directory of tools, standards, and research for securing Model Context Protocol servers, organized by what each one defends against.",
    badge: "List",
  },
  {
    href: "https://context-engineering.agentpostmortem.com",
    label: "Awesome Context Engineering",
    description:
      "Practitioner-first directory for context engineering: fitting the right tokens in the window, and fighting context rot with the tool that mitigates each failure mode.",
    badge: "List",
  },
  {
    href: "https://agent-memory.agentpostmortem.com",
    label: "Awesome Agent Memory",
    description:
      "Vendor-neutral directory of frameworks, stores, benchmarks, and papers for AI agent memory, with benchmarks as a first-class category.",
    badge: "List",
  },
  {
    href: "https://agent-skills.agentpostmortem.com",
    label: "Awesome Agent Skills",
    description:
      "A small, verified, security-aware directory of Agent Skills (SKILL.md), curated for trust with a first-class security section the volume lists skip.",
    badge: "List",
  },
  {
    href: "https://github.com/royalpinto007/ship-skills",
    label: "ship-skills",
    description:
      "Authored Agent Skills that make a repo shippable: tests, CI, packaging, release, and repo hygiene. Run ship-context, then ship-checklist sequences the rest.",
    badge: "Skills",
  },
  {
    href: "https://github.com/royalpinto007/distro-skills",
    label: "distro-skills",
    description:
      "Authored Agent Skills that distribute a dev or indie product across GitHub, Hacker News, Reddit, dev.to, and more. The distribution counterpart to ship-skills.",
    badge: "Skills",
  },
];

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-sm border border-border-default bg-bg-surface p-4 transition-colors hover:border-border-strong hover:bg-bg-elevated"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm text-text-primary transition-colors group-hover:text-accent">
          {tool.label}
        </span>
        <span className="shrink-0 rounded-sm border border-border-strong px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
          {tool.badge}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        {tool.description}
      </p>
    </a>
  );
}

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border-default pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
          Agent operating suite
        </p>
        <h1 className="mt-2 font-serif text-3xl font-normal text-text-primary">
          Tools
        </h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Tools for building, testing, operating, and supervising AI agents,
          built alongside this failure registry. Everything below is live.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-accent">
          Agents &amp; operations
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-accent">
          Tooling &amp; evals
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLING.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-accent">
          Curated lists &amp; skills packs
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LISTS.map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      <div className="mt-10 border-t border-border-default pt-6">
        <p className="font-mono text-xs text-text-tertiary">
          Built by{" "}
          <a
            href="https://royalpinto007.agentpostmortem.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Royal Simpson Pinto
          </a>
          . Open source on{" "}
          <a
            href="https://github.com/royalpinto007"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
