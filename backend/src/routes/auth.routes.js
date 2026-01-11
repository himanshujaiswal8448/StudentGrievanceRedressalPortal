import { Router } from "express";
import {
  register,
  verifyOtp,
  login,
  verifyLoginOtp,
} from "../controllers/auth.controller.js";

const router = Router();

/* ================= AUTH ROUTES ================= */
router.post("/register", register); // signup + send OTP
router.post("/verify-otp", verifyOtp); // verify signup OTP
router.post("/login", login); // login + send OTP
router.post("/verify-login-otp", verifyLoginOtp); // verify login OTP

export default router;
