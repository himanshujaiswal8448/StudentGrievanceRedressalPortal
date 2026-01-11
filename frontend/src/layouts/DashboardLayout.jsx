import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { Moon, Sun, LogOut, LayoutDashboard, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/Footer.jsx";

export default function DashboardLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);

  // Load theme preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");
    if (storedTheme !== null) setDarkMode(JSON.parse(storedTheme));
  }, []);

  // Persist theme & apply body background
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.className = darkMode
      ? "bg-gray-950 text-gray-100"
      : "bg-gray-50 text-gray-900";
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const role = user?.role || "student";

  return (
    <div
      className={`flex flex-col min-h-[100vh] ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      } transition-colors`}
    >
      {/* ===== TopBar ===== */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl ${
          darkMode
            ? "bg-gray-900/80 border-gray-800"
            : "bg-white/80 border-gray-200"
        } border-b shadow-sm transition`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* ===== Logo & Title ===== */}
          <div
            onClick={() =>
              navigate(
                role === "admin" || role === "superAdmin"
                  ? "/admin"
                  : "/dashboard"
              )
            }
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <img
              src="/favicon.ico"
              alt="logo"
              className="h-8 w-8 object-contain rounded-md shadow-sm"
            />
            <h1
              className={`text-lg sm:text-xl font-semibold tracking-wide ${
                darkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              Student Grievance Redressal Portal
            </h1>
          </div>

          {/* ===== Right Controls ===== */}
          <div className="flex items-center gap-4">
            {/* Quick navigation */}
            {role === "admin" || role === "superAdmin" ? (
              <Link
                to="/admin"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  darkMode
                    ? "bg-blue-800 text-blue-100 hover:bg-blue-700"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                } transition`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  darkMode
                    ? "bg-green-800 text-green-100 hover:bg-green-700"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                } transition`}
              >
                <Home size={16} /> My Complaints
              </Link>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              } transition`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${
                  user?.name || "User"
                }`}
                alt="avatar"
                className="h-8 w-8 rounded-full border"
              />
              <div className="flex flex-col text-sm leading-tight">
                <span className={darkMode ? "text-gray-100" : "text-gray-700"}>
                  {user?.name || "Guest"}
                </span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } capitalize`}
                >
                  {role}
                </span>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* ===== Page Body ===== */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="flex-grow max-w-7xl mx-auto px-4 py-6 w-full"
        >
          <Outlet context={{ darkMode, setDarkMode }} />
        </motion.main>
      </AnimatePresence>

      {/* ===== Shared Footer ===== */}
      <Footer darkMode={darkMode} />
    </div>
  );
}
