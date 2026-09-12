import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'ASTRA Grievance Portal <grievance@astraietm.in>';
const APP_URL = process.env.NEXTAUTH_URL || 'https://grievance.astraietm.in';

function formatStatus(status: string): string {
  switch (status.toUpperCase()) {
    case 'SUBMITTED':
      return 'Submitted';
    case 'UNDER_REVIEW':
      return 'Under Review';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'AWAITING_INFO':
      return 'Awaiting Information';
    case 'RESOLVED':
      return 'Resolved';
    case 'CLOSED':
      return 'Closed';
    case 'REJECTED':
      return 'Rejected';
    default:
      return status;
  }
}

function getStatusBadgeColor(status: string): { bg: string; text: string; border: string } {
  switch (status.toUpperCase()) {
    case 'SUBMITTED':
      return { bg: '#1e293b', text: '#38bdf8', border: '#38bdf8' };
    case 'UNDER_REVIEW':
      return { bg: '#1e1b4b', text: '#a855f7', border: '#a855f7' };
    case 'IN_PROGRESS':
      return { bg: '#172554', text: '#60a5fa', border: '#60a5fa' };
    case 'AWAITING_INFO':
      return { bg: '#451a03', text: '#fbbf24', border: '#fbbf24' };
    case 'RESOLVED':
      return { bg: '#064e3b', text: '#34d399', border: '#34d399' };
    case 'CLOSED':
      return { bg: '#27272a', text: '#a1a1aa', border: '#a1a1aa' };
    case 'REJECTED':
      return { bg: '#450a0a', text: '#f87171', border: '#f87171' };
    default:
      return { bg: '#1e293b', text: '#f4f4f5', border: '#71717a' };
  }
}

export interface SendSubmissionEmailParams {
  toEmail: string;
  submitterName?: string | null;
  publicId: string;
  subject: string;
  categoryName: string;
  status: string;
}

export interface SendStatusUpdateEmailParams {
  toEmail: string;
  submitterName?: string | null;
  publicId: string;
  subject: string;
  categoryName?: string;
  oldStatus?: string;
  newStatus: string;
  responseMessage?: string;
}

/**
 * Sends confirmation email when a user submits a new grievance.
 */
export async function sendGrievanceSubmissionEmail(params: SendSubmissionEmailParams) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY is not set. Email notification skipped for grievance:', params.publicId);
    return { success: false, skipped: true, reason: 'RESEND_API_KEY missing' };
  }

  const { toEmail, submitterName, publicId, subject, categoryName, status } = params;
  const trackingUrl = `${APP_URL}/track?id=${encodeURIComponent(publicId)}`;
  const statusFormatted = formatStatus(status);
  const badgeColors = getStatusBadgeColor(status);
  const recipientDisplayName = submitterName || 'Student / Member';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Grievance Submitted - ${publicId}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e2e8f0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 600px; background-color: #111827; border: 2px solid #334155; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #1e293b; padding: 24px 32px; border-bottom: 2px solid #334155;">
                    <table width="100%">
                      <tr>
                        <td>
                          <span style="font-size: 11px; font-weight: bold; color: #ffe600; letter-spacing: 2px; text-transform: uppercase;">ASTRA IETM</span>
                          <h1 style="margin: 4px 0 0 0; font-size: 20px; font-weight: 800; color: #ffffff;">Confidential Grievance Portal</h1>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 32px;">
                    <h2 style="margin-top: 0; color: #38bdf8; font-size: 18px; font-weight: 700;">
                      Grievance Received & Recorded
                    </h2>
                    
                    <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px;">
                      Hello <strong style="color: #f8fafc;">${recipientDisplayName}</strong>,<br>
                      Your grievance has been successfully submitted to the portal. Your identity is verified for platform integrity but remains strictly confidential from reviewers.
                    </p>

                    <!-- Ticket Card -->
                    <div style="background-color: #0f172a; border: 1px solid #1e293b; border-left: 4px solid #ffe600; border-radius: 6px; padding: 20px; margin-bottom: 28px;">
                      <table width="100%" cellpadding="4" cellspacing="0">
                        <tr>
                          <td style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Grievance ID</td>
                          <td align="right" style="font-size: 14px; font-family: monospace; font-weight: 700; color: #ffe600;">${publicId}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Subject</td>
                          <td align="right" style="font-size: 14px; font-weight: 600; color: #f8fafc;">${subject}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Category</td>
                          <td align="right" style="font-size: 14px; color: #cbd5e1;">${categoryName}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; padding-top: 8px;">Current Status</td>
                          <td align="right" style="padding-top: 8px;">
                            <span style="display: inline-block; padding: 4px 12px; background-color: ${badgeColors.bg}; color: ${badgeColors.text}; border: 1px solid ${badgeColors.border}; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                              ${statusFormatted}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Call to Action -->
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #ffe600; color: #000000; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 3px 3px 0px #38bdf8;">
                        Track Grievance Status &rarr;
                      </a>
                    </div>

                    <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px;">
                      You will receive further email notifications whenever an administrator updates the status or responds to your grievance.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0b0f19; padding: 20px 32px; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #475569;">
                    ASTRA IETM &bull; Cyber Security Department Association<br>
                    KMCT Institute of Engineering and Technology
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [toEmail],
      subject: `[ASTRA Grievance] Submitted: ${publicId} - ${subject}`,
      html,
    });

    console.log('[Resend] Email sent successfully for grievance:', publicId, data);
    return { success: true, data };
  } catch (error) {
    console.error('[Resend] Failed to send grievance submission email:', error);
    return { success: false, error };
  }
}

/**
 * Sends notification email when a grievance status is updated.
 */
export async function sendGrievanceStatusUpdateEmail(params: SendStatusUpdateEmailParams) {
  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY is not set. Status update email skipped for grievance:', params.publicId);
    return { success: false, skipped: true, reason: 'RESEND_API_KEY missing' };
  }

  const { toEmail, submitterName, publicId, subject, newStatus, responseMessage } = params;
  const trackingUrl = `${APP_URL}/track?id=${encodeURIComponent(publicId)}`;
  const statusFormatted = formatStatus(newStatus);
  const badgeColors = getStatusBadgeColor(newStatus);
  const recipientDisplayName = submitterName || 'Student / Member';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Status Update - ${publicId}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e2e8f0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 600px; background-color: #111827; border: 2px solid #334155; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #1e293b; padding: 24px 32px; border-bottom: 2px solid #334155;">
                    <table width="100%">
                      <tr>
                        <td>
                          <span style="font-size: 11px; font-weight: bold; color: #38bdf8; letter-spacing: 2px; text-transform: uppercase;">ASTRA IETM</span>
                          <h1 style="margin: 4px 0 0 0; font-size: 20px; font-weight: 800; color: #ffffff;">Grievance Status Update</h1>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 32px;">
                    <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin-top: 0; margin-bottom: 24px;">
                      Hello <strong style="color: #f8fafc;">${recipientDisplayName}</strong>,<br>
                      The status of your submitted grievance has been updated by the reviewing committee.
                    </p>

                    <!-- Ticket Card -->
                    <div style="background-color: #0f172a; border: 1px solid #1e293b; border-left: 4px solid ${badgeColors.border}; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                      <table width="100%" cellpadding="4" cellspacing="0">
                        <tr>
                          <td style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Grievance ID</td>
                          <td align="right" style="font-size: 14px; font-family: monospace; font-weight: 700; color: #ffe600;">${publicId}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Subject</td>
                          <td align="right" style="font-size: 14px; font-weight: 600; color: #f8fafc;">${subject}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; padding-top: 8px;">New Status</td>
                          <td align="right" style="padding-top: 8px;">
                            <span style="display: inline-block; padding: 4px 12px; background-color: ${badgeColors.bg}; color: ${badgeColors.text}; border: 1px solid ${badgeColors.border}; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                              ${statusFormatted}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>

                    ${
                      responseMessage
                        ? `
                      <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 16px; margin-bottom: 28px;">
                        <span style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Official Response / Remark:</span>
                        <p style="font-size: 14px; color: #f1f5f9; margin: 8px 0 0 0; white-space: pre-wrap; line-height: 1.5;">${responseMessage}</p>
                      </div>
                    `
                        : ''
                    }

                    <!-- Call to Action -->
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${trackingUrl}" target="_blank" style="display: inline-block; background-color: #38bdf8; color: #0f172a; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 3px 3px 0px #ffe600;">
                        View Full Details &rarr;
                      </a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0b0f19; padding: 20px 32px; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #475569;">
                    ASTRA IETM &bull; Cyber Security Department Association<br>
                    KMCT Institute of Engineering and Technology
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const data = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [toEmail],
      subject: `[ASTRA Grievance] Status Update: ${publicId} is now ${statusFormatted}`,
      html,
    });

    console.log('[Resend] Status update email sent successfully:', publicId, data);
    return { success: true, data };
  } catch (error) {
    console.error('[Resend] Failed to send status update email:', error);
    return { success: false, error };
  }
}
