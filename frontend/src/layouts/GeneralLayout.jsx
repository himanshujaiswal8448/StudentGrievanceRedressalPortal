import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar.jsx";
import Footer from "../components/Footer.jsx";

export default function GeneralLayout() {
  const [darkMode, setDarkMode] = useState(true);

  // Restore darkMode preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) setDarkMode(JSON.parse(stored));
  }, []);

  // Persist darkMode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      className={`flex flex-col min-h-[100vh] ${
        darkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Shared TopBar */}
      <TopBar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Page Content */}
      <main className="flex-grow flex flex-col justify-center px-4">
        <Outlet context={{ darkMode, setDarkMode }} />
      </main>

      {/* Shared Footer */}
      <Footer darkMode={darkMode} />
    </div>
  );
}
