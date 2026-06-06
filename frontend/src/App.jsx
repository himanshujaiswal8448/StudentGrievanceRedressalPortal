import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

import PaymentPage from "./pages/PaymentPage.jsx";
import MyPayments from "./pages/MyPayments.jsx";
import AllComplaints from "./pages/AllComplaints.jsx";
import AdminPayments from "./pages/AdminPayments.jsx";

import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route element={<GeneralLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-signup-otp" element={<VerifySignupOtp />} />
            <Route path="/verify-login-otp" element={<VerifyLoginOtp />} />
          </Route>

          {/* STUDENT ROUTES */}
          <Route
            element={
              <ProtectedRoute role="student">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/all-complaints" element={<AllComplaints />} />
            <Route path="/student/payment" element={<PaymentPage />} />
            <Route path="/student/my-payments" element={<MyPayments />} />
          </Route>

          <Route
            element={
              <ProtectedRoute role={["admin", "superAdmin"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
          </Route>

          {/* OLD ROUTE REDIRECTS */}
          <Route
            path="/dashboard"
            element={<Navigate to="/student" replace />}
          />
          <Route
            path="/payment"
            element={<Navigate to="/student/payment" replace />}
          />
          <Route
            path="/my-payments"
            element={<Navigate to="/student/my-payments" replace />}
          />
          <Route
            path="/all-complaints"
            element={<Navigate to="/student/all-complaints" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={<Navigate to="/admin" replace />}
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
