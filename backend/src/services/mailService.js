import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("🟡 MAIL SERVICE CALLED");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // MUST be false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // 🔥 REQUIRED ON RENDER
      },
    });

    // 🔍 Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP connection verified");

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
