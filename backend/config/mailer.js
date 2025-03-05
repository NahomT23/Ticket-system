import nodemailer from "nodemailer";
import { configDotenv } from 'dotenv';
configDotenv()




const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_PASS, 
  },
});

// Function to send an email
export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
