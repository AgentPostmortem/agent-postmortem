import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/utils/urls";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    default: "AgentPostmortem — AI Failure Case Files",
    template: "%s | AgentPostmortem",
  },
  description:
    "A public ledger of AI agent failures. Real cases, real damages. Submitted anonymously. Read so you don't repeat.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    siteName: "AgentPostmortem",
    type: "website",
    locale: "en_US",
    title: "AgentPostmortem — AI Failure Case Files",
    description:
      "A public ledger of AI agent failures. Real cases, real damages. Submitted anonymously. Read so you don't repeat.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    site: "@agentpostmortem",
    title: "AgentPostmortem — AI Failure Case Files",
    description:
      "A public ledger of AI agent failures. Real cases, real damages. Submitted anonymously.",
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
      "A public registry of documented AI agent failures and operational lessons.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg-canvas text-text-primary font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
