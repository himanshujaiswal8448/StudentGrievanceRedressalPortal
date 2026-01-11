import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  Home,
  UserPlus,
  LogIn,
} from "lucide-react";

export default function TopBar({ darkMode, setDarkMode }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const isLoggedIn = !!user;
  const role = user?.role || "student";

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition ${
        darkMode
          ? "bg-gray-900/80 border-gray-800"
          : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* ===== Left Side: Logo / Title ===== */}
        <div
          onClick={() =>
            navigate(
              isLoggedIn && (role === "admin" || role === "superAdmin")
                ? "/admin"
                : "/"
            )
          }
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <img
            src="/favicon.ico"
            alt="logo"
            className="h-7 w-7 object-contain rounded-md"
          />
          <h1
            className={`text-xl font-semibold tracking-wide ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Student Grievance Redressal Portal
          </h1>
        </div>

        {/* ===== Right Side Controls ===== */}
        <div className="flex items-center gap-4">
          {/* === Dark Mode Toggle === */}
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

          {/* === If User is Logged In === */}
          {isLoggedIn ? (
            <>
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
                  to="/"
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                    darkMode
                      ? "bg-green-800 text-green-100 hover:bg-green-700"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  } transition`}
                >
                  <Home size={16} /> My Complaints
                </Link>
              )}

              {/* Profile Section */}
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
                  <span
                    className={darkMode ? "text-gray-100" : "text-gray-700"}
                  >
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

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            /* === If User is NOT Logged In === */
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  darkMode
                    ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <LogIn size={16} /> Login
              </Link>

              <Link
                to="/register"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  darkMode
                    ? "bg-blue-800 text-blue-100 hover:bg-blue-700"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                <UserPlus size={16} /> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
