import axios from "axios";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("🟡 BREVO API MAIL SERVICE CALLED");
    console.log("📤 Sending to:", to);
    console.log("📨 Sender:", process.env.BREVO_SENDER);

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Student Grievance Portal",
          email: process.env.BREVO_SENDER,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("📧 Email accepted by Brevo:", response.data);
  } catch (error) {
    console.error(
      "❌ BREVO MAIL ERROR:",
      error.response?.data || error.message
    );
  }
};
