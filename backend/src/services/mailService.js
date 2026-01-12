import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  console.log("🟡 MAIL SERVICE CALLED");
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS EXISTS:", !!process.env.SMTP_PASS);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Student Grievance Portal" <no-reply@studentgrievance.com>`,
    to,
    subject,
    html,
  });

  console.log("📧 Email sent to:", to);
};
