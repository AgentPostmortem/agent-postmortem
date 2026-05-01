import type { Metadata } from "next";
import { EditCaseClient } from "./EditClient";

export const metadata: Metadata = {
  title: "Edit Case — AgentPostmortem",
  description: "Amend your AI agent failure case report.",
  robots: { index: false },
};

export default function EditCasePage() {
  return <EditCaseClient />;
}
