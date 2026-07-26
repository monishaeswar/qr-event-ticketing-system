const nodemailer = require('nodemailer');

let transporter;

// Reuses a single transporter instance across the app instead of creating
// a new SMTP connection on every email send.
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

module.exports = { getTransporter };
