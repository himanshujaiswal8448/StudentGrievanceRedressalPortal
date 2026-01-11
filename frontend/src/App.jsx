import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthProvider from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import GeneralLayout from "./layouts/GeneralLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import VerifySignupOtp from "./pages/VerifySignupOtp.jsx";
import VerifyLoginOtp from "./pages/VerifyLoginOtp.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          {/* TopBar + Footer from GeneralLayout */}

          <Route element={<GeneralLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-signup-otp" element={<VerifySignupOtp />} />
            <Route path="/verify-login-otp" element={<VerifyLoginOtp />} />
          </Route>

          {/* ================= PROTECTED ROUTES ================= */}
          {/* TopBar + Footer from DashboardLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Student */}
            <Route path="/dashboard" element={<StudentDashboard />} />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
