import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../modules/user/user.model';

export interface ExtendedRequest extends Request {
  user?: IUser;
}

export const protectRoute = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token not provided"
      })
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is missing from ENV");

    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }
    const userId = decoded.id;
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized - User no longer exists" });
    }
    const userResponse = user.toObject();
    delete (userResponse as any).password;
    delete (userResponse as any).__v;

    req.user = userResponse;
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}