import nodemailer from 'nodemailer';

const getTransporter = () => {
  console.log('SMTP_HOST from env:', process.env.SMTP_HOST);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendMonthlyReportEmail = async (
  to: string,
  schoolName: string,
  summary: { totalSheets: number; byPurpose: { purpose: string; totalSheets: number }[] }
): Promise<void> => {
  const transporter = getTransporter();

  const purposeLines = summary.byPurpose
    .map((p) => `${p.purpose}: ${p.totalSheets} sheets`)
    .join('\n');

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: `${schoolName} — Monthly Paper Usage Summary`,
    text: `Monthly Paper Usage Summary for ${schoolName}\n\nTotal sheets used: ${summary.totalSheets}\n\nBreakdown by purpose:\n${purposeLines}`
  });
};

export const sendPasswordResetEmail = async (to: string, code: string): Promise<void> => {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Your Password Reset Code',
    text: `Your password reset code is: ${code}\n\nEnter this code in the app to set a new password. This code expires in 10 minutes.\n\nIf you didn't request this, you can safely ignore this email.`
  });
};