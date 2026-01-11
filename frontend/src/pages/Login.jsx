import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("OTP sent to email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md rounded-2xl p-8 shadow-2xl ${
          darkMode ? "bg-gray-900/70 border border-gray-800" : "bg-white border"
        }`}
      >
        <h1 className="text-3xl font-semibold text-center mb-2">
          Student Grievance Portal
        </h1>
        <p className="text-gray-400 text-center mb-6">Login to continue</p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              required
              className="w-full pl-10 p-3 bg-transparent border border-gray-700 rounded-lg"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              required
              className="w-full pl-10 p-3 bg-transparent border border-gray-700 rounded-lg"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            {loading ? "Sending OTP..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
