import express from "express";
import {
  register,
  verifyOtp,
  confirmPassword,
  login,
  logOut,
  forgetPassword,
  verifyOtpForPassword,
  resetPassword,
} from "../../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/confirm-password", confirmPassword);
router.post("/login", login);
router.post("/logOut", logOut);

router.post("/forget-password", forgetPassword);
router.post("/verifyOtpForPassword", verifyOtpForPassword);
router.post("/resetPassword", resetPassword);

export default router;
