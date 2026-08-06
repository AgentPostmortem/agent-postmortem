export interface AgentMeta {
  slug: string;
  name: string;
  company: string;
  description: string;
}

export const AGENTS: AgentMeta[] = [
  {
    slug: "claude",
    name: "Claude",
    company: "Anthropic",
    description:
      "Anthropic's AI assistant and agent, used via API, Claude.ai, and third-party integrations.",
  },
  {
    slug: "gpt-4",
    name: "GPT-4",
    company: "OpenAI",
    description: "OpenAI's flagship model, used via ChatGPT, API, and plugins.",
  },
  {
    slug: "openai",
    name: "OpenAI",
    company: "OpenAI",
    description:
      "OpenAI's omni model with vision, audio, and agentic capabilities.",
  },
  {
    slug: "o1",
    name: "o1",
    company: "OpenAI",
    description:
      "OpenAI's reasoning model optimized for complex multi-step tasks.",
  },
  {
    slug: "o3",
    name: "o3",
    company: "OpenAI",
    description:
      "OpenAI's next-generation reasoning model with extended thinking.",
  },
  {
    slug: "devin",
    name: "Devin",
    company: "Cognition AI",
    description:
      "Autonomous AI software engineer capable of executing long-horizon coding tasks independently.",
  },
  {
    slug: "cursor",
    name: "Cursor",
    company: "Anysphere",
    description:
      "AI-native code editor with agentic capabilities including autonomous edit, terminal, and commit.",
  },
  {
    slug: "gemini",
    name: "Gemini",
    company: "Google DeepMind",
    description:
      "Google's multimodal AI model available via Google Workspace, Gemini app, and API.",
  },
  {
    slug: "gemini-2",
    name: "Gemini 2.0",
    company: "Google DeepMind",
    description:
      "Google's agentic multimodal model with real-time tool use and grounding.",
  },
  {
    slug: "replit",
    name: "Replit Agent",
    company: "Replit",
    description:
      "Agentic AI coding assistant embedded in the Replit development environment.",
  },
  {
    slug: "copilot",
    name: "GitHub Copilot",
    company: "Microsoft / GitHub",
    description:
      "AI pair programmer and Copilot Workspace agent integrated into GitHub and VS Code.",
  },
  {
    slug: "perplexity",
    name: "Perplexity",
    company: "Perplexity AI",
    description:
      "AI-powered search and research agent capable of browsing the web and synthesizing results.",
  },
  {
    slug: "codeium",
    name: "Windsurf (Codeium)",
    company: "Codeium",
    description:
      "AI coding assistant and agentic IDE with autonomous code generation and refactoring.",
  },
  {
    slug: "mistral",
    name: "Mistral",
    company: "Mistral AI",
    description:
      "Open-weight and API-served language models used in production agentic pipelines.",
  },
  {
    slug: "llama",
    name: "Llama",
    company: "Meta AI",
    description:
      "Meta's open-weight language model family, self-hosted or via third-party services.",
  },
  {
    slug: "autogpt",
    name: "AutoGPT",
    company: "Significant Gravitas",
    description:
      "Open-source autonomous GPT-4 agent that chains reasoning and tool use without human input.",
  },
  {
    slug: "langchain-agent",
    name: "LangChain Agent",
    company: "LangChain",
    description:
      "Framework-built agents using LangChain's tool-calling and chain-of-thought primitives.",
  },
  {
    slug: "bing-chat",
    name: "Copilot (Bing)",
    company: "Microsoft",
    description:
      "Microsoft's web-integrated AI assistant powered by GPT-4 with browsing capabilities.",
  },
  {
    slug: "character-ai",
    name: "Character.AI",
    company: "Character Technologies",
    description:
      "Persona-based AI chat platform used for roleplay and creative applications.",
  },
  {
    slug: "aider",
    name: "Aider",
    company: "Paul Gauthier",
    description:
      "Open-source AI pair programming tool that autonomously edits codebases from the terminal.",
  },
  {
    slug: "agentgpt",
    name: "AgentGPT",
    company: "Reworkd AI",
    description:
      "Browser-based autonomous GPT agent that plans and executes multi-step goals.",
  },
  {
    slug: "openai-assistants",
    name: "OpenAI Assistants API",
    company: "OpenAI",
    description:
      "OpenAI's hosted agent runtime with code interpreter, retrieval, and function calling.",
  },
  {
    slug: "aws-bedrock-agent",
    name: "AWS Bedrock Agent",
    company: "Amazon",
    description:
      "Amazon's managed agent service built on foundation models with tool use and knowledge bases.",
  },
  {
    slug: "azure-openai",
    name: "Azure OpenAI",
    company: "Microsoft / OpenAI",
    description:
      "Enterprise-hosted OpenAI models via Azure, used in internal tooling and automation.",
  },
  {
    slug: "google-agentspace",
    name: "Google Agentspace",
    company: "Google",
    description:
      "Google's enterprise AI agent platform for internal knowledge and workflow automation.",
  },
  {
    slug: "zapier-ai",
    name: "Zapier AI",
    company: "Zapier",
    description:
      "AI-powered automation agent that orchestrates workflows across thousands of connected apps.",
  },
  {
    slug: "make-ai",
    name: "Make (Integromat) AI",
    company: "Make",
    description:
      "Visual automation platform with AI modules that execute multi-step workflows autonomously.",
  },
  {
    slug: "n8n",
    name: "n8n AI Agent",
    company: "n8n GmbH",
    description:
      "Open-source workflow automation with LLM-powered agent nodes.",
  },
  {
    slug: "crew-ai",
    name: "CrewAI",
    company: "CrewAI Inc.",
    description:
      "Multi-agent orchestration framework for running teams of specialized AI agents.",
  },
  {
    slug: "anthropic-api",
    name: "Anthropic API (custom)",
    company: "Anthropic",
    description:
      "Custom agents built directly on the Anthropic API without a named product wrapper.",
  },
  {
    slug: "openai-api",
    name: "OpenAI API (custom)",
    company: "OpenAI",
    description:
      "Custom agents built directly on the OpenAI API without a named product wrapper.",
  },
  {
    slug: "microsoft-365-copilot",
    name: "Microsoft 365 Copilot",
    company: "Microsoft",
    description:
      "Microsoft's AI assistant embedded across Microsoft 365 apps, with access to Outlook, OneDrive, SharePoint and Teams content.",
  },
  {
    slug: "kiro",
    name: "Kiro",
    company: "Amazon",
    description:
      "Amazon's agentic AI coding assistant, used internally and by AWS customers for autonomous development tasks.",
  },
  {
    slug: "workday",
    name: "Workday AI Screening",
    company: "Workday",
    description:
      "Workday's AI-powered recruiting and applicant screening tools, used by employers to filter job applications at scale.",
  },
  {
    slug: "semantic-kernel",
    name: "Microsoft Semantic Kernel",
    company: "Microsoft",
    description:
      "Microsoft's open-source agent framework for orchestrating LLM tool use across .NET, Python and Java.",
  },
  {
    slug: "mcp",
    name: "Model Context Protocol (MCP)",
    company: "Anthropic",
    description:
      "Open protocol and SDKs connecting AI agents to external tools, data sources and servers.",
  },
  {
    slug: "grok",
    name: "Grok",
    company: "xAI",
    description: "xAI's conversational model, deployed on X and via API.",
  },
  {
    slug: "other",
    name: "Other / Unknown",
    company: "Unknown",
    description:
      "Agent or model not listed above, or identity unknown at time of incident.",
  },
];
