import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";

export default function VerifyLoginOtp() {
  const { verifyLoginOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyLoginOtp(otp);
      toast.success("Login successful!");
    } catch {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-md rounded-2xl p-8 shadow-2xl ${
          darkMode
            ? "bg-gray-900/70 border border-gray-800 backdrop-blur-xl"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex flex-col items-center mb-6">
          <LockKeyhole size={40} className="text-green-500 mb-3" />
          <h2 className="text-2xl font-semibold">Verify Login OTP</h2>
          <p className="text-sm text-gray-400 text-center mt-1">
            Enter the OTP sent to your email
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
            className={`w-full p-3 rounded-lg bg-transparent border outline-none focus:ring-2 focus:ring-green-500 text-center tracking-widest text-lg ${
              darkMode
                ? "border-gray-700 text-gray-100"
                : "border-gray-300 text-gray-800"
            }`}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            {loading ? "Verifying..." : "Login"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
