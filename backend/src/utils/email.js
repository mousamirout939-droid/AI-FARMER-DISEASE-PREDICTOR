import nodemailer from 'nodemailer';
import env from '../config/env.js';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!env.SMTP_HOST) {
    console.warn('[Email] SMTP not configured. Emails will be logged instead of sent.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return transporter;
};

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  const t = getTransporter();
  if (!t) {
    console.log(`[Email:DRYRUN] To: ${to} | Subject: ${subject}`);
    return { dryRun: true };
  }
  return t.sendMail({ from: env.SMTP_FROM, to, subject, html, attachments });
};
