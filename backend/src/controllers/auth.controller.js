import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateOTP } from "../services/otpService.js";
import { sendEmail } from "../services/mailService.js";

// REGISTER (SEND OTP)

export const register = async (req, res) => {
  console.log("🔥 REGISTER API HIT:", req.body.email);

  try {
    const { name, email, password, department } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hash,
      department,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 min
      isVerified: false,
    });

    console.log("📤 SENDING OTP TO:", email);

    await sendEmail({
      to: email,
      subject: "Verify Your Account – OTP",
      html: `
        <h2>Student Grievance Portal</h2>
        <p>Your verification OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes</p>
      `,
    });

    return res.status(201).json({
      message: "OTP sent to email for verification",
      email: user.email,
    });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    console.error("❌ REGISTER ERROR FULL:", e);

    return res.status(500).json({ message: e.message });
  }
};

//  VERIFY SIGNUP OTP

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.json({ message: "Account verified successfully" });
  } catch (e) {
    console.error("VERIFY OTP ERROR:", e);
    return res.status(500).json({ message: e.message });
  }
};

// LOGIN (SEND LOGIN OTP)

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for:", email);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Verify your email first" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    await sendEmail({
      to: email,
      subject: "Login OTP – Student Grievance Portal",
      html: `
        <p>Your login OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });

    return res.json({ message: "Login OTP sent to email" });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return res.status(500).json({ message: e.message });
  }
};

// VERIFY LOGIN OTP

export const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    console.log("Login successful for:", user.email);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error("VERIFY LOGIN OTP ERROR:", e);
    return res.status(500).json({ message: e.message });
  }
};

console.log("OTP GENERATED:", otp);
console.log("SENDING TO:", email);
