import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("🟡 MAIL SERVICE CALLED");

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // MUST be false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
    });

    console.log("⏳ Verifying SMTP...");
    await transporter.verify();
    console.log("✅ SMTP verified");

    await transporter.sendMail({
      from: `"Student Grievance Portal" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent to:", to);
  } catch (err) {
    console.error("❌ MAIL ERROR:", err);
    throw err;
  }
};
