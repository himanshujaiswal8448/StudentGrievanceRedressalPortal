// src/layout/Layout.jsx
import React, { useEffect, useState } from "react";
import TopBar from "../components/TopBar.jsx";
import Footer from "../components/Footer.jsx";

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  // Load user’s preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  // Save preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Shared Header */}
      <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Shared Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
}
