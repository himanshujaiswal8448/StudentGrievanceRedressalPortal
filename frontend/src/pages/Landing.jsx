import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Landing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        if (user.role === "admin" || user.role === "superAdmin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }, 300); // slight delay for smooth transition
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* === Shared TopBar === */}

      {/* === Hero Section === */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`max-w-2xl p-10 rounded-3xl shadow-2xl backdrop-blur-md border ${
            darkMode
              ? "bg-gray-900/70 border-gray-800"
              : "bg-white/70 border-gray-200"
          }`}
        >
          <div className="flex justify-center mb-5">
            <div
              className={`p-4 rounded-full ${
                darkMode ? "bg-blue-500/20" : "bg-blue-100"
              }`}
            >
              <GraduationCap
                size={50}
                className="text-blue-500 drop-shadow-md"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-3">
            Welcome to the <br />
            <span className="text-blue-500">
              Student Grievance Redressal Portal
            </span>
          </h1>

          <p className="text-gray-400 mb-8 text-base max-w-md mx-auto">
            Your voice matters. Submit grievances, track progress, and ensure
            they’re resolved transparently and efficiently.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
            >
              <LogIn size={18} />
              Login
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/register")}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md transition ${
                darkMode
                  ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              <UserPlus size={18} />
              Register
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* === Shared Footer === */}
    </div>
  );
}
