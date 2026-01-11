import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  // 🔴 DEBUG — ADD HERE
  console.log("DEBUG ENV:", {
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS_EXISTS: !!process.env.EMAIL_PASS,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Student Grievance Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("📧 Email sent to:", to);
};
