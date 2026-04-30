import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AgentPostmortem — AI Failure Case Files",
    template: "%s | AgentPostmortem",
  },
  description:
    "A public ledger of AI agent failures. Real cases, real damages. Submitted anonymously. Read so you don't repeat.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://agentpostmortem.com",
  ),
  openGraph: {
    siteName: "AgentPostmortem",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@agentpostmortem",
  },
  robots: {
    index: true,
    follow: true,
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
