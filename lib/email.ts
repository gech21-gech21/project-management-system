import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

// Helper function to get safe email recipient
function getSafeRecipient(email: string): string {
  // In development, only send to verified email addresses
  if (process.env.NODE_ENV === "development") {
    const verifiedEmail =
      process.env.RESEND_VERIFIED_EMAIL || "fikadegetahun695@gmail.com";
    console.log(
      `Development: Redirecting email from ${email} to ${verifiedEmail}`
    );
    return verifiedEmail;
  }
  return email;
}

// Helper function to get safe from email
function getFromEmail(): string {
  if (process.env.NODE_ENV === "production") {
    return process.env.MAIL_FROM || "noreply@yourdomain.com"; // Use your verified domain
  } else {
    return process.env.MAIL_FROM || "onboarding@resend.dev";
  }
}

export async function sendVerificationEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  try {
    console.log("Sending verification email to:", email);
    console.log(
      "Using Resend API key:",
      process.env.RESEND_API_KEY ? "Present" : "Missing"
    );
    console.log("From email:", getFromEmail());
    console.log("Environment:", process.env.NODE_ENV);

    const verifyUrl = `${appUrl}/api/auth/verify-email?token=${encodeURIComponent(
      token
    )}`;

    console.log("Verification URL:", verifyUrl);

    const safeRecipient = getSafeRecipient(email);
    const fromEmail = getFromEmail();

    console.log("Actual recipient:", safeRecipient);

    const result = await resend.emails.send({
      from: fromEmail,
      to: safeRecipient,
      subject: "Verify your email",
      html: `<p>Welcome! Click to verify your email:</p><p><a href="${verifyUrl}">Verify Email</a></p>`,
    });

    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const resetUrl = `${appUrl}/auth/reset?token=${encodeURIComponent(token)}`;

  const safeRecipient = getSafeRecipient(email);
  const fromEmail = getFromEmail();

  await resend.emails.send({
    from: fromEmail,
    to: safeRecipient,
    subject: "Reset your password",
    html: `<p>You requested a password reset.</p><p>Reset here: <a href="${resetUrl}">Reset Password</a></p>`,
  });
}
