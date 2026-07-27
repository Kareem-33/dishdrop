import { Router } from 'express';
import {
  changePassword,
  deleteProfile,
  editProfile,
  getProfile,
  googleAuth,
  login,
  logout,
  resetPassword,
  sendResetPasswordEmail,
  sendVerificationEmail,
  signup,
  verifyEmail
} from './user.controller';
import { protectRoute } from '../../middleware/auth.middleware';

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/logout", protectRoute, logout);

// router.get("/me", protectRoute, () => { });
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, editProfile);
router.delete("/profile", protectRoute, deleteProfile);

router.patch("/change-password", protectRoute, changePassword);

router.post("/send-verification-email", protectRoute, sendVerificationEmail);
router.get("/verify-email", verifyEmail);

router.post("/send-reset-password-email", sendResetPasswordEmail);
router.post("/reset-password", resetPassword);

export default router;