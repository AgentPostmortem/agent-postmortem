import type { Metadata } from "next";
import { StatusClient } from "./StatusClient";

export const metadata: Metadata = {
  title: "Submission Status — AgentPostmortem",
  description: "Check the review status of your AI agent failure case report.",
  robots: { index: false },
};

export default function StatusPage() {
  return <StatusClient />;
}
