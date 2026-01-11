import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // ===== EXISTING FIELDS (UNCHANGED) =====
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true, minlength: 6 },

    role: {
      type: String,
      enum: ["student", "admin", "superAdmin"],
      default: "student",
    },

    department: { type: String, trim: true },

    isActive: { type: Boolean, default: true },

    // ===== NEW FIELDS (FOR EMAIL + OTP FEATURE) =====

    // Account verification (Signup OTP)
    isVerified: {
      type: Boolean,
      default: false,
    },

    // OTP for signup & login verification
    otp: {
      type: String,
    },

    // OTP expiry time
    otpExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
