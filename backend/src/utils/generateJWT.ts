import { Response } from 'express';
import jwt from 'jsonwebtoken';

export const generateJWT = (payload: object, res: Response) => {
  const secret = process.env.JWT_SECRET;

    if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign(payload, secret, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return token;
}