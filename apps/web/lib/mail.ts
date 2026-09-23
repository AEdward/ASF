import nodemailer from "nodemailer";

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  message: string;
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASSWORD missing).");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendContactEmail(submission: ContactSubmission) {
  const transport = getTransport();
  const from = process.env.SMTP_USER!;
  const to = (process.env.CONTACT_TO || from)
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  await transport.sendMail({
    from: `"ASF Website" <${from}>`,
    to,
    replyTo: submission.email,
    subject: `New enquiry from ${submission.name}${submission.company ? ` (${submission.company})` : ""}`,
    text: [
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      submission.company ? `Company: ${submission.company}` : null,
      "",
      submission.message,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });
}
