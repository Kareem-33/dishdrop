import { resend } from '../config/resend';

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    const data = await resend.emails.send({
      from: `Dish Drop <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });

    return data;
  } catch (error) {
    console.log(`Error sending email to ${to}:`, error);
    throw new Error('Email failed to send');
  }
};