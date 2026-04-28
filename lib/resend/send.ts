import { Resend } from "resend";
import { EditTokenEmail } from "./templates/EditTokenEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEditTokenEmailParams {
  to: string;
  caseNumber: string;
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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://agentpostmortem.com";
  const editUrl = `${appUrl}/case/${caseNumber.toLowerCase()}/edit?token=${editToken}`;

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@agentpostmortem.com",
    to,
    subject: `Your edit token for ${caseNumber}`,
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
