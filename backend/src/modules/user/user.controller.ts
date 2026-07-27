import type { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import User from "./user.model";
import { generateJWT } from "../../utils/generateJWT";
import { ExtendedRequest } from "../../middleware/auth.middleware";
import cloudinary from "../../config/cloudinary";
import crypto from 'crypto';
import { sendEmail } from "../../utils/sendEmail";
import { googleClient } from "../../config/google";
import { resetPasswordEmailTemplate } from "../../templates/emails/resetPassword.template";
import { hashToken } from "../../utils/hashToken";
import { sendVerificationEmailService } from "./user.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, avatar } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }
    let emailName = email.split('@')[0];;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use"
      })
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    let user = await User.create({
      name: name || emailName,
      email,
      password,
    })

    let uploadResponse;
    let imageUrl;
    if (avatar) {
      uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: 'Dish Drop/avatars',
        public_id: `avatar_${user._id}`,
        overwrite: true,
        transformation: [
          { width: 500, crop: "scale" },
          { quality: "auto", fetch_format: "auto" }
        ],
      });
      imageUrl = uploadResponse.secure_url;

      user.avatar = imageUrl || '';
      await user.save();
    }

    generateJWT({ id: user._id }, res);

    await sendVerificationEmailService(user);

    const userResponse = user.toObject();
    delete (userResponse as any).password;
    delete (userResponse as any).__v;

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    })
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (user.provider === 'google') {
      return res.status(400).json({
        success: false,
        message: 'Please continue with Google',
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    generateJWT({ id: user._id }, res);

    const userResponse = user.toObject();
    delete (userResponse as any).password;
    delete (userResponse as any).__v;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: userResponse
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const logout = async (req: ExtendedRequest, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    })
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getProfile = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId).select('-password -__v');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  }
  catch (error) {
    console.error("Error in getProfile controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const editProfile = async (req: ExtendedRequest, res: Response) => {
  try {
    const { name, email, avatar } = req.body || {};
    const userId = req.user?._id;

    const updateData: any = {};
    if (name) {
      updateData.name = name;
    }
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use"
        });
      }
      updateData.email = email;
      updateData.isVerified = false;
    }
    if (avatar && avatar != "empty") {
      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: 'Dish Drop/avatars',
        public_id: `avatar_${userId}`,
        overwrite: true,
        transformation: [
          { width: 500, crop: "scale" },
          { quality: "auto", fetch_format: "auto" }
        ],
      });
      updateData.avatar = uploadResponse.secure_url;
    }
    if(avatar == "empty") {
      updateData.avatar = "";
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { returnDocument: "after" })
      .select('-password -__v');
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (email) {
      await sendVerificationEmailService(updatedUser);
    }
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error in editProfile controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const sendVerificationEmail = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
    }

    await sendVerificationEmailService(user);

    return res.status(200).json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    console.error("Error in sendVerificationEmail controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const verifyEmail = async (req: ExtendedRequest, res: Response) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Missing token"
      });
    }

    const hashedToken = hashToken(token as string);

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired verification token"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/email-verified`);

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error("Error in verifyEmail controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const sendResetPasswordEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If that email exists, a reset link was sent',
      });
    }

    if (user.provider === 'google') {
      return res.status(400).json({
        success: false,
        message: 'Password reset not available for Google accounts',
      });
    }

    const resetPasswordToken = crypto
      .randomBytes(32)
      .toString('hex');

    const hashedResetPasswordToken = hashToken(resetPasswordToken);

    user.resetPasswordToken = hashedResetPasswordToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); //15 minute
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetPasswordToken}`;
    const html = resetPasswordEmailTemplate(resetLink);
    await sendEmail(
      user.email,
      'Reset Your Password',
      html
    );

    return res.status(200).json({
      success: true,
      message: 'Reset email sent',
    });
  } catch (error) {
    console.error("Error in sendResetPasswordEmail controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const { newPassword, confirmPassword } = req.body || {};

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Missing token or new password',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match',
      });
    }

    const hashedToken = hashToken(token as string);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error("Error in resetPassword controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required',
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();


    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token',
      });
    }

    const {
      sub,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    if (!email || !email_verified) {
      return res.status(401).json({
        success: false,
        message: 'Google email not verified',
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const userName = name ?? email!.split('@')[0];
      user = await User.create({
        name: userName!,
        email: email! as string,
        avatar: picture ?? '',
        googleId: sub,
        provider: 'google',
        isVerified: true,
      });
    }

    generateJWT({ id: user._id }, res);

    const userResponse = user.toObject();
    delete (userResponse as any).password;
    delete (userResponse as any).__v;

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      data: userResponse,
    });
  } catch (error) {
    console.error("Error in googleAuth controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteProfile = async (req: ExtendedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { confirm } = req.body;

    if (!confirm) {
      return res.status(400).json({
        success: false,
        message: "Please confirm account deletion"
      });
    }
    if (confirm !== "DELETE_MY_ACCOUNT") {
      return res.status(400).json({
        success: false,
        message: "Invalid confirmation"
      });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteProfile controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const changePassword = async (req: ExtendedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};
    const userId = req.user?._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Missing current or new password"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    if (user.provider === 'google') {
      return res.status(400).json({
        success: false,
        message: 'Password change not available for Google accounts',
      });
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.password);
    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters long" });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Error in changePassword controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}