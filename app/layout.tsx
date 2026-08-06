import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Fraunces } from "next/font/google";
import { getSiteUrl } from "@/lib/utils/urls";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
});

// Editorial display face. Fraunces is a warm, high-contrast old-style serif:
// it reads as an official record rather than a dashboard, and it gives the
// page a genuine voice against the mono used for all registry data.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${fraunces.variable}`}
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
