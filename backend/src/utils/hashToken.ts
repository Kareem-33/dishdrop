import crypto from 'crypto';

export const hashToken = (token: string): string => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token as string)
    .digest("hex");
  return hashedToken;
}