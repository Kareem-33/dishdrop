import { verificationEmailTemplate } from "../../templates/emails/verification.template";
import { hashToken } from "../../utils/hashToken";
import { sendEmail } from "../../utils/sendEmail";
import crypto from "crypto";
import { IUser } from "./user.model";


export const sendVerificationEmailService = async (user: IUser) => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedVerificationToken = hashToken(verificationToken);

  user.verificationToken = hashedVerificationToken;
  user.verificationExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const verificationLink = `${process.env.API_URL}/users/verify-email?token=${verificationToken}`;
  const html = verificationEmailTemplate(verificationLink);

  await sendEmail(
    user.email,
    'Verify Your Email',
    html
  );
};