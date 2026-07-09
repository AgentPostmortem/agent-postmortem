import * as React from "react";

interface EditTokenEmailProps {
  caseNumber: string | null;
  caseTitle: string;
  editUrl: string;
  statusUrl?: string;
}

/**
 * React Email template for the private edit link email.
 * Styled to match the forensic case file aesthetic.
 */
export function EditTokenEmail({
  caseNumber,
  caseTitle,
  editUrl,
  statusUrl,
}: EditTokenEmailProps) {
  const reference = caseNumber ?? "PENDING REVIEW";

  return (
    <html lang="en">
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Edit Link — {reference}</title>
      </head>
      <body
        style={{
          backgroundColor: "#0d0c0a",
          fontFamily: "Georgia, serif",
          margin: "0",
          padding: "0",
        }}
      >
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ backgroundColor: "#0d0c0a" }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "40px 16px" }}>
                <table
                  width="560"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{
                    backgroundColor: "#121110",
                    border: "1px solid #26231d",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <tbody>
                    {/* Red top bar */}
                    <tr>
                      <td
                        style={{
                          backgroundColor: "#c9a35c",
                          height: "3px",
                          fontSize: "0",
                          lineHeight: "0",
                        }}
                      >
                        &nbsp;
                      </td>
                    </tr>

                    {/* Header */}
                    <tr>
                      <td style={{ padding: "32px 40px 24px" }}>
                        <p
                          style={{
                            fontFamily: "monospace",
                            fontSize: "10px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "#5a5a5a",
                            margin: "0 0 8px",
                          }}
                        >
                          AgentPostmortem
                        </p>
                        <p
                          style={{
                            fontFamily: "monospace",
                            fontSize: "16px",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "#c9a35c",
                            margin: "0",
                            fontWeight: "bold",
                          }}
                        >
                          {reference}
                        </p>
                      </td>
                    </tr>

                    {/* Divider */}
                    <tr>
                      <td
                        style={{
                          borderTop: "1px solid #26231d",
                          padding: "0",
                          fontSize: "0",
                        }}
                      >
                        &nbsp;
                      </td>
                    </tr>

                    {/* Body */}
                    <tr>
                      <td style={{ padding: "32px 40px" }}>
                        <p
                          style={{
                            color: "#a49e91",
                            fontSize: "13px",
                            fontFamily: "monospace",
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            margin: "0 0 8px",
                          }}
                        >
                          Submission Edit Link
                        </p>
                        <p
                          style={{
                            color: "#efece5",
                            fontSize: "18px",
                            fontFamily: "Georgia, serif",
                            lineHeight: "1.4",
                            margin: "0 0 24px",
                          }}
                        >
                          {caseTitle}
                        </p>
                        <p
                          style={{
                            color: "#a49e91",
                            fontSize: "14px",
                            lineHeight: "1.6",
                            margin: "0 0 28px",
                          }}
                        >
                          You submitted this case to AgentPostmortem. Use the
                          private link below to update your submission and send
                          it back through moderation review.
                        </p>

                        {/* CTA */}
                        <table cellPadding="0" cellSpacing="0">
                          <tbody>
                            <tr>
                              <td>
                                <a
                                  href={editUrl}
                                  style={{
                                    display: "inline-block",
                                    backgroundColor: "#1f0a0a",
                                    border: "1px solid #c9a35c",
                                    borderRadius: "3px",
                                    color: "#c9a35c",
                                    fontFamily: "monospace",
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    letterSpacing: "0.15em",
                                    textDecoration: "none",
                                    textTransform: "uppercase",
                                    padding: "12px 24px",
                                  }}
                                >
                                  Edit Submission
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <p
                          style={{
                            color: "#5a5a5a",
                            fontSize: "11px",
                            fontFamily: "monospace",
                            marginTop: "20px",
                            wordBreak: "break-all",
                          }}
                        >
                          Or copy this URL: {editUrl}
                        </p>
                        {statusUrl && (
                          <p
                            style={{
                              color: "#5a5a5a",
                              fontSize: "11px",
                              fontFamily: "monospace",
                              marginTop: "12px",
                            }}
                          >
                            Check submission status:{" "}
                            <a
                              href={statusUrl}
                              style={{
                                color: "#888",
                                textDecoration: "underline",
                              }}
                            >
                              {statusUrl}
                            </a>
                          </p>
                        )}
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          borderTop: "1px solid #26231d",
                          padding: "16px 40px",
                        }}
                      >
                        <p
                          style={{
                            color: "#3a352c",
                            fontSize: "10px",
                            fontFamily: "monospace",
                            letterSpacing: "0.1em",
                            margin: "0",
                          }}
                        >
                          AgentPostmortem — agentpostmortem.com — This email
                          address is used only to deliver your private edit
                          link.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}
