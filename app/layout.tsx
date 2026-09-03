import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/utils/urls";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: "AgentPostmortem — Ops agents, installed",
    template: "%s | AgentPostmortem",
  },
  description:
    "Done-for-you pilot: an agent that closes support tickets within policy and runs portal ops with screenshot proof. Live in 14 days.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    siteName: "AgentPostmortem",
    type: "website",
    locale: "en_US",
    title: "AgentPostmortem — Ops agents, installed",
    description:
      "Done-for-you pilot: an agent that closes support tickets within policy and runs portal ops with screenshot proof. Live in 14 days.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    site: "@agentpostmortem",
    title: "AgentPostmortem — Ops agents, installed",
    description:
      "Done-for-you pilot: an agent that closes support tickets and runs portal ops. Live in 14 days.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AgentPostmortem",
    url: siteUrl,
    description:
      "Done-for-you AI agent installs for support and ops teams, built on documented failure evidence.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg-canvas text-text-primary font-sans antialiased">
        <div aria-hidden="true" className="grain" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
