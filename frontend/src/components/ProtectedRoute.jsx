// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // 🔴 WAIT until auth is restored
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Checking session...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection
  if (role && user.role !== role && user.role !== "superAdmin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
