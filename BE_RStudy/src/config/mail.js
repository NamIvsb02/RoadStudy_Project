const nodemailer = require("nodemailer");

const hasSmtpConfig = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

const sendMail = async ({ to, subject, text }) => {
  if (!transporter) {
    // Chưa chốt SMTP thật — in ra console để test không bị chặn
    console.log(`[DEV MAIL] To: ${to} | Subject: ${subject}\n${text}`);
    return;
  }
  await transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, text });
};

module.exports = { sendMail };
