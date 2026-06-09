import React from "react";
import { Mail, Heart, Globe } from "lucide-react";

export default function Footer({ darkMode = true }) {
  return (
    <footer
      className={`mt-auto border-t transition-colors duration-300 ${
        darkMode
          ? "bg-gray-950 border-gray-800 text-gray-300"
          : "bg-gray-100 border-gray-300 text-gray-700"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* ===== Left Section ===== */}
          <div>
            <h2
              className={`text-lg font-semibold tracking-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Student Grievance Redressal Portal
            </h2>
            <p
              className={`text-sm mt-2 leading-relaxed max-w-md ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Empowering students to raise concerns and seek resolutions with
              fairness, transparency, and accountability.
            </p>
          </div>

          {/* ===== Right Section ===== */}
          <div className="text-sm flex flex-col items-center md:items-end gap-2">
            <p>
              <Mail
                size={14}
                className={`inline mr-2 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <a
                href="mailto:himanshujaiswal8448@gmail.com"
                className={`hover:underline ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Contact
              </a>
            </p>
            <p>
              <Globe
                size={14}
                className={`inline mr-2 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <a
                href="https://www.linkedin.com/in/himanshujaiswal8448"
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:underline ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                LinkedIn
              </a>
            </p>

            <p
              className={`flex items-center gap-1 text-xs ${
                darkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Made with <Heart size={13} className="text-red-500" /> for student
              empowerment
            </p>
          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div
          className={`mt-8 pt-4 text-center text-xs border-t ${
            darkMode ? "border-gray-800 text-gray-500" : "border-gray-300"
          }`}
        >
          © {new Date().getFullYear()} Student Grievance Portal. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
