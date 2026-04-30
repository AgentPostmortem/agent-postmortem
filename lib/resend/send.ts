import { Resend } from "resend";
import { EditTokenEmail } from "./templates/EditTokenEmail";
import { getSiteUrl } from "@/lib/utils/urls";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEditTokenEmailParams {
  to: string;
  caseNumber: string | null;
  editToken: string;
  caseTitle: string;
}

/**
 * Send a one-time edit token email to the case submitter.
 * The token allows them to edit or retract their submission.
 */
export async function sendEditTokenEmail({
  to,
  caseNumber,
  editToken,
  caseTitle,
}: SendEditTokenEmailParams): Promise<void> {
  const appUrl = getSiteUrl();
  const editUrl = `${appUrl}/edit/${editToken}`;
  const subjectRef = caseNumber ?? "Pending submission";

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@agentpostmortem.com",
    to,
    subject: `Your edit link for ${subjectRef}`,
    react: EditTokenEmail({
      caseNumber,
      caseTitle,
      editUrl,
    }),
  });

  if (error) {
    console.error("[resend] Failed to send edit token email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
