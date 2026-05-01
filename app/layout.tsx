import type { Metadata } from "next";
import localFont from "next/font/local";
import { getSiteUrl } from "@/lib/utils/urls";
import "./globals.css";

const GeistSans = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-sans",
  display: "swap",
});

const GeistMono = localFont({
  src: "../node_modules/geist/dist/fonts/geist-mono/GeistMono-Variable.woff2",
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
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg-canvas text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
