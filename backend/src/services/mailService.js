import axios from "axios";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("🟡 BREVO API MAIL SERVICE CALLED");

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Student Grievance Portal",
          email: "no-reply@studentgrievance.com",
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
        timeout: 10000,
      }
    );

    console.log("📧 Email sent via Brevo API:", response.data);
  } catch (err) {
    console.error(
      "❌ BREVO API MAIL ERROR:",
      err.response?.data || err.message
    );
    throw err;
  }
};
