// server/services/emailService.js
const nodemailer = require('nodemailer');

const sendHealthReport = async (email, reportData) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
    to: email,
    subject: 'Weekly Health Report',
    html: `<h1>Your Health Summary</h1><p>Steps: ${reportData.steps}</p>`
  });
};