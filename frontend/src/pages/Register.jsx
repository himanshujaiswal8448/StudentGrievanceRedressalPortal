import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { User, Mail, Lock, Building } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });
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
      await register(form); // sends OTP
      toast.success("OTP sent to email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", icon: User, type: "text" },
    { name: "email", label: "Email", icon: Mail, type: "email" },
    { name: "password", label: "Password", icon: Lock, type: "password" },
    { name: "department", label: "Department (optional)", icon: Building },
  ];

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
        <h2 className="text-3xl font-semibold text-center mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Signup to Student Grievance Portal
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          {fields.map(({ name, label, icon: Icon, type }) => (
            <div key={name} className="relative">
              <Icon
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
              <input
                type={type || "text"}
                name={name}
                value={form[name]}
                onChange={onChange}
                placeholder={label}
                required={name !== "department"}
                className="w-full pl-10 p-3 bg-transparent border border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-5 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
